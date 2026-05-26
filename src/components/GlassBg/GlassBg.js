import './GlassBg.css';

const MATH_SYMBOLS = [
  { char: 'π', top: '12%', left: '7%',  size: '2.4rem', delay: '0s',   dur: '18s', anim: 'symbolFloat1' },
  { char: '∑', top: '18%', left: '88%', size: '2rem',   delay: '2s',   dur: '22s', anim: 'symbolFloat2' },
  { char: '√', top: '72%', left: '9%',  size: '2.2rem', delay: '1s',   dur: '16s', anim: 'symbolFloat3' },
  { char: '∞', top: '66%', left: '86%', size: '2.6rem', delay: '5s',   dur: '20s', anim: 'symbolFloat1' },
  { char: 'Δ', top: '6%',  left: '48%', size: '1.6rem', delay: '3s',   dur: '19s', anim: 'symbolFloat2' },
  { char: '±', top: '82%', left: '56%', size: '1.8rem', delay: '4s',   dur: '17s', anim: 'symbolFloat3' },
  { char: '∫', top: '28%', left: '94%', size: '2.3rem', delay: '6s',   dur: '21s', anim: 'symbolFloat1' },
  { char: '≠', top: '52%', left: '3%',  size: '1.7rem', delay: '7s',   dur: '15s', anim: 'symbolFloat2' },
  { char: 'φ', top: '5%',  left: '74%', size: '1.9rem', delay: '1.5s', dur: '23s', anim: 'symbolFloat3' },
  { char: '÷', top: '86%', left: '26%', size: '1.5rem', delay: '3.5s', dur: '18s', anim: 'symbolFloat1' },
  { char: 'λ', top: '40%', left: '96%', size: '1.8rem', delay: '8s',   dur: '20s', anim: 'symbolFloat2' },
  { char: '×', top: '58%', left: '16%', size: '1.4rem', delay: '2.5s', dur: '16s', anim: 'symbolFloat3' },
];

function GlassBg() {
  return (
    <div className="glassBg" aria-hidden>
      {MATH_SYMBOLS.map((s, i) => (
        <span
          key={i}
          className="glassBg__symbol"
          style={{
            top: s.top,
            left: s.left,
            fontSize: s.size,
            animationName: s.anim,
            animationDuration: s.dur,
            animationDelay: s.delay,
            animationTimingFunction: 'ease-in-out',
            animationIterationCount: 'infinite',
          }}
        >
          {s.char}
        </span>
      ))}
    </div>
  );
}

export default GlassBg;
