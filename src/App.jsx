import { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { ToastProvider } from './context/ToastContext.jsx';
import { EditionProvider } from './context/EditionContext.jsx';
import SiteLayout from './components/SiteLayout.jsx';
import HomePage from './pages/HomePage.jsx';
import ArticlePage from './pages/ArticlePage.jsx';
import PublisherPage from './pages/PublisherPage.jsx';

// After each navigation, scroll to the target hash element (e.g. #latest)
// or back to the top of the page.
function ScrollManager() {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const el = document.getElementById(location.hash.slice(1));
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
        return;
      }
    }
    window.scrollTo(0, 0);
  }, [location.pathname, location.hash]);

  return null;
}

export default function App() {
  return (
    <ToastProvider>
      <EditionProvider>
        <ScrollManager />
        <Routes>
          <Route element={<SiteLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/article/:id" element={<ArticlePage />} />
          </Route>
          <Route path="/publisher" element={<PublisherPage />} />
        </Routes>
      </EditionProvider>
    </ToastProvider>
  );
}
