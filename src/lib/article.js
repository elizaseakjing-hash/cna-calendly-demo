export function initials(name) {
  return (name || '?').split(/\s+/).map((w) => w[0]).join('').slice(0, 2).toUpperCase();
}

export function fastSummary(article) {
  const first = article.summary;
  const second = (article.content || '').split(/\n\n/)[1] || '';
  const extra = second.split(/\.\s+/).slice(0, 1).join('. ').replace(/\.+$/, '');
  return first + (extra ? ' ' + extra + '.' : '');
}

export function shareTargets(url, title) {
  const u = encodeURIComponent(url);
  const t = encodeURIComponent(title);
  return [
    { name: 'WhatsApp', ic: '🟢', href: `https://wa.me/?text=${t}%20${u}` },
    { name: 'Telegram', ic: '✈️', href: `https://t.me/share/url?url=${u}&text=${t}` },
    { name: 'Facebook', ic: '🔵', href: `https://www.facebook.com/sharer/sharer.php?u=${u}` },
    { name: 'X', ic: '🐦', href: `https://twitter.com/intent/tweet?text=${t}&url=${u}` },
    { name: 'LinkedIn', ic: '💼', href: `https://www.linkedin.com/sharing/share-offsite/?url=${u}` },
    { name: 'Email', ic: '✉️', href: `mailto:?subject=${t}&body=${u}` },
    { name: 'Copy link', ic: '🔗', copy: true },
    { name: 'Bookmark', ic: '🔖', bookmark: true },
  ];
}
