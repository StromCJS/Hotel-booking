import React, { useState } from 'react';
import { AuthProvider, useAuth } from '@/app/contexts/AuthContext';
import { Login } from '@/app/components/Login';
import { Register } from '@/app/components/Register';
import { UserPortal } from '@/app/components/UserPortal';
import { AdminPanel } from '@/app/components/AdminPanel';

function AppContent() {
  const { user, isAdmin } = useAuth();
  const [showRegister, setShowRegister] = useState(false);

  // Not logged in - show auth pages
  if (!user) {
    return showRegister ? (
      <Register onSwitchToLogin={() => setShowRegister(false)} />
    ) : (
      <Login onSwitchToRegister={() => setShowRegister(true)} />
    );
  }

  // Logged in as admin - show admin panel
  if (isAdmin) {
    return <AdminPanel />;
  }

  // Logged in as customer - show user portal
  return <UserPortal />;
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}