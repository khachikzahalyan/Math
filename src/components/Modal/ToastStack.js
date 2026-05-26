import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertTriangle, Info, X } from 'lucide-react';
import './ToastStack.css';

const ICONS = {
  success: CheckCircle2,
  danger: AlertTriangle,
  info: Info,
};

export default function ToastStack({ toasts, onDismiss }) {
  return createPortal(
    <div className="toastStack" aria-live="polite" aria-atomic="false">
      <AnimatePresence initial={false}>
        {toasts.map((t) => {
          const Icon = t.icon || ICONS[t.variant] || CheckCircle2;
          const iconStyle = t.iconFrom && t.iconTo
            ? { background: `linear-gradient(135deg, ${t.iconFrom}, ${t.iconTo})` }
            : undefined;
          return (
            <motion.div
              key={t.id}
              className={`toast toast--${t.variant}`}
              role="status"
              initial={{ opacity: 0, y: -16, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.97 }}
              transition={{ duration: 0.22, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              <span className="toast__icon" style={iconStyle}>
                <Icon size={18} strokeWidth={2.4} />
              </span>
              <span className="toast__message">{t.message}</span>
              <button
                type="button"
                className="toast__close"
                onClick={() => onDismiss(t.id)}
                aria-label="Փակել"
              >
                <X size={14} strokeWidth={2.4} />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>,
    document.body,
  );
}
