import React, { useState } from 'react';
import { Link } from './Link';
import { Button } from './Button';

export interface User {
  name: string;
  email?: string;
}

export interface HeaderProps {
  /**
   * Number of items in shopping cart
   */
  cartCount?: number;
  /**
   * Current logged-in user (if any)
   */
  user: User | null;
  /**
   * Additional CSS classes
   */
  className?: string;
  /**
   * Logo URL 
   */
  logoUrl?: string;
  /**
   * Logo alt text
   */
  logoAlt?: string;
  /**
   * Navigation links
   */
  navLinks?: Array<{
    href: string;
    label: string;
  }>;
  /**
   * Login handler
   */
  onLogin?: () => void;
  /**
   * Logout handler
   */
  onLogout?: () => void;
  /**
   * Cart click handler
   */
  onCartClick?: () => void;
}

/**
 * Main navigation header with responsive design and accessibility features
 */
export const Header = ({
  cartCount = 0,
  user,
  className = '',
  logoUrl = '/next.svg',
  logoAlt = 'Next Level Clothing',
  navLinks = [
    { href: '/products', label: 'Products' },
    { href: '/collections', label: 'Collections' },
    { href: '/about', label: 'About' }
  ],
  onLogin,
  onLogout,
  onCartClick,
}: HeaderProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className={`bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 ${className}`}>
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/">
              <img
                src={logoUrl}
                alt={logoAlt}
                width={120}
                height={30}
                className="h-8 w-auto dark:invert"
              />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8" aria-label="Main navigation">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white font-medium"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  Hello, {user.name}
                </span>
                <Button
                  variant="secondary"
                  onClick={onLogout}
                >
                  Logout
                </Button>
              </div>
            ) : (
              <Button
                variant="secondary"
                onClick={onLogin}
              >
                Login
              </Button>
            )}
            <button
              type="button"
              className="relative p-2 text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white"
              aria-label={`Shopping cart with ${cartCount} items`}
              onClick={onCartClick}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <path d="M16 10a4 4 0 0 1-8 0" />
              </svg>
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 -mt-1 -mr-1 bg-red-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-4">
            <button
              type="button"
              className="relative p-2 text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white"
              aria-label={`Shopping cart with ${cartCount} items`}
              onClick={onCartClick}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <path d="M16 10a4 4 0 0 1-8 0" />
              </svg>
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 -mt-1 -mr-1 bg-red-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>
            <button
              type="button"
              className="p-2 text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white"
              aria-expanded={isMenuOpen}
              aria-label="Toggle navigation menu"
              onClick={toggleMenu}
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                {isMenuOpen ? (
                  <path d="M18 6L6 18M6 6l12 12" />
                ) : (
                  <>
                    <line x1="4" y1="8" x2="20" y2="8" />
                    <line x1="4" y1="16" x2="20" y2="16" />
                  </>
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200 dark:border-gray-800">
            <nav className="flex flex-col space-y-3" aria-label="Mobile navigation">
              {navLinks.map((link) => {
                // Wrap with button so we can close menu on navigation
                const handleClick = () => setIsMenuOpen(false);
                
                return (
                  <div key={link.href} onClick={handleClick}>
                    <Link
                      href={link.href}
                      className="px-2 py-1 text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white font-medium block w-full"
                    >
                      {link.label}
                    </Link>
                  </div>
                );
              })}
              {user ? (
                <>
                  <div className="px-2 py-1 text-sm text-gray-700 dark:text-gray-300">
                    Hello, {user.name}
                  </div>
                  <Button
                    variant="secondary"
                    onClick={() => {
                      setIsMenuOpen(false);
                      onLogout?.();
                    }}
                    className="mx-2"
                  >
                    Logout
                  </Button>
                </>
              ) : (
                <Button
                  variant="secondary"
                  onClick={() => {
                    setIsMenuOpen(false);
                    onLogin?.();
                  }}
                  className="mx-2"
                >
                  Login
                </Button>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
