import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  CATEGORIES,
  getArticleById,
  getArticles,
  makeId,
  saveArticles,
  formatDate,
} from '../../js/data.js';
import { useToast } from '../context/ToastContext.jsx';

const AUTH_KEY = 'cna_news_pub_auth';
const DEMO_USER = 'publisher';
const DEMO_PASS = 'cna2026';

const BRAND_CAMPAIGNS = [
  { badge: 'Customised Campaign', title: 'Shaping Tomorrow — Building an AI-ready Singapore', blurb: 'A co-branded series with Temasek on AI adoption and the future of work.', grad: 'linear-gradient(135deg,#071A31,#0d3a66)' },
  { badge: 'Social Reels', title: 'Taste the thrill of race season at Marina Bay Sands', blurb: 'Short-form social content driving F1 weekend engagement.', grad: 'linear-gradient(135deg,#0d5ca6,#083b6b)' },
  { badge: 'Videos', title: "Founders' Memorial: Semangat Yang Bahru", blurb: 'An emotive branded documentary on national identity.', grad: 'linear-gradient(135deg,#5a2fb0,#381e6e)' },
  { badge: 'Customised Campaign', title: 'InsureXpo 2026 by CIMB: Enter The Money Gym', blurb: 'A gamified financial-literacy microsite for a banking partner.', grad: 'linear-gradient(135deg,#1d7a4f,#115336)' },
];

const AD_TYPES = [
  { badge: 'Display', title: 'Banner Ads', blurb: 'High-impact display placements across the CNA site and app.' },
  { badge: 'Native', title: 'Sponsored Content', blurb: 'Editorially-led advertorials clearly labelled and brand-safe.' },
  { badge: 'Video', title: 'Pre-roll & Outstream', blurb: 'Video advertising across live TV, on-demand and podcasts.' },
  { badge: 'Newsletter', title: 'Email Sponsorships', blurb: 'Reach inboxes through the Morning Brief and other newsletters.' },
];

const EMPTY_FORM = { title: '', category: CATEGORIES[0], summary: '', content: '', featured: false };

export default function PublisherPage() {
  const toast = useToast();
  const [authed, setAuthed] = useState(() => sessionStorage.getItem(AUTH_KEY) === 'true');
  const [articles, setArticles] = useState([]);
  const [editorOpen, setEditorOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  const loadArticles = useCallback(async () => {
    const list = await getArticles();
    setArticles(list);
  }, []);

  useEffect(() => {
    if (authed) loadArticles();
  }, [authed, loadArticles]);

  const login = () => {
    sessionStorage.setItem(AUTH_KEY, 'true');
    setAuthed(true);
    setLoginError('');
    toast('Signed in as publisher');
  };

  const logout = () => {
    sessionStorage.removeItem(AUTH_KEY);
    setAuthed(false);
    setEditorOpen(false);
  };

  const submitLogin = (e) => {
    e.preventDefault();
    if (username.trim() === DEMO_USER && password === DEMO_PASS) {
      login();
    } else {
      setLoginError('Invalid credentials. Try publisher / cna2026.');
    }
  };

  const openEditor = async (id) => {
    if (id) {
      const a = await getArticleById(id);
      if (!a) {
        toast('Article not found');
        return;
      }
      setEditId(a.id);
      setForm({ title: a.title, category: a.category, summary: a.summary, content: a.content, featured: !!a.featured });
    } else {
      setEditId(null);
      setForm(EMPTY_FORM);
    }
    setEditorOpen(true);
  };

  const closeEditor = () => {
    setEditorOpen(false);
    setEditId(null);
  };

  const saveArticle = async (publish) => {
    const data = {
      title: form.title.trim(),
      category: form.category,
      summary: form.summary.trim(),
      content: form.content.trim(),
      featured: form.featured,
    };
    if (!data.title || !data.summary || !data.content) {
      toast('Headline, summary and content are required');
      return;
    }

    const list = await getArticles();
    if (editId) {
      const i = list.findIndex((a) => a.id === editId);
      if (i === -1) {
        toast('Article no longer exists');
        return;
      }
      list[i] = { ...list[i], ...data, published: publish };
    } else {
      list.unshift({
        id: makeId(),
        author: 'Newsroom',
        date: new Date().toISOString(),
        published: publish,
        ...data,
      });
    }
    await saveArticles(list);
    closeEditor();
    await loadArticles();
    toast(publish ? 'Article published' : 'Draft saved');
  };

  const togglePublish = async (id) => {
    const list = (await getArticles()).map((a) => (a.id === id ? { ...a, published: !a.published } : a));
    await saveArticles(list);
    await loadArticles();
    toast('Status updated');
  };

  const deleteArticle = async (id) => {
    if (!window.confirm('Delete this article permanently?')) return;
    const remaining = (await getArticles()).filter((a) => a.id !== id);
    await saveArticles(remaining);
    await loadArticles();
    toast('Article deleted');
  };

  const updateField = (key) => (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const sorted = [...articles].sort((a, b) => new Date(b.date) - new Date(a.date));
  const pubCount = articles.filter((a) => a.published).length;
  const draftCount = articles.length - pubCount;
  const featuredCount = articles.filter((a) => a.featured).length;

  return (
    <>
      <header className="site-header">
        <div className="header-inner">
          <Link to="/" className="logo">
            <span className="mark">C</span>
            CNA
            <small>Publisher</small>
          </Link>
          <nav className="main-nav" id="main-nav">
            <a href="#dashboard" className="active">Dashboard</a>
            <a href="#brand-studio">Brand Studio</a>
            <a href="#advertise">Advertise With Us</a>
          </nav>
          <div className="header-actions">
            <Link to="/" className="btn-outline btn">View Site</Link>
            <Link to="/#newsletter" className="btn">Get the app</Link>
          </div>
        </div>
      </header>

      <main className="wrap section" style={{ paddingTop: '2.5rem' }}>
        {!authed ? (
          <section id="login-view" className="login-card">
            <Link to="/" className="logo">
              <span className="mark">C</span>
              CNA
            </Link>
            <h1>Publisher Login</h1>
            <p className="hint">Sign in to the newsroom to manage stories, campaigns and ad inventory.</p>
            <div className="sso-row">
              <button className="btn btn--lg" id="sso-google" onClick={() => { toast('Google SSO (demo) — signed in'); login(); }}>
                <svg viewBox="0 0 24 24" width="18" height="18">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.1z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.1a7.2 7.2 0 0 1 0-4.2V7.06H2.18a11 11 0 0 0 0 9.88l3.66-2.84z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                Sign in with Google
              </button>
              <button className="btn btn--lg" id="sso-apple" onClick={() => { toast('Apple SSO (demo) — signed in'); login(); }}>
                <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                  <path d="M16.36 12.76c.03 3.04 2.67 4.05 2.7 4.07-.02.07-.42 1.45-1.39 2.87-.84 1.22-1.71 2.44-3.08 2.47-1.35.02-1.78-.8-3.32-.8-1.54 0-2.02.77-3.29.82-1.32.05-2.32-1.32-3.17-2.54C3.09 17.05 1.6 12.2 3.55 8.86c.97-1.68 2.7-2.74 4.58-2.77 1.43-.03 2.78.96 3.66.96.87 0 2.51-1.19 4.23-1.01.72.03 2.74.29 4.04 2.19-.1.06-2.41 1.41-2.39 4.21v.32zM13.6 4.72c.77-.93 1.29-2.23 1.15-3.52-1.11.04-2.45.74-3.25 1.67-.71.82-1.33 2.13-1.16 3.39 1.24.1 2.5-.63 3.26-1.54z" />
                </svg>
                Sign in with Apple
              </button>
            </div>
            <div className="login-divider">or use email</div>
            <form id="login-form" onSubmit={submitLogin}>
              <div>
                <label className="field" htmlFor="username">Username</label>
                <input type="text" id="username" placeholder="publisher" required value={username} onChange={(e) => setUsername(e.target.value)} />
              </div>
              <div>
                <label className="field" htmlFor="password">Password</label>
                <input type="password" id="password" placeholder="cna2026" required value={password} onChange={(e) => setPassword(e.target.value)} />
              </div>
              <button type="submit" className="btn btn--lg">Sign In</button>
              <p id="login-error" className="error">{loginError}</p>
            </form>
            <p className="hint" style={{ marginTop: '1rem' }}>
              Demo credentials — username: <b>publisher</b>, password: <b>cna2026</b>
            </p>
          </section>
        ) : (
          <section id="dashboard">
            <div className="dash-hero">
              <div>
                <h1>Publisher Dashboard</h1>
                <p>Manage your newsroom — create, edit and publish stories, and run your commercial arm.</p>
              </div>
              <div className="actions">
                <button id="new-article" className="btn" onClick={() => openEditor(null)}>+ New Article</button>
                <button id="logout" className="btn-outline btn" style={{ color: '#fff', borderColor: '#fff' }} onClick={logout}>Logout</button>
              </div>
            </div>

            <div className="stat-cards" id="pub-stats">
              <div className="stat-card"><div className="n">{articles.length}</div><div className="l">Total articles</div></div>
              <div className="stat-card"><div className="n">{pubCount}</div><div className="l">Published</div></div>
              <div className="stat-card"><div className="n">{draftCount}</div><div className="l">Drafts</div></div>
              <div className="stat-card"><div className="n">{featuredCount}</div><div className="l">Featured</div></div>
            </div>

            <div className="dash-head">
              <h2>Articles</h2>
              <div>
                <button id="new-article-2" className="btn btn--sm" onClick={() => openEditor(null)}>+ New Article</button>
              </div>
            </div>

            {editorOpen ? (
              <div id="editor" className="editor">
                <h2 id="editor-title">{editId ? 'Edit Article' : 'New Article'}</h2>
                <form
                  id="article-form"
                  onSubmit={(e) => {
                    e.preventDefault();
                    saveArticle(true);
                  }}
                >
                  <input type="hidden" id="article-id" value={editId || ''} />
                  <div className="form-grid">
                    <div className="full">
                      <label className="field">Headline</label>
                      <input type="text" id="article-title" placeholder="Headline" required value={form.title} onChange={updateField('title')} />
                    </div>
                    <div>
                      <label className="field">Category</label>
                      <select id="article-category" required value={form.category} onChange={updateField('category')}>
                        {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                      </select>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'flex-end' }}>
                      <label className="check">
                        <input type="checkbox" id="article-featured" checked={form.featured} onChange={updateField('featured')} /> Featured story
                      </label>
                    </div>
                    <div className="full">
                      <label className="field">Summary (shown on cards)</label>
                      <textarea id="article-summary" placeholder="Short summary…" rows="2" required value={form.summary} onChange={updateField('summary')} />
                    </div>
                    <div className="full">
                      <label className="field">Full article text</label>
                      <textarea id="article-content" placeholder="Full article text…" rows="8" required value={form.content} onChange={updateField('content')} />
                    </div>
                  </div>
                  <div className="editor-actions">
                    <button type="button" id="save-draft" className="btn-outline btn" onClick={() => saveArticle(false)}>Save Draft</button>
                    <button type="submit" id="publish-btn" className="btn btn--blue">Publish</button>
                    <button type="button" id="cancel-edit" className="btn-ghost btn" onClick={closeEditor}>Cancel</button>
                  </div>
                </form>
              </div>
            ) : null}

            <table className="article-table">
              <thead>
                <tr>
                  <th>Headline</th>
                  <th>Category</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody id="article-list">
                {sorted.map((a) => (
                  <tr key={a.id}>
                    <td className="ttl">
                      {a.title}
                      <div className="meta" style={{ marginTop: '.2rem' }}>{formatDate(a.date)} · {a.author}</div>
                    </td>
                    <td>{a.category}</td>
                    <td>
                      <span className={a.published ? 'status published' : 'status draft'}>{a.published ? 'Published' : 'Draft'}</span>
                    </td>
                    <td>
                      <div className="row-actions">
                        <button className="link-btn" data-action="edit" data-id={a.id} onClick={() => openEditor(a.id)}>Edit</button>
                        <button className="link-btn" data-action="toggle" data-id={a.id} onClick={() => togglePublish(a.id)}>
                          {a.published ? 'Unpublish' : 'Publish'}
                        </button>
                        <button className="link-btn danger" data-action="delete" data-id={a.id} onClick={() => deleteArticle(a.id)}>Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="section-head" style={{ marginTop: '3rem' }} id="brand-studio">
              <h2 className="section-title">Brand Studio</h2>
            </div>
            <div className="brand-cards" id="brand-cards">
              {BRAND_CAMPAIGNS.map((c) => (
                <article className="brand-card" key={c.title}>
                  <div className="thumb" style={{ background: c.grad }}></div>
                  <div className="body">
                    <span className="badge">{c.badge}</span>
                    <h3>{c.title}</h3>
                    <p>{c.blurb}</p>
                  </div>
                </article>
              ))}
            </div>

            <div className="section-head" style={{ marginTop: '3rem' }} id="advertise">
              <h2 className="section-title">Advertise With Us</h2>
            </div>
            <div className="brand-cards" id="ad-cards">
              {AD_TYPES.map((a) => (
                <article className="brand-card" key={a.title}>
                  <div className="body">
                    <span className="badge">{a.badge}</span>
                    <h3>{a.title}</h3>
                    <p>{a.blurb}</p>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}
      </main>

      <footer className="footer">
        <div className="wrap">
          <div className="footer-bottom">
            <span>© 2026 CNA — Demo site. Mediacorp Pte Ltd. All rights reserved.</span>
            <div className="legal">
              <a href="#">Terms &amp; Conditions</a>
              <a href="#">Privacy Policy</a>
              <a href="#">Report Vulnerability</a>
              <a href="#">Online Links Policy</a>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
