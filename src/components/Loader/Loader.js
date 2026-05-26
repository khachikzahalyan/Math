import './Loader.css';

export default function Loader({ label = 'Բեռնում…' }) {
  return (
    <div className="app-loader" role="status" aria-live="polite">
      <div className="app-loader__spinner" />
      <p className="app-loader__label">{label}</p>
    </div>
  );
}
