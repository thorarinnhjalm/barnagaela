import { useState, useEffect, useRef } from 'react';
import { useI18n } from '../data/i18n';

export default function BreathingButton({ size = 220, compact = false, onDone }) {
  const { t } = useI18n();
  const b = t.breathing;

  const PHASES = [
    { name: b.breatheIn, ms: 4000, scale: 1.0 },
    { name: b.hold,      ms: 4000, scale: 1.0 },
    { name: b.breatheOut, ms: 6000, scale: 0.45 },
    { name: b.hold,      ms: 2000, scale: 0.45 },
  ];

  const [holding, setHolding] = useState(false);
  const [phaseIdx, setPhaseIdx] = useState(0);
  const [cycles, setCycles] = useState(0);
  const timerRef = useRef(null);

  useEffect(() => {
    if (!holding) return;
    const phase = PHASES[phaseIdx];
    timerRef.current = setTimeout(() => {
      setPhaseIdx(p => {
        const next = (p + 1) % PHASES.length;
        if (next === 0) setCycles(c => c + 1);
        return next;
      });
    }, phase.ms);
    return () => clearTimeout(timerRef.current);
  }, [holding, phaseIdx]);

  const start = (e) => {
    e?.preventDefault?.();
    setHolding(true);
    setPhaseIdx(0);
  };
  const stop = () => {
    clearTimeout(timerRef.current);
    setHolding(false);
    setPhaseIdx(0);
    if (cycles > 0 && onDone) onDone(cycles);
  };

  const phase = PHASES[phaseIdx];
  const targetScale = holding ? phase.scale : 0.7;
  const transitionMs = holding ? phase.ms : 600;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: compact ? 12 : 18, userSelect: 'none', WebkitUserSelect: 'none', touchAction: 'none' }}>
      <div style={{ position: 'relative', width: size, height: size, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', border: '1.5px dashed var(--brown-faint)' }} />
        <div style={{ position: 'absolute', width: '100%', height: '100%', borderRadius: '50%', background: 'radial-gradient(circle, var(--peach-light) 0%, transparent 70%)', transform: `scale(${targetScale * 1.15})`, transition: `transform ${transitionMs}ms cubic-bezier(.42,0,.58,1)`, opacity: holding ? 0.9 : 0.5 }} />
        <button
          onMouseDown={start} onMouseUp={stop} onMouseLeave={stop}
          onTouchStart={start} onTouchEnd={stop} onTouchCancel={stop}
          aria-label={b.ariaLabel}
          style={{
            position: 'relative', width: '100%', height: '100%', borderRadius: '50%', border: 'none',
            background: holding
              ? 'radial-gradient(circle at 35% 30%, var(--sage), var(--sage-deep))'
              : 'radial-gradient(circle at 35% 30%, var(--peach), var(--peach-deep))',
            transform: `scale(${targetScale})`,
            transition: `transform ${transitionMs}ms cubic-bezier(.42,0,.58,1), background .8s ease, box-shadow .4s ease`,
            cursor: 'pointer',
            boxShadow: holding
              ? '0 0 0 1px rgba(255,255,255,.3) inset, 0 20px 50px -10px rgba(80,110,90,.5)'
              : '0 0 0 1px rgba(255,255,255,.3) inset, 0 12px 30px -10px rgba(200,140,100,.5)',
            color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: 0,
          }}
        >
          <span style={{ fontFamily: "'DM Serif Display', serif", fontSize: compact ? 15 : 18, opacity: 0.95, lineHeight: 1.2, padding: '0 18px', textShadow: '0 1px 2px rgba(0,0,0,.1)' }}>
            {holding ? phase.name : b.holdButton}
          </span>
        </button>
      </div>

      <div style={{ textAlign: 'center', minHeight: compact ? 32 : 44 }}>
        {holding ? (
          <div style={{ fontSize: compact ? 12 : 13, color: 'var(--brown-light)', letterSpacing: '.04em' }}>
            {cycles === 0 ? b.followCircle : `${cycles} ${cycles === 1 ? b.cyclesSingular : b.cyclesPlural}`}
          </div>
        ) : (
          <>
            <div style={{ fontSize: compact ? 13 : 15, color: 'var(--brown)', fontFamily: "'DM Serif Display', serif" }}>{b.holdInstruction}</div>
            <div style={{ fontSize: 12, color: 'var(--brown-light)', marginTop: 2 }}>{b.timing}</div>
          </>
        )}
      </div>
    </div>
  );
}
