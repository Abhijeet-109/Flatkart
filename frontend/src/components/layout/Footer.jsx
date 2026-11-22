import React from 'react';
import './Footer.css';

const footerGroups = [
  {
    title: 'Shop',
    label: 'Shopping links',
    links: [
      ['Shop All', '/', 'home'],
      ['Home', '/', 'home'],
      ['My Account', '/account/profile', 'account'],
      ['My Orders & Complaints', '/my-complaints', 'my-complaints'],
    ],
  },
  {
    title: 'Customer Support',
    label: 'Customer support links',
    links: [
      ['Orders & Complaints', '/my-complaints', 'my-complaints'],
      ['My Account', '/account/profile', 'account'],
      ['Returns & Refunds', '/returns-and-refunds', 'returns-and-refunds'],
      ['Sign In', '/login', 'login'],
    ],
  },
  {
    title: 'Legal',
    label: 'Legal information',
    links: [
      ['Privacy Policy', '/privacy-policy', 'privacy-policy'],
      ['Terms & Conditions', '/terms-and-conditions', 'terms-and-conditions'],
      ['Shipping Policy', '/shipping-policy', 'shipping-policy'],
      ['Returns & Refunds Policy', '/returns-and-refunds', 'returns-and-refunds'],
    ],
  },
];

export function Footer({ onNavigate }) {
  const navigate = (event, page) => {
    event.preventDefault();
    onNavigate?.(page);
  };

  return (
    <footer className="fk-site-footer">
      <div className="fk-site-footer-main">
        <section className="fk-footer-brand" aria-labelledby="fk-footer-brand-title">
          <a href="/" className="fk-site-footer-brand" onClick={(event) => navigate(event, 'home')}>
            <span id="fk-footer-brand-title">FLATKART</span>
          </a>
          <p className="fk-footer-tagline">Thoughtful finds for everyday living.</p>
          <p className="fk-footer-description">Discover thoughtfully selected products for your everyday needs.</p>
        </section>

        {footerGroups.map((group) => (
          <nav className="fk-site-footer-nav" aria-label={group.label} key={group.title}>
            <h2>{group.title}</h2>
            <ul>
              {group.links.map(([label, href, page]) => (
                <li key={`${label}-${href}`}>
                  <a href={href} onClick={(event) => navigate(event, page)}>{label}</a>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>

      <div className="fk-site-footer-bottom">
        <span>© {new Date().getFullYear()} Flatkart. All rights reserved.</span>
        <span className="fk-site-footer-signature">Designed &amp; Developed by Abhijeet.</span>
      </div>
    </footer>
  );
}

export default Footer;
