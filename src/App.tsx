import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { DocumentProvider } from './context/DocumentContext';
import { AppLayout } from './components/layout/AppLayout';
import { LoginView } from './components/auth/LoginView';
import { RegisterView } from './components/auth/RegisterView';
import { DocumentUploadView } from './components/upload/DocumentUploadView';
import { ParsingResultsView } from './components/results/ParsingResultsView';
import { HistoryView } from './components/history/HistoryView';
import { SettingsView } from './components/settings/SettingsView';

export default function App() {
  return (
    <AuthProvider>
      <DocumentProvider>
        <BrowserRouter>
          <Routes>
            {/* Public Authentication Routes */}
            <Route path="/login" element={<LoginView />} />
            <Route path="/register" element={<RegisterView />} />

            {/* Authenticated Application Layout & Workspaces */}
            <Route element={<AppLayout />}>
              <Route path="/" element={<Navigate to="/documents" replace />} />
              <Route path="/documents" element={<DocumentUploadView />} />
              <Route path="/results" element={<ParsingResultsView />} />
              <Route path="/history" element={<HistoryView />} />
              <Route path="/settings" element={<SettingsView />} />
              <Route path="/dashboard" element={<Navigate to="/documents" replace />} />
              <Route path="*" element={<Navigate to="/documents" replace />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </DocumentProvider>
    </AuthProvider>
  );
}
