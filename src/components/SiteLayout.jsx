import { useState } from 'react';
import { Link, Outlet } from 'react-router-dom';
import Header from './Header.jsx';
import Footer from './Footer.jsx';
import SearchOverlay from './SearchOverlay.jsx';
import CookieBanner from './CookieBanner.jsx';

export default function SiteLayout() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [announceVisible, setAnnounceVisible] = useState(true);

  return (
    <>
      {announceVisible ? (
        <div className="announce" id="announce">
          Get the <Link to="/#newsletter">Morning Brief</Link> — CNA's daily newsletter, delivered to your inbox.
          <button
            className="close"
            id="announce-close"
            aria-label="Dismiss announcement"
            onClick={() => setAnnounceVisible(false)}
          >
            ✕
          </button>
        </div>
      ) : null}

      <Header onOpenSearch={() => setSearchOpen(true)} />

      <Outlet />

      <Footer />
      <CookieBanner />
      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
