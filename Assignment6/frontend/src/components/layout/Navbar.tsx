import React, { useState } from 'react';
import { BookOpen, Moon, Sun, LogOut, Menu, X, Compass } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';

interface NavbarProps {
  currentPage: 'home' | 'catalogue' | 'login' | 'register';
  onNavigate: (page: 'home' | 'catalogue' | 'login' | 'register') => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentPage, onNavigate }) => {
  const { theme, toggleTheme } = useTheme();
  const { user, isAuthenticated, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const handleNav = (page: 'home' | 'catalogue' | 'login' | 'register') => {
    onNavigate(page);
    setMobileMenuOpen(false);
    setUserDropdownOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md border-b transition-colors duration-200 bg-[var(--bg-surface)]/90 border-[var(--border-subtle)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand Logo */}
          <button
            onClick={() => handleNav('home')}
            className="flex items-center gap-3 group text-left cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] rounded-lg p-1"
          >
            <div className="w-10 h-10 rounded-xl bg-[var(--accent)] text-white flex items-center justify-center shadow-md group-hover:scale-105 transition-transform duration-200">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <span className="block font-serif text-2xl font-bold tracking-tight text-[var(--text-primary)]">
                The Booksmith
              </span>
              <span className="block text-[11px] font-medium tracking-wider uppercase text-[var(--text-muted)]">
                Curated Independent Press
              </span>
            </div>
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            <button
              onClick={() => handleNav('home')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 cursor-pointer ${
                currentPage === 'home'
                  ? 'bg-[var(--bg-surface-subtle)] text-[var(--accent-text)] font-semibold shadow-xs'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-subtle)]/60'
              }`}
            >
              Home
            </button>
            <button
              onClick={() => handleNav('catalogue')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 cursor-pointer flex items-center gap-1.5 ${
                currentPage === 'catalogue'
                  ? 'bg-[var(--bg-surface-subtle)] text-[var(--accent-text)] font-semibold shadow-xs'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-subtle)]/60'
              }`}
            >
              <Compass className="w-4 h-4" />
              Catalogue
            </button>
          </nav>

          {/* Actions & Profile */}
          <div className="hidden md:flex items-center gap-3">
            {/* Theme Switcher */}
            <button
              onClick={toggleTheme}
              aria-label="Toggle Theme"
              className="p-2.5 rounded-full text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-subtle)] transition-colors duration-200 cursor-pointer border border-[var(--border-subtle)]"
              title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400 animate-in fade-in zoom-in" />
              ) : (
                <Moon className="w-4 h-4 text-stone-600 animate-in fade-in zoom-in" />
              )}
            </button>

            {/* Authentication States */}
            {isAuthenticated && user ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2.5 px-3.5 py-1.5 rounded-full border border-[var(--border-strong)] bg-[var(--bg-surface-subtle)] hover:bg-[var(--bg-surface-elevated)] transition-colors cursor-pointer text-sm font-medium text-[var(--text-primary)]"
                >
                  <div className="w-7 h-7 rounded-full bg-[var(--accent)] text-white flex items-center justify-center text-xs font-bold uppercase">
                    {user.name.charAt(0)}
                  </div>
                  <span className="max-w-[120px] truncate">{user.name}</span>
                </button>

                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)] shadow-xl py-2 z-50 animate-in fade-in zoom-in-95">
                    <div className="px-4 py-2 border-b border-[var(--border-subtle)]">
                      <p className="text-xs font-semibold text-[var(--text-primary)] truncate">{user.name}</p>
                      <p className="text-xs text-[var(--text-muted)] truncate">{user.email}</p>
                    </div>
                    <button
                      onClick={() => {
                        logout();
                        setUserDropdownOpen(false);
                      }}
                      className="w-full px-4 py-2.5 text-left text-sm text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 flex items-center gap-2 transition-colors cursor-pointer"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleNav('login')}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 cursor-pointer ${
                    currentPage === 'login'
                      ? 'bg-[var(--bg-surface-subtle)] text-[var(--accent-text)] font-semibold'
                      : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-subtle)]'
                  }`}
                >
                  Sign In
                </button>
                <button
                  onClick={() => handleNav('register')}
                  className="px-5 py-2 rounded-full text-sm font-medium text-white bg-[var(--accent)] hover:opacity-90 shadow-sm transition-all duration-200 cursor-pointer hover:shadow-md active:scale-98"
                >
                  Join Club
                </button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 md:hidden">
            <button
              onClick={toggleTheme}
              aria-label="Toggle Theme"
              className="p-2 rounded-full text-[var(--text-secondary)] hover:bg-[var(--bg-surface-subtle)] cursor-pointer"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5" />}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-[var(--text-secondary)] hover:bg-[var(--bg-surface-subtle)] cursor-pointer"
              aria-label="Open menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[var(--border-subtle)] bg-[var(--bg-surface)] px-4 pt-3 pb-6 space-y-3 animate-in slide-in-from-top-4 duration-200">
          <button
            onClick={() => handleNav('home')}
            className={`w-full text-left px-4 py-3 rounded-lg text-base font-medium flex items-center gap-3 ${
              currentPage === 'home'
                ? 'bg-[var(--bg-surface-subtle)] text-[var(--accent-text)] font-semibold'
                : 'text-[var(--text-primary)]'
            }`}
          >
            <BookOpen className="w-5 h-5" />
            Home
          </button>
          <button
            onClick={() => handleNav('catalogue')}
            className={`w-full text-left px-4 py-3 rounded-lg text-base font-medium flex items-center gap-3 ${
              currentPage === 'catalogue'
                ? 'bg-[var(--bg-surface-subtle)] text-[var(--accent-text)] font-semibold'
                : 'text-[var(--text-primary)]'
            }`}
          >
            <Compass className="w-5 h-5" />
            Browse Catalogue
          </button>

          <div className="pt-3 border-t border-[var(--border-subtle)] space-y-2">
            {isAuthenticated && user ? (
              <>
                <div className="px-4 py-2 bg-[var(--bg-surface-subtle)] rounded-lg">
                  <p className="text-sm font-semibold text-[var(--text-primary)]">{user.name}</p>
                  <p className="text-xs text-[var(--text-muted)]">{user.email}</p>
                </div>
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-left px-4 py-3 rounded-lg text-base font-medium text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 flex items-center gap-2"
                >
                  <LogOut className="w-5 h-5" />
                  Sign Out
                </button>
              </>
            ) : (
              <div className="grid grid-cols-2 gap-2 pt-2">
                <button
                  onClick={() => handleNav('login')}
                  className="w-full py-2.5 text-center text-sm font-medium border border-[var(--border-strong)] rounded-lg text-[var(--text-primary)]"
                >
                  Sign In
                </button>
                <button
                  onClick={() => handleNav('register')}
                  className="w-full py-2.5 text-center text-sm font-medium bg-[var(--accent)] text-white rounded-lg"
                >
                  Register
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
