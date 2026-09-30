import { useEffect, useState } from 'react';
import { useToast } from '../context/ToastContext.jsx';

export default function CookieBanner() {
  const toast = useToast();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => {
      if (!localStorage.getItem('cna_cookie_choice')) setVisible(true);
    }, 600);
    return () => clearTimeout(t);
  }, []);

  const choose = (val) => {
    localStorage.setItem('cna_cookie_choice', val);
    setVisible(false);
    if (val === 'accept') toast('Preferences saved');
  };

  if (!visible) return null;

  return (
    <div className="cookie-banner" id="cookie-banner">
      <p>
        We use cookies and similar technologies to improve and personalise your experience, to understand
        website interactions, and for marketing. Learn more in our <a href="#">privacy notice</a>.
      </p>
      <div className="cookie-actions">
        <button className="btn-outline btn" id="cookie-decline" onClick={() => choose('decline')}>Decline</button>
        <button className="btn" id="cookie-accept" onClick={() => choose('accept')}>I understand</button>
        <button className="btn-ghost btn" id="cookie-settings" onClick={() => toast('Cookie settings are managed by your browser')}>
          Cookie settings →
        </button>
      </div>
    </div>
  );
}
