import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { UserProvider } from '@/context/UserContext';
import { LanguageProvider } from '@/context/LanguageContext';
import { ThemeProvider } from '@/context/ThemeContext';
import { Toaster } from '@/components/ui/sonner';
import LoginPage from '@/pages/LoginPage';
import Dashboard from '@/pages/Dashboard';
import DisposisiDetailPage from '@/pages/DisposisiDetailPage';
import CreateDisposisiPage from '@/pages/CreateDisposisiPage';
import AccountPage from '@/pages/AccountPage';
import InitializePage from '@/pages/InitializePage';

export default function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <UserProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Navigate to="/login" replace />} />
              <Route path="/initialize" element={<InitializePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/disposisi/baru" element={<CreateDisposisiPage />} />
              <Route path="/disposisi/:id" element={<DisposisiDetailPage />} />
              <Route path="/account" element={<AccountPage />} />
            </Routes>
            <Toaster />
          </BrowserRouter>
        </UserProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}