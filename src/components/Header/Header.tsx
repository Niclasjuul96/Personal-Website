import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import './Header.scss';
import logo from '../../assets/logo.png';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

  const handleMenuClick = (): void => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleNavLinkClick = (): void => {
    setIsMenuOpen(false);
  };

  const handleLogoClick = (): void => {
    window.location.href = './';
  };

  return (
    <div className="Header-container">
      <div className="logo" onClick={handleLogoClick}>
        <img src={logo} id="logo" alt="Nice's Portfolio Logo" />
      </div>
      <div className="menu-icon" onClick={handleMenuClick}>
        <i className={isMenuOpen ? 'fas fa-times' : 'fas fa-bars'}></i>
      </div>
      <nav className={isMenuOpen ? 'navbar active' : 'navbar'}>
        <ul id="navbar">
          <li>
            <NavLink to="/" onClick={handleNavLinkClick}>
              Home
            </NavLink>
          </li>
          <li>
            <NavLink to="/about" onClick={handleNavLinkClick}>
              About
            </NavLink>
          </li>
          <li>
            <NavLink to="/portfolio" onClick={handleNavLinkClick}>
              Portfolio
            </NavLink>
          </li>
          <li>
            <NavLink to="/contact" onClick={handleNavLinkClick}>
              Contact
            </NavLink>
          </li>
        </ul>
      </nav>
    </div>
  );
};

Header.displayName = 'Header';

export default Header;
