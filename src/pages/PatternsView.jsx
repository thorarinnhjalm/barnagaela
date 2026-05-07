import { useState, useMemo } from 'react';
import { useI18n } from '../data/i18n';
import { useActiveBaby, useSubcollection } from '../data/useTrackerData';

const PERIODS = [
  { key: 'today', days: 0 },
  { key: '7d', days: 7 },
  { key: '30d', days: 30 },
];

export default function PatternsView() {
  const { t } = useI18n();
  const p = t.tracker.patterns;
  const { activeBabyId } = useActiveBaby();
  const { entries: feedings } = useSubcollection(activeBabyId, 'feedings');
  const { entries: sleeps } = useSubcollection(activeBabyId, 'sleeps', 'startTime');
  const { entries: cryings } = useSubcollection(activeBabyId, 'cryings', 'startTime');
  const { entries: growth } = useSubcollection(activeBabyId, 'growth', 'date');

  const [period, setPeriod] = useState('7d');
  const periodLabels = { today: p.periodToday, '7d': p.period7d, '30d': p.period30d };

  const cutoff = useMemo(() => {
    if (period === 'today') {
      const d = new Date();
      d.setHours(0, 0, 0, 0);
      return d;
    }
    const days = PERIODS.find(pr => pr.key === period)?.days || 7;
    return new Date(Date.now() - days * 86400000);
  }, [period]);

  const filteredFeedings = feedings.filter(e => new Date(e.time) >= cutoff);
  const filteredSleeps = sleeps.filter(e => e.endTime && new Date(e.startTime) >= cutoff);
  const filteredCryings = cryings.filter(e => new Date(e.startTime) >= cutoff);

  const hasData = filteredFeedings.length > 0 || filteredSleeps.length > 0 || filteredCryings.length > 0 || growth.length >= 2;

  return (
    <div>
      <h3 style={{ fontSize: '1.15rem', color: 'var(--brown)', marginBottom: 16, fontFamily: "'DM Serif Display', serif" }}>{p.title}</h3>

      <div style={{ display: 'flex', gap: 6, marginBottom: 20 }}>
        {PERIODS.map(pr => (
          <button key={pr.key} onClick={() => setPeriod(pr.key)} style={{
            padding: '7px 14px', borderRadius: 999,
            border: period === pr.key ? '2px solid var(--sage)' : '1px solid var(--sage-light)',
            background: period === pr.key ? 'var(--sage)' : 'white',
            color: period === pr.key ? 'white' : 'var(--brown-light)',
            fontSize: '0.85rem', fontWeight: 500, cursor: 'pointer',
          }}>{periodLabels[pr.key]}</button>
        ))}
      </div>

      {!hasData ? (
        <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--brown-light)', fontSize: '0.95rem' }}>
          {p.noData}
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {filteredFeedings.length > 0 && (
            <ChartCard title={p.feedingChart}>
              <BarChartSVG data={groupByDay(filteredFeedings, 'time')} color="var(--peach)" />
            </ChartCard>
          )}
          {filteredSleeps.length > 0 && (
            <ChartCard title={p.sleepChart}>
              <BarChartSVG data={groupByDaySum(filteredSleeps, 'startTime', 'durationMin')} color="var(--sage)" unit="min" />
            </ChartCard>
          )}
          {filteredCryings.length > 0 && (
            <ChartCard title={p.cryingChart}>
              <BarChartSVG data={groupByDaySum(filteredCryings, 'startTime', 'durationMin')} color="var(--peach-deep)" unit="min" />
            </ChartCard>
          )}
        </div>
      )}
    </div>
  );
}

function ChartCard({ title, children }) {
  return (
    <div style={{ background: 'white', borderRadius: 16, padding: '16px', border: '1px solid var(--sage-light)' }}>
      <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--brown-light)', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 8 }}>{title}</div>
      {children}
    </div>
  );
}

function groupByDay(entries, timeField) {
  const groups = {};
  entries.forEach(e => {
    const day = new Date(e[timeField]).toISOString().split('T')[0];
    groups[day] = (groups[day] || 0) + 1;
  });
  return Object.entries(groups).sort((a, b) => a[0].localeCompare(b[0])).map(([day, count]) => ({ day, value: count }));
}

function groupByDaySum(entries, timeField, sumField) {
  const groups = {};
  entries.forEach(e => {
    const day = new Date(e[timeField]).toISOString().split('T')[0];
    groups[day] = (groups[day] || 0) + (e[sumField] || 0);
  });
  return Object.entries(groups).sort((a, b) => a[0].localeCompare(b[0])).map(([day, value]) => ({ day, value }));
}

function BarChartSVG({ data, color, unit }) {
  if (data.length === 0) return null;
  const W = 320;
  const H = 120;
  const pad = { top: 6, right: 6, bottom: 20, left: 6 };
  const maxVal = Math.max(...data.map(d => d.value), 1);
  const barW = Math.min(32, (W - pad.left - pad.right) / data.length - 4);

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', height: 'auto' }}>
      {data.map((d, i) => {
        const x = pad.left + (i / data.length) * (W - pad.left - pad.right) + barW * 0.25;
        const barH = (d.value / maxVal) * (H - pad.top - pad.bottom - 14);
        const y = H - pad.bottom - barH;
        const label = d.day.slice(5);
        return (
          <g key={d.day}>
            <rect x={x} y={y} width={barW} height={barH} rx={4} fill={color} opacity={0.85} />
            <text x={x + barW / 2} y={y - 3} textAnchor="middle" fontSize="8" fill="var(--brown)" fontWeight="600">
              {d.value}{unit ? '' : ''}
            </text>
            <text x={x + barW / 2} y={H - 4} textAnchor="middle" fontSize="7" fill="var(--brown-light)">
              {label}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
