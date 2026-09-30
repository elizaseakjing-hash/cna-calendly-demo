import { useEffect, useState } from 'react';
import { getArticles } from '../../js/data.js';

// Returns the published articles sorted newest-first, loaded once per mount.
export function usePublishedArticles() {
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    let cancelled = false;
    getArticles().then((all) => {
      if (cancelled) return;
      setArticles(
        all
          .filter((a) => a.published)
          .sort((a, b) => new Date(b.date) - new Date(a.date))
      );
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return articles;
}
