import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Info, CheckCircle2 } from 'lucide-react';
import './Modal.css';

const ICONS = {
  info: Info,
  danger: AlertTriangle,
  success: CheckCircle2,
};

export default function Modal({
  open,
  variant = 'info',
  title,
  message,
  confirmLabel = 'Լավ',
  cancelLabel,
  onConfirm,
  onCancel,
}) {
  useEffect(() => {
    if (!open) return undefined;
    const handler = (e) => {
      if (e.key === 'Escape') (onCancel || onConfirm)?.();
      if (e.key === 'Enter') onConfirm?.();
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [open, onConfirm, onCancel]);

  const Icon = ICONS[variant] || Info;

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          className="modal-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) (onCancel || onConfirm)?.();
          }}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
            className={`modal-card modal-card--${variant}`}
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.97 }}
            transition={{ duration: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <div className="modal-head">
              <span className={`modal-icon modal-icon--${variant}`}>
                <Icon size={20} strokeWidth={2.4} />
              </span>
              <div className="modal-textbox">
                {title && <h3 id="modal-title" className="modal-title">{title}</h3>}
                {message && <p className="modal-message">{message}</p>}
              </div>
            </div>

            <div className="modal-actions">
              {cancelLabel && (
                <button
                  type="button"
                  className="modal-btn modal-btn--cancel"
                  onClick={onCancel}
                >
                  {cancelLabel}
                </button>
              )}
              <button
                type="button"
                className={
                  variant === 'danger'
                    ? 'modal-btn modal-btn--danger'
                    : 'modal-btn modal-btn--primary'
                }
                onClick={onConfirm}
                autoFocus
              >
                {confirmLabel}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
