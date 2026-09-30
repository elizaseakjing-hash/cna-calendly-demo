import { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { EDITIONS } from '../../js/data.js';
import { useEdition } from '../context/EditionContext.jsx';
import { useToast } from '../context/ToastContext.jsx';

const NAV_CHIPS = ['Singapore', 'Asia', 'East Asia'];

export default function Header({ onOpenSearch }) {
  const { edition, setEdition } = useEdition();
  const toast = useToast();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [editionOpen, setEditionOpen] = useState(false);
  const editionBtnRef = useRef(null);
  const editionMenuRef = useRef(null);

  const isHome = location.pathname === '/';

  // Close the edition dropdown when clicking anywhere outside it.
  useEffect(() => {
    if (!editionOpen) return;
    const onDocClick = (e) => {
      const inBtn = editionBtnRef.current && editionBtnRef.current.contains(e.target);
      const inMenu = editionMenuRef.current && editionMenuRef.current.contains(e.target);
      if (!inBtn && !inMenu) setEditionOpen(false);
    };
    document.addEventListener('click', onDocClick);
    return () => document.removeEventListener('click', onDocClick);
  }, [editionOpen]);

  const pickEdition = (e) => {
    const item = e.target.closest('.edition-item');
    if (!item) return;
    e.preventDefault();
    setEdition(item.dataset.name);
    setEditionOpen(false);
    toast('Edition switched to ' + item.dataset.name);
  };

  return (
    <header className="site-header">
      <div className="header-inner">
        <button
          className="icon-btn menu-toggle"
          id="menu-toggle"
          aria-label="Open menu"
          onClick={() => setMenuOpen((v) => !v)}
        >
          ☰
        </button>
        <Link to="/" className="logo">
          <span className="mark">C</span>
          CNA
          <small>News</small>
        </Link>
        <nav className={menuOpen ? 'main-nav open' : 'main-nav'} id="main-nav">
          <Link to="/#top-stories" className={isHome ? 'active' : ''}>Top Stories</Link>
          <Link to="/#latest">Latest News</Link>
          {NAV_CHIPS.map((chip) => (
            <Link key={chip} to={`/?chip=${encodeURIComponent(chip)}#latest`}>{chip}</Link>
          ))}
          <Link to="/#commentary">Commentary</Link>
          <Link to="/#watch-listen">Insider</Link>
          <Link to="/#watch-listen">Watch</Link>
          <Link to="/#watch-listen">Listen</Link>
        </nav>
        <div className="header-actions">
          <button className="icon-btn" id="search-open" aria-label="Search" onClick={onOpenSearch}>🔍</button>
          <button
            className="edition-btn"
            id="edition-btn"
            ref={editionBtnRef}
            onClick={() => setEditionOpen((v) => !v)}
          >
            🌐 <span id="edition-label">{edition}</span> <span className="caret">▾</span>
          </button>
          <Link to="/publisher" className="btn-outline btn" id="signin-btn">Sign In</Link>
          <Link to="/#newsletter" className="btn" id="cta-btn">Subscribe</Link>
        </div>
      </div>

      {editionOpen ? (
        <div className="wrap" id="edition-menu" ref={editionMenuRef}>
          <div
            className="edition-pop"
            style={{
              background: '#fff',
              border: '1px solid var(--line)',
              borderRadius: 16,
              boxShadow: 'var(--shadow)',
              padding: '.5rem',
              maxWidth: 220,
              marginLeft: 'auto',
              marginBottom: '1rem',
            }}
          >
            <div className="edition-list" id="edition-list" onClick={pickEdition}>
              {EDITIONS.map((e) => (
                <a
                  key={e.id}
                  href="#"
                  className="edition-item"
                  data-ed={e.id}
                  data-name={e.name}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    gap: '.6rem',
                    padding: '.55rem .8rem',
                    borderRadius: 12,
                    fontSize: '.92rem',
                    fontWeight: 600,
                    color: 'var(--ink)',
                  }}
                >
                  <span>{e.name}</span>
                  <span style={{ color: 'var(--muted-2)', fontWeight: 400, fontSize: '.82rem' }}>{e.label}</span>
                </a>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </header>
  );
}
