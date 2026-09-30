import { Link } from 'react-router-dom';
import { categoryGradient, readTimeMins, timeAgo } from '../../js/data.js';

export function Card({ article }) {
  const meta = `${timeAgo(article.date)} · ${readTimeMins(article.content)} min read · ${article.author}`;
  return (
    <article className="card">
      <Link
        className="thumb"
        to={`/article/${article.id}`}
        style={{ background: categoryGradient(article.category) }}
      >
        <span className="tag">{article.category}</span>
      </Link>
      <div className="body">
        <h3><Link to={`/article/${article.id}`}>{article.title}</Link></h3>
        <p>{article.summary}</p>
        <div className="meta">{meta}</div>
      </div>
    </article>
  );
}

export function StripCard({ title, dur, meta, gradient, label, href = '#watch-listen' }) {
  return (
    <a className="card" href={href}>
      <div className="thumb" style={{ background: gradient }}>
        {dur ? <span className="dur">{dur}</span> : null}
        <span className="tag">{label}</span>
      </div>
      <div className="body">
        <h3>{title}</h3>
        <div className="meta">{meta}</div>
      </div>
    </a>
  );
}
