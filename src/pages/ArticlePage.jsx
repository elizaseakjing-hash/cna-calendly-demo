import { Fragment, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  getArticleById,
  getArticles,
  getBookmarks,
  getFollows,
  toggleBookmark,
  toggleFollow,
  categoryGradient,
  formatDate,
} from '../../js/data.js';
import { useToast } from '../context/ToastContext.jsx';
import { initials, fastSummary, shareTargets } from '../lib/article.js';
import { Card } from '../components/Cards.jsx';

export default function ArticlePage() {
  const { id } = useParams();
  const toast = useToast();

  const [article, setArticle] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const [related, setRelated] = useState([]);
  const [isSaved, setIsSaved] = useState(false);
  const [isFollow, setIsFollow] = useState(false);
  const [captionExpanded, setCaptionExpanded] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const [speaking, setSpeaking] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      // Independent reads run in parallel — no waterfall.
      const [a, all, bookmarks, follows] = await Promise.all([
        getArticleById(id),
        getArticles(),
        getBookmarks(),
        getFollows(),
      ]);
      if (cancelled) return;

      if (!a || !a.published) {
        setNotFound(true);
        return;
      }

      document.title = a.title + ' — CNA';
      setArticle(a);
      setIsSaved(bookmarks.includes(a.id));
      setIsFollow(follows.includes(a.author));

      const rest = all.filter((x) => x.published && x.id !== a.id);
      const same = rest.filter((x) => x.category === a.category);
      const other = rest.filter((x) => x.category !== a.category);
      setRelated([...same, ...other].slice(0, 3));
    })();
    return () => {
      cancelled = true;
    };
  }, [id]);

  if (notFound) {
    return (
      <main className="article-wrap">
        <p className="empty">Article not found.</p>
      </main>
    );
  }

  if (!article) {
    return <main className="article-wrap" />;
  }

  const paras = (article.content || '').split(/\n\n/).filter(Boolean);

  const onBookmark = () => {
    toggleBookmark(article.id).then((saved) => {
      setIsSaved(saved);
      toast(saved ? 'Saved to bookmarks' : 'Removed from bookmarks');
    });
  };

  const onFollow = () => {
    toggleFollow(article.author).then((f) => {
      setIsFollow(f);
      toast(f ? 'Following ' + article.author : 'Unfollowed ' + article.author);
    });
  };

  const onListen = () => {
    if (!('speechSynthesis' in window)) {
      toast('Text-to-speech not supported');
      return;
    }
    if (speaking) {
      speechSynthesis.cancel();
      setSpeaking(false);
      return;
    }
    const utter = new SpeechSynthesisUtterance(article.title + '. ' + article.summary + '. ' + article.content);
    utter.rate = 1;
    utter.onend = () => setSpeaking(false);
    speechSynthesis.speak(utter);
    setSpeaking(true);
  };

  const shareTarget = (s) => {
    setShareOpen(false);
    if (s.copy) {
      navigator.clipboard && navigator.clipboard.writeText(window.location.href).then(() => toast('Link copied'));
    } else if (s.bookmark) {
      toggleBookmark(article.id).then((saved) => {
        setIsSaved(saved);
        toast(saved ? 'Saved to bookmarks' : 'Removed from bookmarks');
      });
    } else {
      window.open(s.href, '_blank', 'noopener');
    }
  };

  return (
    <main className="article-wrap">
      <article id="article">
        <div className="breadcrumb">
          <Link to="/">CNA</Link> <span>/</span> <Link to="/#latest">{article.category}</Link>
        </div>
        <h1>{article.title}</h1>
        <p className="standfirst">{article.summary}</p>

        <div className="byline">
          <div className="avatar" style={{ background: categoryGradient(article.category) }}>{initials(article.author)}</div>
          <div className="who">
            <div className="name"><a href="#">{article.author}</a></div>
            <div className="when">{formatDate(article.date)} · Updated {formatDate(article.date)}</div>
          </div>
          <button className={isFollow ? 'follow-btn following' : 'follow-btn'} id="follow-btn" onClick={onFollow}>
            {isFollow ? 'Following' : '+ Follow'}
          </button>
        </div>

        <div className="tool-row">
          <button className={isSaved ? 'tool-chip saved' : 'tool-chip'} id="bookmark-btn" onClick={onBookmark}>
            🔖 <span>{isSaved ? 'Bookmarked' : 'Bookmark'}</span>
          </button>
          <button className="tool-chip" id="share-btn" onClick={() => setShareOpen(true)}>↗ Share</button>
          <button className={speaking ? 'tool-chip playing' : 'tool-chip'} id="listen-btn" onClick={onListen}>
            {speaking ? '⏹ Stop' : '🔊 Listen'}
          </button>
          <button className="tool-chip" id="google-btn" onClick={() => toast('Preference saved')}>
            ✓ Set CNA as your preferred source on Google
          </button>
        </div>

        <div className="fast-box">
          <div className="fast-head">⚡ FAST · AI summary</div>
          <p>{fastSummary(article)}</p>
        </div>

        <div className="article-hero-img">
          <div className="thumb" style={{ background: categoryGradient(article.category) }}></div>
        </div>
        <div className="figcaption">
          {captionExpanded ? (
            article.summary
          ) : (
            <>
              {article.title} (Photo: CNA) <button id="more-caption" onClick={() => setCaptionExpanded(true)}>… see more</button>
            </>
          )}
        </div>

        <div className="article-body">
          {paras.map((p, i) => (
            <Fragment key={i}>
              <p>{p}</p>
              {i === 1 ? <div className="ad-placeholder">Advertisement</div> : null}
              {i === 2 ? (
                <figure>
                  <div className="thumb" style={{ background: categoryGradient(article.category) }}></div>
                  <figcaption>{article.title} (Photo: CNA)</figcaption>
                </figure>
              ) : null}
            </Fragment>
          ))}
        </div>
      </article>

      <section className="related" id="related">
        <div className="section-head"><h2 className="section-title">Also worth reading</h2></div>
        <div className="grid" id="related-grid">
          {related.map((a) => <Card key={a.id} article={a} />)}
        </div>
      </section>

      {shareOpen ? (
        <div className="share-menu" id="share-menu" onClick={(e) => { if (e.target === e.currentTarget) setShareOpen(false); }}>
          <div className="panel">
            <h3>Share this story</h3>
            <div className="share-grid" id="share-grid">
              {shareTargets(window.location.href, article.title).map((s, i) => (
                <button key={i} data-role={s.copy ? 'copy' : s.bookmark ? 'bookmark' : 'link'} data-href={s.href || ''} onClick={() => shareTarget(s)}>
                  <span className="ic">{s.ic}</span>{s.name}
                </button>
              ))}
            </div>
            <div style={{ textAlign: 'right', marginTop: '1rem' }}>
              <button className="btn-ghost btn" id="share-cancel" onClick={() => setShareOpen(false)}>Cancel</button>
            </div>
          </div>
        </div>
      ) : null}
    </main>
  );
}
