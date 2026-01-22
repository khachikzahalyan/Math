import './Input.css';

function Input({ label, className = "", ...props }) {
  return (
    <div className="input-group">
      {label && <label>{label}</label>}
      <input className={`input ${className}`} {...props} />
    </div>
  );
}

export default Input;
