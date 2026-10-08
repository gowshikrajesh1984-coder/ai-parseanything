import React, { useState } from 'react';
import {
  Menu,
  Bell,
  HelpCircle,
  ChevronDown,
  CheckCircle2,
  Upload,
  FileText,
  User,
  LogOut,
  Settings,
  ShieldCheck,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useDocument } from '../../context/DocumentContext';
import { useAuth } from '../../context/AuthContext';
import { ParseLogoIcon } from '../common/ParseLogo';

interface TopBarProps {
  onOpenMobileMenu: () => void;
  title?: string;
}

export const TopBar: React.FC<TopBarProps> = ({ onOpenMobileMenu, title }) => {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotificationMenu, setShowNotificationMenu] = useState(false);
  const navigate = useNavigate();
  const { document: doc, removeFile } = useDocument();
  const { currentUser, logout } = useAuth();

  const handleLogout = () => {
    setShowProfileMenu(false);
    removeFile();
    logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-30 h-16 bg-[#F6F9F2]/90 backdrop-blur-md border-b border-[#DCE8D4] px-6 flex items-center justify-between text-[#29452B]">
      {/* Left: Mobile hamburger & title */}
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={onOpenMobileMenu}
          className="md:hidden p-2 rounded-xl text-[#29452B] hover:bg-white border border-[#DCE8D4] transition-colors"
          aria-label="Open menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {title ? (
          <div className="flex items-center gap-2 text-sm">
            <div className="flex items-center gap-1.5 text-[#788773] font-medium">
              <ParseLogoIcon size={22} />
              <span className="hidden sm:inline">ParseAnything</span>
            </div>
            <span className="text-[#95A590]">/</span>
            <span className="text-[#29452B] font-bold">{title}</span>
          </div>
        ) : (
          <div className="flex items-center gap-1.5">
            <ParseLogoIcon size={24} />
            <span className="font-extrabold text-sm text-[#29452B]">ParseAnything</span>
          </div>
        )}
      </div>

      {/* Right: Actions & User Avatar */}
      <div className="flex items-center gap-3">
        {/* Upload Quick Button */}
        <button
          onClick={() => navigate('/documents')}
          className="hidden sm:inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white border border-[#DCE8D4] hover:border-[#729C56] text-xs font-bold text-[#29452B] shadow-2xs hover:shadow-xs transition-all"
        >
          <Upload className="w-3.5 h-3.5 text-[#4D9857]" />
          <span>Upload File</span>
        </button>

        {/* Notifications toggle */}
        <div className="relative">
          <button
            onClick={() => {
              setShowNotificationMenu(!showNotificationMenu);
              setShowProfileMenu(false);
            }}
            className="p-2 rounded-full text-[#788773] hover:text-[#29452B] hover:bg-white border border-transparent hover:border-[#DCE8D4] transition-all relative"
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#4D9857]" />
          </button>

          {showNotificationMenu && (
            <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-[#DCE8D4] p-3 text-xs z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="flex items-center justify-between pb-2 border-b border-[#DCE8D4]/60 mb-2">
                <span className="font-bold text-[#29452B]">Notifications</span>
                <span className="text-[10px] text-[#4D9857] font-semibold bg-[#EAF4E2] px-1.5 py-0.5 rounded">
                  All Synced
                </span>
              </div>
              <div className="space-y-2">
                <div className="p-2 rounded-xl bg-[#F6F9F2] flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#4D9857] shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-[#29452B]">{doc.name} processed</p>
                    <p className="text-[11px] text-[#788773]">Extracted 48 blocks with 92.4% confidence</p>
                  </div>
                </div>
                <div className="p-2 rounded-xl bg-[#FDE8E8] flex items-start gap-2.5">
                  <span className="w-2 h-2 rounded-full bg-[#E76F6F] shrink-0 mt-1.5" />
                  <div>
                    <p className="font-semibold text-[#29452B]">5 pages require review</p>
                    <p className="text-[11px] text-[#788773]">Pages 3, 7, 12, 16, 21 flagged</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Profile Avatar Button */}
        <div className="relative">
          <button
            onClick={() => {
              setShowProfileMenu(!showProfileMenu);
              setShowNotificationMenu(false);
            }}
            className="flex items-center gap-2 p-1 pl-1.5 pr-2 rounded-full bg-white border border-[#DCE8D4] hover:border-[#729C56] shadow-2xs hover:shadow-xs transition-all"
            aria-label="User profile menu"
          >
            <div className="w-8 h-8 rounded-full overflow-hidden border border-[#DCE8D4] bg-[#EAF4E2] flex items-center justify-center shrink-0">
              <img
                src={currentUser?.avatarUrl || "/src/assets/images/avatar_profile_user_1791377545598.jpg"}
                alt="Profile"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
              <User className="w-4 h-4 text-[#29452B] hidden" />
            </div>
            <div className="hidden lg:flex flex-col text-left">
              <span className="text-xs font-bold text-[#29452B] leading-none">
                {currentUser?.name || 'Sarah Jenkins'}
              </span>
              <span className="text-[10px] text-[#788773] leading-tight">
                {currentUser?.role || 'AI Document Analyst'}
              </span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-[#788773]" />
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-[#DCE8D4] p-2 text-xs z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              {/* User information */}
              <div className="px-3 py-2 border-b border-[#DCE8D4]/70 mb-1">
                <p className="font-extrabold text-[#29452B] text-sm">
                  {currentUser?.name || 'Sarah Jenkins'}
                </p>
                <p className="text-[11px] text-[#788773] truncate">
                  {currentUser?.email || 'sarah.jenkins@acmecorp.ai'}
                </p>
                <div className="mt-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#EAF4E2] text-[#29452B] text-[10px] font-bold">
                  <ShieldCheck className="w-3 h-3 text-[#4D9857]" />
                  <span>{currentUser?.plan || 'Enterprise Plan'}</span>
                </div>
              </div>

              {/* Menu items */}
              <div className="space-y-0.5">
                <button
                  onClick={() => {
                    navigate('/documents');
                    setShowProfileMenu(false);
                  }}
                  className="w-full text-left px-3 py-2 rounded-xl hover:bg-[#F6F9F2] text-[#29452B] flex items-center gap-2.5 font-semibold transition-colors"
                >
                  <FileText className="w-4 h-4 text-[#729C56]" />
                  <span>Document Workspace</span>
                </button>
                <button
                  onClick={() => {
                    navigate('/settings');
                    setShowProfileMenu(false);
                  }}
                  className="w-full text-left px-3 py-2 rounded-xl hover:bg-[#F6F9F2] text-[#29452B] flex items-center gap-2.5 font-semibold transition-colors"
                >
                  <Settings className="w-4 h-4 text-[#788773]" />
                  <span>Settings & Pipeline</span>
                </button>
              </div>

              {/* Logout button */}
              <div className="pt-1 mt-1 border-t border-[#DCE8D4]/70">
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-3 py-2 rounded-xl hover:bg-[#FDE8E8] text-[#E76F6F] flex items-center gap-2.5 font-bold transition-colors cursor-pointer"
                >
                  <LogOut className="w-4 h-4 text-[#E76F6F]" />
                  <span>Log Out</span>
                </button>
              </div>

              <div className="px-3 py-1.5 text-[10px] text-[#95A590] border-t border-[#DCE8D4]/40 mt-1">
                ParseAnything Neural v3.4.2
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
