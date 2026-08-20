import React from 'react';
import { Link } from 'react-router-dom';
import logo from "../assets/Logo.svg";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer-container">
      <div className="footer-content">
        <div className="footer-col brand-col">
          <Link to="/" className="footer-logo">
            <img src={logo} alt="StudyNotion" width={160} height={32} loading="lazy" />
          </Link>
          <p className="footer-desc">
            Empowering minds worldwide with accessible, high-quality technical education to future-proof your career.
          </p>
          <div className="footer-company">
            <span>Company</span>
            <div className="footer-sublinks">
              <Link to="/about">About</Link>
              <Link to="/contact">Careers</Link>
              <Link to="/contact">Affiliates</Link>
            </div>
          </div>
        </div>

        <div className="footer-col">
          <h3>Resources</h3>
          <ul>
            <li><Link to="/">Articles</Link></li>
            <li><Link to="/">Blog</Link></li>
            <li><Link to="/">Chart Sheet</Link></li>
            <li><Link to="/">Code Challenges</Link></li>
            <li><Link to="/">Docs</Link></li>
            <li><Link to="/">Projects</Link></li>
          </ul>
        </div>

        <div className="footer-col">
          <h3>Plans</h3>
          <ul>
            <li><Link to="/">Paid Memberships</Link></li>
            <li><Link to="/">For Students</Link></li>
            <li><Link to="/">Business Solutions</Link></li>
          </ul>

          <h3 className="section-spacing">Community</h3>
          <ul>
            <li><Link to="/">Forums</Link></li>
            <li><Link to="/">Chapters</Link></li>
            <li><Link to="/">Events</Link></li>
          </ul>
        </div>

        <div className="footer-col">
          <h3>Subjects</h3>
          <ul>
            <li><Link to="/">AI & Machine Learning</Link></li>
            <li><Link to="/">Cloud Computing</Link></li>
            <li><Link to="/">Cybersecurity</Link></li>
            <li><Link to="/">Data Analytics</Link></li>
            <li><Link to="/">Data Science</Link></li>
            <li><Link to="/">Web Development</Link></li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="footer-bottom-links">
          <Link to="/">Privacy Policy</Link>
          <Link to="/">Cookie Policy</Link>
          <Link to="/">Terms of Service</Link>
        </div>
        <div className="footer-bottom-copy">
          Made with <span className="heart">?</span> StudyNotion © {new Date().getFullYear()} All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
