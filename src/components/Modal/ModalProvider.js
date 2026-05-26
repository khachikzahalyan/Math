import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import Modal from './Modal';
import ToastStack from './ToastStack';

const ModalCtx = createContext(null);

export function ModalProvider({ children }) {
  const [state, setState] = useState(null);
  const [toasts, setToasts] = useState([]);
  const resolverRef = useRef(null);
  const toastIdRef = useRef(0);
  const timersRef = useRef(new Map());

  const close = useCallback((result) => {
    resolverRef.current?.(result);
    resolverRef.current = null;
    setState(null);
  }, []);

  const alert = useCallback((opts) => {
    return new Promise((resolve) => {
      resolverRef.current?.(false);
      resolverRef.current = resolve;
      setState({
        variant: opts?.variant || 'info',
        title: opts?.title || '',
        message: opts?.message || '',
        confirmLabel: opts?.confirmLabel || 'Լավ',
        cancelLabel: null,
      });
    });
  }, []);

  const confirm = useCallback((opts) => {
    return new Promise((resolve) => {
      resolverRef.current?.(false);
      resolverRef.current = resolve;
      setState({
        variant: opts?.variant || 'danger',
        title: opts?.title || 'Հաստատե՞լ գործողությունը',
        message: opts?.message || '',
        confirmLabel: opts?.confirmLabel || 'Հաստատել',
        cancelLabel: opts?.cancelLabel || 'Չեղարկել',
      });
    });
  }, []);

  const dismissToast = useCallback((id) => {
    const t = timersRef.current.get(id);
    if (t) {
      clearTimeout(t);
      timersRef.current.delete(id);
    }
    setToasts((prev) => prev.filter((x) => x.id !== id));
  }, []);

  const toast = useCallback((message, opts = {}) => {
    const id = ++toastIdRef.current;
    const duration = opts.duration ?? 2800;
    setToasts((prev) => [...prev, { id, message, variant: opts.variant || 'success' }]);
    const timer = setTimeout(() => dismissToast(id), duration);
    timersRef.current.set(id, timer);
    return id;
  }, [dismissToast]);

  useEffect(() => {
    const timers = timersRef.current;
    return () => {
      timers.forEach((t) => clearTimeout(t));
      timers.clear();
    };
  }, []);

  const api = useMemo(() => ({ alert, confirm, toast }), [alert, confirm, toast]);

  return (
    <ModalCtx.Provider value={api}>
      {children}
      <Modal
        open={!!state}
        variant={state?.variant}
        title={state?.title}
        message={state?.message}
        confirmLabel={state?.confirmLabel}
        cancelLabel={state?.cancelLabel}
        onConfirm={() => close(true)}
        onCancel={() => close(false)}
      />
      <ToastStack toasts={toasts} onDismiss={dismissToast} />
    </ModalCtx.Provider>
  );
}

export function useModal() {
  const ctx = useContext(ModalCtx);
  if (!ctx) throw new Error('useModal must be used inside <ModalProvider>');
  return ctx;
}
