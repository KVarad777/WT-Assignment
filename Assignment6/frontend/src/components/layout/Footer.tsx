import React from 'react';
import { BookOpen, Heart, Sparkles } from 'lucide-react';

interface FooterProps {
  onNavigate: (page: 'home' | 'catalogue' | 'login' | 'register') => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="border-t border-[var(--border-subtle)] bg-[var(--bg-surface-subtle)] transition-colors duration-200 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand Col */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[var(--accent)] text-white flex items-center justify-center">
                <BookOpen className="w-4 h-4" />
              </div>
              <span className="font-serif text-xl font-bold tracking-tight text-[var(--text-primary)]">
                The Booksmith
              </span>
            </div>
            <p className="text-xs leading-relaxed text-[var(--text-secondary)]">
              An independent curated sanctuary for bibliophiles, developers, and thinkers. Hand-selected editions crafted for lasting impact.
            </p>
            <div className="flex items-center gap-1.5 text-xs text-[var(--text-muted)] font-medium">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Independent & Reader-Supported</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">
              Explore
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <button
                  onClick={() => onNavigate('home')}
                  className="text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors cursor-pointer"
                >
                  Home Showcase
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('catalogue')}
                  className="text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors cursor-pointer"
                >
                  Full Catalogue
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('catalogue')}
                  className="text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors cursor-pointer"
                >
                  Curated Collections
                </button>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">
              Featured Genres
            </h4>
            <ul className="space-y-2 text-sm text-[var(--text-secondary)]">
              <li>Software Craft & Architecture</li>
              <li>Stoic & Modern Philosophy</li>
              <li>Literary Fiction & Classics</li>
              <li>Human-Centered Design</li>
              <li>Cosmology & History</li>
            </ul>
          </div>

          {/* Architecture & Assignment Note */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">
              Architecture & Stack
            </h4>
            <div className="space-y-2 text-xs text-[var(--text-secondary)]">
              <p className="font-mono bg-[var(--bg-surface)] p-2.5 rounded-lg border border-[var(--border-subtle)] leading-relaxed">
                <span className="text-[var(--accent)] font-bold">Frontend:</span> React 19 + TypeScript<br/>
                <span className="text-[var(--accent)] font-bold">Backend:</span> Spring Boot 3.3.x<br/>
                <span className="text-[var(--accent)] font-bold">Database:</span> MongoDB 7.0<br/>
                <span className="text-[var(--accent)] font-bold">Container:</span> Docker Compose
              </p>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-6 border-t border-[var(--border-subtle)] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[var(--text-muted)]">
          <p>© {new Date().getFullYear()} The Booksmith Press. All rights reserved.</p>
          <div className="flex items-center gap-2">
            <span>Designed & Built with</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 inline" />
            <span>by Varad</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
