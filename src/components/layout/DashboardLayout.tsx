import React from 'react';
import { Link } from 'react-router-dom';
import { Activity, TrendingUp, BarChart3, Globe, Zap } from 'lucide-react';

interface TerminalHeaderProps {
  title: string;
  subtitle?: string;
}

export const TerminalHeader: React.FC<TerminalHeaderProps> = ({ title, subtitle }) => {
  return (
    <div className="terminal-header">
      <div className="flex items-center gap-2">
        <div className="terminal-dot red"></div>
        <div className="terminal-dot yellow"></div>
        <div className="terminal-dot green"></div>
      </div>
      <div className="flex-1 flex items-center justify-center gap-2">
        <Activity className="w-4 h-4 text-terminal-accent" />
        <span className="text-terminal-accent font-semibold text-sm">
          {title}
        </span>
        {subtitle && (
          <span className="text-terminal-text/70 text-xs">
            | {subtitle}
          </span>
        )}
      </div>
      <div className="flex items-center gap-1 text-xs text-terminal-text/50">
        <div className="w-2 h-2 bg-terminal-accent rounded-full animate-pulse"></div>
        LIVE
      </div>
    </div>
  );
};

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-terminal-bg matrix-bg">
      {/* Matrix Background Effect */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="absolute text-terminal-accent/10 text-xs font-mono matrix-char"
            style={{
              left: `${i * 5}%`,
              '--delay': i,
            } as React.CSSProperties}
          >
            {'10010110'.repeat(100)}
          </div>
        ))}
      </div>

      {/* Main Header */}
      <header className="relative z-10 border-b border-terminal-border bg-terminal-surface/80 backdrop-blur-md">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-terminal-accent rounded-md flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-terminal-bg" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-terminal-accent">
                    ASETPEDIA
                  </h1>
                  <p className="text-xs text-terminal-text/70">
                    AI-Powered Market Analysis Platform
                  </p>
                </div>
              </div>
            </div>            <nav className="flex items-center gap-6">
              <Link to="/">
                <NavItem icon={BarChart3} label="Markets" active />
              </Link>
              <Link to="/news">
                <NavItem icon={Globe} label="News" />
              </Link>
              <Link to="/tools">
                <NavItem icon={Zap} label="Market Tools" />
              </Link>
            </nav>

            <div className="flex items-center gap-3">
              <div className="text-right">
                <div className="text-xs text-terminal-text/70">
                  {new Date().toLocaleDateString('id-ID', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </div>
                <div className="text-sm font-mono text-terminal-accent">
                  {new Date().toLocaleTimeString('id-ID')}
                </div>
              </div>
              <div className="w-px h-8 bg-terminal-border"></div>
              <StatusIndicator />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 container mx-auto px-4 py-6">
        {children}
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-terminal-border bg-terminal-surface/50 backdrop-blur-md mt-12">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between text-xs text-terminal-text/50">
            <div>
              © 2025 ASETPEDIA - AI-Powered Financial Analysis Platform
            </div>
            <div className="flex items-center gap-4">
              <span>Powered by Llama AI</span>
              <span>•</span>
              <span>Real-time Data</span>
              <span>•</span>
              <span>Market Intelligence</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

interface NavItemProps {
  icon: React.ComponentType<any>;
  label: string;
  active?: boolean;
}

const NavItem: React.FC<NavItemProps> = ({ icon: Icon, label, active }) => {
  return (
    <button
      className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-all duration-200 ${
        active
          ? 'bg-terminal-accent/20 text-terminal-accent border border-terminal-accent/30'
          : 'text-terminal-text/70 hover:text-terminal-accent hover:bg-terminal-accent/10'
      }`}
    >
      <Icon className="w-4 h-4" />
      {label}
    </button>
  );
};

const StatusIndicator: React.FC = () => {
  return (
    <div className="flex items-center gap-2">
      <div className="flex flex-col items-end text-xs">
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 bg-terminal-accent rounded-full animate-pulse"></div>
          <span className="text-terminal-accent">ONLINE</span>
        </div>
        <div className="text-terminal-text/50">
          API: Connected
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
