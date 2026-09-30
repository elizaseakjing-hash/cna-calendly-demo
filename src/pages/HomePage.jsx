import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  CATEGORIES,
  STATS,
  SEED_PODCASTS,
  SEED_VIDEOS,
  SEED_VISUAL,
  categoryGradient,
  readTimeMins,
  timeAgo,
} from '../../js/data.js';
import { useEdition } from '../context/EditionContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { usePublishedArticles } from '../hooks/usePublishedArticles.js';
import { Card, StripCard } from '../components/Cards.jsx';

// ---------------------------------------------------------------------
// Static content (hoisted to module scope so it is never recreated per render)
// ---------------------------------------------------------------------

const PRODUCTS = [
  {
    id: 'read',
    icon: '📰',
    label: 'Read',
    title: 'The stories that matter',
    desc: 'Breaking news, explainers and analysis from Singapore, Asia and the world — updated around the clock.',
    cta: 'Read top stories',
    href: '#top-stories',
  },
  {
    id: 'watch',
    icon: '▶',
    label: 'Watch',
    title: 'CNA 24/7 live news',
    desc: 'Stream live bulletins — Asia First, East Asia Tonight, Asia Tonight and Singapore Tonight — plus award-winning documentaries.',
    cta: 'Watch live',
    href: '#watch-listen',
  },
  {
    id: 'listen',
    icon: '🎧',
    label: 'Listen',
    title: 'CNA938 live radio & podcasts',
    desc: 'Live radio, on-demand podcasts and interviews on news, work and money, and society and culture.',
    cta: 'Listen now',
    href: '#watch-listen',
  },
  {
    id: 'interactives',
    icon: '✨',
    label: 'Interactives',
    title: 'Immersive visual stories',
    desc: "Explore data-driven interactives and visual stories that bring the region's biggest issues to life.",
    cta: 'Explore',
    href: '#visual',
  },
];

const DISCOVER = [
  { icon: '🎮', name: 'CNA Games', blurb: 'Stay sharp with daily puzzles.' },
  { icon: '📱', name: 'CNA App', blurb: 'Available for Android, iOS and Huawei.' },
  { icon: '✉️', name: 'CNA Newsletters', blurb: 'The best of CNA, in your inbox.' },
  { icon: '🎧', name: 'CNA Podcasts', blurb: 'Conversations on issues that matter.' },
  { icon: '✨', name: 'CNA Interactives', blurb: 'Immersive stories, visuals and data.' },
  { icon: '📡', name: 'RSS Feeds', blurb: 'Get headlines in your news reader.' },
];

const SHORTS_GRADIENTS = ['#071A31,#0d3a66', '#0d5ca6,#083b6b', '#3b82f6,#1d4ed8', '#0e7490,#155e75', '#5a2fb0,#381e6e'];
const POD_GRADIENTS = ['#0d5ca6,#083b6b', '#1d7a4f,#115336', '#5a2fb0,#381e6e'];
const VID_GRADIENTS = ['#0e7490,#155e75', '#c94f7c,#8f3256'];
const VISUAL_GRADIENTS = ['#071A31,#0d3a66', '#2b8a5c,#1b5c3d', '#0d5ca6,#083b6b', '#c94f7c,#8f3256', '#5a2fb0,#381e6e'];

const grad = (list, i) => `linear-gradient(135deg, ${list[i % list.length]})`;

// ---------------------------------------------------------------------
// Sections
// ---------------------------------------------------------------------

function Hero({ edition }) {
  return (
    <section className="hero">
      <span className="eyebrow" id="hero-eyebrow">CNA — {edition} edition</span>
      <h1>All the news around Asia, handled.</h1>
      <p className="sub">
        From breaking news to in-depth explainers, live TV and podcasts — get the region's stories with
        fewer tabs and less noise.
      </p>
      <div className="sso-row">
        <button className="btn btn--lg" id="sso-google">
          <svg viewBox="0 0 24 24" width="18" height="18">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.1z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.1a7.2 7.2 0 0 1 0-4.2V7.06H2.18a11 11 0 0 0 0 9.88l3.66-2.84z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
          </svg>
          Sign up with Google
        </button>
        <button className="btn btn--lg" id="sso-apple">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
            <path d="M16.36 12.76c.03 3.04 2.67 4.05 2.7 4.07-.02.07-.42 1.45-1.39 2.87-.84 1.22-1.71 2.44-3.08 2.47-1.35.02-1.78-.8-3.32-.8-1.54 0-2.02.77-3.29.82-1.32.05-2.32-1.32-3.17-2.54C3.09 17.05 1.6 12.2 3.55 8.86c.97-1.68 2.7-2.74 4.58-2.77 1.43-.03 2.78.96 3.66.96.87 0 2.51-1.19 4.23-1.01.72.03 2.74.29 4.04 2.19-.1.06-2.41 1.41-2.39 4.21v.32zM13.6 4.72c.77-.93 1.29-2.23 1.15-3.52-1.11.04-2.45.74-3.25 1.67-.71.82-1.33 2.13-1.16 3.39 1.24.1 2.5-.63 3.26-1.54z" />
          </svg>
          Sign up with Apple
        </button>
      </div>
      <p className="fineprint"><a href="#newsletter">Sign up with email</a> · No credit card required</p>
    </section>
  );
}

function ProductStage() {
  const [active, setActive] = useState(0);
  const p = PRODUCTS[active];

  return (
    <section className="product-stage" id="product-stage">
      <div className="product-card">
        <div className="pc-top">
          <div className="icon-row" id="product-icons">
            {PRODUCTS.map((item, i) => (
              <button
                key={item.id}
                className={i === active ? 'icon-dot active' : 'icon-dot'}
                data-i={i}
                title={item.label}
                onClick={() => setActive(i)}
              >
                {item.icon}
              </button>
            ))}
          </div>
        </div>
        <div className="pc-panel" id="product-panel">
          <span className="label">{p.icon} {p.label}</span>
          <h2>{p.title}</h2>
          <p>{p.desc}</p>
          <a href={p.href} className="btn">{p.cta}</a>
        </div>
      </div>
    </section>
  );
}

function FeatureStory({ articles }) {
  const featured = articles.find((a) => a.featured) || articles[0];
  if (!featured) return null;
  return (
    <div className="feature-story" id="feature-story">
      <Link
        className="fs-thumb"
        to={`/article/${featured.id}`}
        style={{ background: categoryGradient(featured.category) }}
      >
        <span className="tag">{featured.category}</span>
      </Link>
      <div className="fs-body">
        <span className="eyebrow">Featured story</span>
        <h2><Link to={`/article/${featured.id}`}>{featured.title}</Link></h2>
        <p>{featured.summary}</p>
        <div className="meta">
          {timeAgo(featured.date)} · {readTimeMins(featured.content)} min read · By {featured.author}
        </div>
      </div>
    </div>
  );
}

function TopStories({ articles }) {
  const featured = articles.find((a) => a.featured);
  const rest = articles.filter((a) => a !== featured).slice(0, 6);
  return (
    <div className="grid" id="top-stories-grid">
      {rest.map((a) => <Card key={a.id} article={a} />)}
    </div>
  );
}

function LatestSection({ articles, activeCat, onSelectCat }) {
  const filtered = activeCat === 'All' ? articles : articles.filter((a) => a.category === activeCat);
  return (
    <section className="wrap section" id="latest">
      <div className="section-head">
        <h2 className="section-title">Latest News</h2>
        <span className="section-link" id="latest-count">{filtered.length} stories</span>
      </div>
      <div className="chips" id="chips">
        {['All', ...CATEGORIES].map((c) => (
          <button
            key={c}
            className={activeCat === c ? 'chip active' : 'chip'}
            data-cat={c}
            onClick={() => onSelectCat(c)}
          >
            {c}
          </button>
        ))}
      </div>
      <div className="grid" id="latest-grid">
        {filtered.map((a) => <Card key={a.id} article={a} />)}
      </div>
      {filtered.length === 0 ? <p id="empty" className="empty">No stories found.</p> : null}
    </section>
  );
}

function Shorts() {
  return (
    <div className="strip" id="shorts-strip">
      {SEED_VIDEOS.map((v, i) => (
        <StripCard key={v.id} title={v.title} dur={v.dur} meta={v.ago} gradient={grad(SHORTS_GRADIENTS, i)} label={v.kind} />
      ))}
    </div>
  );
}

function WatchListen() {
  return (
    <div className="grid grid--3" id="watch-listen-grid">
      <article className="card" style={{ gridColumn: '1/-1' }}>
        <div className="thumb" style={{ background: 'linear-gradient(135deg,#071A31,#0d3a66)', height: 150 }}>
          <span className="tag">Live</span>
        </div>
        <div className="body">
          <h3>Watch CNA Originals Live</h3>
          <p>24/7 livestream of CNA bulletins and documentaries. Seek live, add captions, or cast to your TV.</p>
          <div className="meta">▶ LIVE · Asia First, East Asia Tonight, Asia Tonight, Singapore Tonight</div>
        </div>
      </article>
      {SEED_PODCASTS.slice(0, 3).map((p, i) => (
        <StripCard
          key={p.id}
          title={p.title}
          dur={p.dur}
          meta={`${p.show} · ${p.ago}`}
          gradient={grad(POD_GRADIENTS, i)}
          label="Podcast"
        />
      ))}
      {SEED_VIDEOS.slice(0, 2).map((v, i) => (
        <StripCard
          key={v.id}
          title={v.title}
          dur={v.dur}
          meta={`${v.kind} · ${v.ago}`}
          gradient={grad(VID_GRADIENTS, i)}
          label="Video"
        />
      ))}
    </div>
  );
}

function Commentary({ articles }) {
  const list = articles.filter((a) => a.category === 'Commentary').slice(0, 3);
  return (
    <div className="grid" id="commentary-grid">
      {list.length ? list.map((a) => <Card key={a.id} article={a} />) : <p className="empty">No commentary published yet.</p>}
    </div>
  );
}

function StatsBand() {
  return (
    <div className="stats-band">
      <h2>Real stories. Real reach.</h2>
      <div className="stats-grid" id="stats-grid">
        {STATS.map((s) => (
          <div className="stat" key={s.label}>
            <div className="value">{s.value}</div>
            <div className="label">{s.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function VisualStories() {
  return (
    <div className="strip" id="visual-strip">
      {SEED_VISUAL.map((s, i) => (
        <StripCard key={s.id} title={s.title} meta={s.ago} gradient={grad(VISUAL_GRADIENTS, i)} label="Visual" />
      ))}
    </div>
  );
}

function Discover() {
  return (
    <div className="discover-grid" id="discover-grid">
      {DISCOVER.map((d) => (
        <a className="discover-card" href="#discover" key={d.name}>
          <div className="icon">{d.icon}</div>
          <h3>{d.name}</h3>
          <p>{d.blurb}</p>
        </a>
      ))}
    </div>
  );
}

function NewsletterCta() {
  const toast = useToast();
  const [email, setEmail] = useState('');

  const subscribe = () => {
    const v = email.trim();
    if (!v || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v)) {
      toast('Please enter a valid email address');
      return;
    }
    localStorage.setItem('cna_newsletter_email', v);
    setEmail('');
    toast('Subscribed! Check your inbox.');
  };

  return (
    <section className="wrap section" id="newsletter">
      <div className="newsletter-cta">
        <h2>Get the best of CNA, straight to your inbox</h2>
        <p>Choose from five newsletters — the Morning Brief, Recommended Read, Week in Review, Big Read and CNA Insider.</p>
        <div className="sso-row">
          <input
            type="email"
            id="newsletter-email"
            placeholder="you@example.com"
            style={{ minWidth: 260 }}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button className="btn btn--blue btn--lg" id="newsletter-subscribe" onClick={subscribe}>Subscribe</button>
        </div>
        <p className="fineprint" style={{ marginTop: '1rem' }}>This service is not intended for persons residing in the E.U.</p>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------

export default function HomePage() {
  const { edition } = useEdition();
  const articles = usePublishedArticles();
  const [searchParams, setSearchParams] = useSearchParams();

  // The active category chip is derived from the URL (single source of truth).
  const activeCat = searchParams.get('chip') || 'All';
  const selectCat = (cat) => setSearchParams(cat === 'All' ? {} : { chip: cat }, { replace: true });

  return (
    <main>
      <Hero edition={edition} />
      <ProductStage />

      <section className="wrap section" id="top-stories">
        <FeatureStory articles={articles} />
        <div style={{ height: '1.5rem' }}></div>
        <TopStories articles={articles} />
      </section>

      <LatestSection articles={articles} activeCat={activeCat} onSelectCat={selectCat} />

      <section className="wrap section section--tight">
        <div className="section-head">
          <h2 className="section-title">Shorts</h2>
          <a className="section-link" href="#watch-listen">Watch more →</a>
        </div>
        <Shorts />
      </section>

      <section className="wrap section section--tight" id="watch-listen">
        <div className="section-head">
          <h2 className="section-title">Watch &amp; Listen</h2>
          <a className="section-link" href="#watch-listen">Explore →</a>
        </div>
        <WatchListen />
      </section>

      <section className="wrap section section--tight" id="commentary">
        <div className="section-head">
          <h2 className="section-title">Commentary</h2>
          <a className="section-link" href="#commentary">More commentaries →</a>
        </div>
        <Commentary articles={articles} />
      </section>

      <section className="wrap section">
        <StatsBand />
      </section>

      <section className="wrap section section--tight" id="visual">
        <div className="section-head">
          <h2 className="section-title">Visual Stories</h2>
          <a className="section-link" href="#visual">View more →</a>
        </div>
        <VisualStories />
      </section>

      <section className="wrap section section--tight" id="discover">
        <div className="section-head"><h2 className="section-title">Discover more on CNA</h2></div>
        <Discover />
      </section>

      <NewsletterCta />
    </main>
  );
}
