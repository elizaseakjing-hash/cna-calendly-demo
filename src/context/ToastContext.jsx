import { createContext, useCallback, useContext, useRef, useState } from 'react';

const ToastContext = createContext(() => {});

export function useToast() {
  return useContext(ToastContext);
}

export function ToastProvider({ children }) {
  const [message, setMessage] = useState('');
  const timerRef = useRef(null);

  const showToast = useCallback((msg) => {
    setMessage(msg);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setMessage(''), 2200);
  }, []);

  return (
    <ToastContext.Provider value={showToast}>
      {children}
      <div className={message ? 'toast show' : 'toast'} id="toast">{message}</div>
    </ToastContext.Provider>
  );
}
