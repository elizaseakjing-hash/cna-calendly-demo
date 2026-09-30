import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="wrap">
        <div className="footer-grid">
          <div>
            <h4>News</h4>
            <ul>
              <li><Link to="/#top-stories">Top Stories</Link></li>
              <li><Link to="/#latest">Latest News</Link></li>
              <li><Link to="/?chip=Singapore#latest">Singapore</Link></li>
              <li><Link to="/?chip=Asia#latest">Asia</Link></li>
              <li><Link to="/?chip=East%20Asia#latest">East Asia</Link></li>
              <li><Link to="/#commentary">Commentary</Link></li>
              <li><Link to="/?chip=World#latest">World</Link></li>
              <li><Link to="/?chip=Business#latest">Business</Link></li>
              <li><Link to="/?chip=Sport#latest">Sport</Link></li>
            </ul>
          </div>
          <div>
            <h4>CNA</h4>
            <ul>
              <li><Link to="/publisher">About CNA</Link></li>
              <li><Link to="/publisher">Our Presenters</Link></li>
              <li><Link to="/publisher">Our Correspondents</Link></li>
              <li><Link to="/publisher">Contact Us</Link></li>
              <li><Link to="/publisher">Advertise With Us</Link></li>
              <li><Link to="/publisher">Brand Studio</Link></li>
            </ul>
          </div>
          <div>
            <h4>Watch &amp; Listen</h4>
            <ul>
              <li><Link to="/#watch-listen">Live TV</Link></li>
              <li><Link to="/#watch-listen">TV Schedule</Link></li>
              <li><Link to="/#watch-listen">CNA938 Live</Link></li>
              <li><Link to="/#watch-listen">Podcasts</Link></li>
              <li><Link to="/#watch-listen">Radio Schedule</Link></li>
            </ul>
          </div>
          <div>
            <h4>More</h4>
            <ul>
              <li><Link to="/#visual">Interactives</Link></li>
              <li><Link to="/#visual">Visual Stories</Link></li>
              <li><Link to="/?chip=Sustainability#latest">CNA Explains</Link></li>
              <li><Link to="/#watch-listen">Insider</Link></li>
              <li><Link to="/#discover">Games</Link></li>
              <li><Link to="/#newsletter">Newsletters</Link></li>
            </ul>
          </div>
          <div>
            <h4>Follow CNA</h4>
            <div className="social">
              <a href="#" aria-label="Facebook">f</a>
              <a href="#" aria-label="YouTube">▶</a>
              <a href="#" aria-label="LinkedIn">in</a>
              <a href="#" aria-label="Telegram">✈</a>
            </div>
            <p style={{ marginTop: '1rem', fontSize: '.85rem', color: 'var(--muted)' }}>
              Download the CNA app — Android, iOS and Huawei.
            </p>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© 2026 CNA — Demo site. Mediacorp Pte Ltd. All rights reserved.</span>
          <div className="legal">
            <a href="#">Official Domain</a>
            <a href="#">Terms &amp; Conditions</a>
            <a href="#">Privacy Policy</a>
            <a href="#">Report Vulnerability</a>
            <a href="#">Online Links Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
