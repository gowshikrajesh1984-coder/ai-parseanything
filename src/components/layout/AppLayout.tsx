import React, { useState } from 'react';
import { Outlet, useLocation, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';
import { RightDrawerContainer } from '../drawers/RightDrawerContainer';
import { BookModal } from '../book/BookModal';
import { useAuth } from '../../context/AuthContext';

export const AppLayout: React.FC = () => {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const location = useLocation();
  const { isAuthenticated } = useAuth();

  // Route protection: redirect to /login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  const getPageTitle = () => {
    switch (location.pathname) {
      case '/documents':
      case '/':
        return 'Documents & Workspace';
      case '/results':
        return 'Parsing Results';
      case '/history':
        return 'Document History';
      case '/settings':
        return 'Settings';
      default:
        return 'Documents';
    }
  };

  return (
    <div className="min-h-screen bg-[#F6F9F2] flex flex-col md:flex-row text-[#29452B]">
      {/* Persistent Left Sidebar */}
      <Sidebar
        isOpen={mobileSidebarOpen}
        onClose={() => setMobileSidebarOpen(false)}
      />

      {/* Main Content Area (Offset by 240px on desktop) */}
      <div className="flex-1 md:pl-[240px] flex flex-col min-h-screen">
        {/* Top Navigation Bar */}
        <TopBar
          onOpenMobileMenu={() => setMobileSidebarOpen(true)}
          title={getPageTitle()}
        />

        {/* Page View with subtle transition */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* Right-Side Drawers (Documents Processed, Accuracy, Review) */}
      <RightDrawerContainer />

      {/* Book-Shaped Parsing Popup Modal */}
      <BookModal />
    </div>
  );
};
