import React from 'react';
import { Route, Routes, BrowserRouter as Router } from 'react-router-dom';
import ScrollToTop from '@/components/ScrollToTop.jsx';
import { AuthProvider } from '@/contexts/AuthContext.jsx';
import { LanguageProvider } from '@/contexts/LanguageContext.jsx';
import ProtectedRoute from '@/components/ProtectedRoute.jsx';
import Header from '@/components/Header.jsx';
import './i18n';

import HomePage from '@/pages/HomePage.jsx';
import LoginPage from '@/pages/LoginPage.jsx';
import SignupPage from '@/pages/SignupPage.jsx';
import CompanyDashboard from '@/pages/CompanyDashboard.jsx';
import SpaceManagement from '@/pages/SpaceManagement.jsx';
import InteractiveMap from '@/pages/InteractiveMap.jsx';
import ContractManagement from '@/pages/ContractManagement.jsx';
import AnalyticsDashboard from '@/pages/AnalyticsDashboard.jsx';
import SettingsPage from '@/pages/SettingsPage.jsx';
import StoreLayoutBuilderPage from '@/pages/StoreLayoutBuilderPage.jsx';

// Admin Pages
import AdminLayout from '@/pages/admin/AdminLayout.jsx';
import AdminDashboard from '@/pages/admin/AdminDashboard.jsx';
import AdminCompaniesPage from '@/pages/admin/AdminCompaniesPage.jsx';
import AdminSubscriptionsPage from '@/pages/admin/AdminSubscriptionsPage.jsx';
import AdminUsersPage from '@/pages/admin/AdminUsersPage.jsx';
import AdminAuditLogPage from '@/pages/admin/AdminAuditLogPage.jsx';
import AdminSettingsPage from '@/pages/admin/AdminSettingsPage.jsx';

function App() {
  return (
    <AuthProvider>
      <LanguageProvider>
        <Router>
          <ScrollToTop />
          <div className="min-h-screen flex flex-col bg-background text-foreground selection:bg-primary/30 selection:text-primary-foreground">
            <Header />
            <main className="flex-1">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignupPage />} />
                
                {/* Admin Routes */}
                <Route path="/admin" element={
                  <ProtectedRoute requireAdmin>
                    <AdminLayout />
                  </ProtectedRoute>
                }>
                  <Route index element={<AdminDashboard />} />
                  <Route path="companies" element={<AdminCompaniesPage />} />
                  <Route path="subscriptions" element={<AdminSubscriptionsPage />} />
                  <Route path="users" element={<AdminUsersPage />} />
                  <Route path="audit" element={<AdminAuditLogPage />} />
                  <Route path="settings" element={<AdminSettingsPage />} />
                </Route>

                {/* Company Routes */}
                <Route path="/dashboard" element={
                  <ProtectedRoute requireCompany>
                    <CompanyDashboard />
                  </ProtectedRoute>
                } />
                <Route path="/spaces" element={
                  <ProtectedRoute requireCompany>
                    <SpaceManagement />
                  </ProtectedRoute>
                } />
                <Route path="/map" element={
                  <ProtectedRoute requireCompany>
                    <InteractiveMap />
                  </ProtectedRoute>
                } />
                <Route path="/contracts" element={
                  <ProtectedRoute requireCompany>
                    <ContractManagement />
                  </ProtectedRoute>
                } />
                <Route path="/analytics" element={
                  <ProtectedRoute requireCompany>
                    <AnalyticsDashboard />
                  </ProtectedRoute>
                } />
                <Route path="/store-layout-builder" element={
                  <ProtectedRoute requireCompany>
                    <StoreLayoutBuilderPage />
                  </ProtectedRoute>
                } />
                
                {/* Shared Protected Routes */}
                <Route path="/settings" element={
                  <ProtectedRoute>
                    <SettingsPage />
                  </ProtectedRoute>
                } />
              </Routes>
            </main>
          </div>
        </Router>
      </LanguageProvider>
    </AuthProvider>
  );
}

export default App;
