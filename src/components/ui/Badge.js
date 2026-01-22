import './Badge.css';

function Badge({ children, variant = "default", className = "" }) {
  const variants = {
    default: "badge-default",
    success: "badge-success",
    error: "badge-error",
  };

  return (
    <span className={`badge ${variants[variant]} ${className}`}>{children}</span>
  );
}

export default Badge;
