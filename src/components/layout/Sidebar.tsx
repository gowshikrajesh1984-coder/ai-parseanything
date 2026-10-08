import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  Home,
  FileText,
  History,
  Settings,
  Sparkles,
  X,
  ShieldCheck,
} from 'lucide-react';
import { ParseLogo } from '../common/ParseLogo';

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen = false, onClose }) => {
  const navItems = [
    { label: 'Home', path: '/documents', icon: Home, end: false },
    { label: 'Documents', path: '/documents', icon: FileText, end: true },
    { label: 'History', path: '/history', icon: History, end: false },
    { label: 'Settings', path: '/settings', icon: Settings, end: false },
  ];

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-xs md:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-[240px] bg-white border-r border-[#DCE8D4] flex flex-col justify-between transition-transform duration-300 md:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Top: Logo & Nav */}
        <div className="p-6">
          {/* Logo Brand */}
          <div className="flex items-center justify-between mb-8">
            <NavLink
              to="/documents"
              className="group inline-flex items-center"
              onClick={onClose}
              aria-label="ParseAnything Home"
            >
              <ParseLogo size="md" tagline="Document AI" interactive={true} />
            </NavLink>

            {/* Mobile close button */}
            {onClose && (
              <button
                type="button"
                onClick={onClose}
                className="md:hidden p-1.5 rounded-lg text-[#788773] hover:text-[#29452B] hover:bg-[#F6F9F2] transition-colors"
                aria-label="Close navigation"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Navigation Links (No Dashboard) */}
          <nav className="space-y-1.5" aria-label="Main Navigation">
            {navItems.map((item, index) => {
              const Icon = item.icon;
              // For Home vs Documents, differentiate by index so they can both link to /documents or /
              return (
                <NavLink
                  key={`${item.path}-${index}`}
                  to={item.path}
                  end={item.end}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
                      isActive
                        ? 'bg-[#EAF4E2] text-[#29452B] font-bold shadow-2xs border-l-3 border-[#729C56]'
                        : 'text-[#788773] hover:text-[#29452B] hover:bg-[#F6F9F2]'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <Icon
                        className={`w-5 h-5 transition-colors ${
                          isActive ? 'text-[#29452B]' : 'text-[#788773]'
                        }`}
                      />
                      <span>{item.label}</span>
                    </>
                  )}
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Bottom Section with Text & Subtle Pastel Green Wave Graphic */}
        <div className="relative overflow-hidden p-6 pt-0">
          <div className="relative z-10 pt-4 border-t border-[#DCE8D4]">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-[#EAF4E2] text-[#29452B] text-[11px] font-bold mb-2">
              <Sparkles className="w-3 h-3 text-[#4D9857]" />
              <span>Neural Pipeline</span>
            </div>
            <p className="text-[13px] text-[#29452B] font-semibold leading-relaxed">
              Turn any document
              <br />
              into structured data
              <br />
              with AI.
            </p>
          </div>

          {/* Abstract Wave / Gradient Decoration in Pastel Green at bottom */}
          <div className="mt-4 -mx-6 -mb-6 h-20 relative pointer-events-none opacity-90">
            <svg
              className="w-full h-full"
              viewBox="0 0 240 80"
              preserveAspectRatio="none"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <linearGradient id="waveGradGreen1" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#EAF4E2" stopOpacity="0.9" />
                  <stop offset="100%" stopColor="#DCE8D4" stopOpacity="0.6" />
                </linearGradient>
                <linearGradient id="waveGradGreen2" x1="0%" y1="100%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#A8D584" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#729C56" stopOpacity="0.1" />
                </linearGradient>
              </defs>
              <path
                d="M0 45 C 50 20, 110 60, 170 30 C 205 15, 230 40, 240 35 L 240 80 L 0 80 Z"
                fill="url(#waveGradGreen1)"
              />
              <path
                d="M0 55 C 60 40, 120 70, 180 45 C 210 35, 230 50, 240 48 L 240 80 L 0 80 Z"
                fill="url(#waveGradGreen2)"
              />
            </svg>
          </div>
        </div>
      </aside>
    </>
  );
};
