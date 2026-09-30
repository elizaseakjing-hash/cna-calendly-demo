import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { SEED_PODCASTS, SEED_VIDEOS, timeAgo } from '../../js/data.js';
import { usePublishedArticles } from '../hooks/usePublishedArticles.js';

const FACETS = ['All', 'Article', 'Podcast', 'Video', '8days'];

export default function SearchOverlay({ open, onClose }) {
  const articles = usePublishedArticles();
  const navigate = useNavigate();
  const [facet, setFacet] = useState('All');
  const [query, setQuery] = useState('');
  const [hits, setHits] = useState([]);
  const inputRef = useRef(null);

  // Reset + focus whenever the overlay opens.
  useEffect(() => {
    if (!open) return;
    setQuery('');
    setFacet('All');
    setHits([]);
    const t = setTimeout(() => inputRef.current && inputRef.current.focus(), 30);
    return () => clearTimeout(t);
  }, [open]);

  // Re-run the search whenever the query, facet or article list changes.
  useEffect(() => {
    if (!open) return;
    const q = query.trim().toLowerCase();
    const next = [];

    if (!q) {
      for (const a of articles.slice(0, 5)) {
        next.push({ type: 'Article', title: a.title, id: a.id, meta: `${a.category} · ${timeAgo(a.date)}` });
      }
    } else {
      if (facet === 'All' || facet === 'Article') {
        for (const a of articles) {
          if (`${a.title} ${a.summary} ${a.category}`.toLowerCase().includes(q)) {
            next.push({ type: 'Article', title: a.title, id: a.id, meta: `${a.category} · ${timeAgo(a.date)}` });
          }
        }
      }
      if (facet === 'All' || facet === 'Podcast') {
        for (const p of SEED_PODCASTS) {
          if (`${p.title} ${p.show}`.toLowerCase().includes(q)) {
            next.push({ type: 'Podcast', title: p.title, id: p.id, meta: `${p.show} · ${p.dur}` });
          }
        }
      }
      if (facet === 'All' || facet === 'Video') {
        for (const v of SEED_VIDEOS) {
          if (v.title.toLowerCase().includes(q)) {
            next.push({ type: 'Video', title: v.title, id: v.id, meta: `${v.kind} · ${v.dur}` });
          }
        }
      }
    }
    setHits(next.slice(0, 30));
  }, [query, facet, articles, open]);

  // Close on Escape.
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  const openNonArticle = (e) => {
    e.preventDefault();
    onClose();
    navigate('/#watch-listen');
  };

  return (
    <div
      className="search-overlay"
      id="search-overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="search-panel">
        <div className="search-bar">
          <span style={{ fontSize: '1.1rem' }}>🔍</span>
          <input
            ref={inputRef}
            type="text"
            id="search-input"
            placeholder="Search keywords, topics and more"
            autoComplete="off"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button className="icon-btn" id="search-close" aria-label="Close search" onClick={onClose}>✕</button>
        </div>
        <div className="facets" id="search-facets">
          {FACETS.map((name) => (
            <button
              key={name}
              className={facet === name ? 'facet active' : 'facet'}
              data-facet={name}
              onClick={() => setFacet(name)}
            >
              {name}
            </button>
          ))}
        </div>
        <div className="search-results" id="search-results">
          {hits.length === 0 ? (
            <p className="empty">No results for “{query.trim()}”.</p>
          ) : (
            hits.map((h) =>
              h.type === 'Article' ? (
                <Link key={`${h.type}-${h.id}`} className="search-hit" to={`/article/${h.id}`} onClick={onClose}>
                  <div style={{ flex: 1 }}>
                    <div className="sh-cat">{h.type}</div>
                    <h4>{h.title}</h4>
                    <div className="meta">{h.meta}</div>
                  </div>
                </Link>
              ) : (
                <a key={`${h.type}-${h.id}`} className="search-hit" href="#watch-listen" onClick={openNonArticle}>
                  <div style={{ flex: 1 }}>
                    <div className="sh-cat">{h.type}</div>
                    <h4>{h.title}</h4>
                    <div className="meta">{h.meta}</div>
                  </div>
                </a>
              )
            )
          )}
        </div>
      </div>
    </div>
  );
}
