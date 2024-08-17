import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Footer.css'; // Make sure to create this CSS file for styling

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-content">
                <div className="footer-logo">
                    <Link to="/" className="logo-link">
                        <img src="/images/logo.png" alt="Aura Gaming Logo" className="footer-logo-img" />
                        <span className="footer-logo-text">Aura Gaming</span>
                    </Link>
                </div>
                <ul className="footer-links">
                    <li><Link to="/about">About Us</Link></li>
                    <li><Link to="/contact">Contact Us</Link></li>
                    <li><Link to="/privacy-policy">Privacy Policy</Link></li>
                </ul>
                <div className="footer-bottom">
                    <p>&copy; {new Date().getFullYear()} Aura Gaming. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
