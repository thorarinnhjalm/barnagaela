import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export default function AccordionItem({ title, body, index }) {
  const [open, setOpen] = useState(false);

  return (
    <div
      style={{
        borderBottom: '1px solid var(--sage-light)',
        paddingBottom: open ? '0' : '0',
      }}
    >
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: '100%',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '1.1rem 0',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          textAlign: 'left',
          gap: '1rem',
        }}
        aria-expanded={open}
      >
        <span
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontWeight: 500,
            fontSize: '1rem',
            color: 'var(--brown)',
          }}
        >
          {title}
        </span>
        <ChevronDown
          size={18}
          style={{
            color: 'var(--sage)',
            flexShrink: 0,
            transition: 'transform 0.3s ease',
            transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
          }}
        />
      </button>

      <div className={`accordion-body ${open ? 'open' : 'closed'}`}>
        <p
          style={{
            color: 'var(--brown-light)',
            fontSize: '0.95rem',
            lineHeight: 1.7,
            paddingBottom: '1.1rem',
          }}
        >
          {body}
        </p>
      </div>
    </div>
  );
}
