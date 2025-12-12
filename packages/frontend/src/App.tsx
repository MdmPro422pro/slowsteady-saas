import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { WagmiProvider } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { Toaster } from 'sonner';
import { AuthProvider } from './contexts/AuthContext';
import Login from './components/Login';
import Signup from './components/Signup';
import Dashboard from './pages/Dashboard';
import TwoFactorSetupPage from './pages/TwoFactorSetupPage';
import TwoFactorVerifyPage from './pages/TwoFactorVerifyPage';
import Landing from './pages/Landing';
import BusinessDashboard from './pages/BusinessDashboard';
import PersonalDashboard from './pages/PersonalDashboard';
import AdminDashboard from './pages/AdminDashboard';
import AdminMasterControl from './pages/AdminMasterControl';
import AdminPanel from './pages/AdminPanel';
import ProductsPage from './pages/ProductsPage';
import GamingPage from './pages/GamingPage';
import FaucetsPage from './pages/FaucetsPage';
import CommunityPage from './pages/CommunityPage';
import MembershipSuccess from './pages/MembershipSuccess';
import MembershipCancel from './pages/MembershipCancel';
import SettingsPage from './pages/SettingsPage';
import PaymentsPage from './pages/PaymentsPage';
import AnalyticsPage from './pages/AnalyticsPage';
import NotificationsPage from './pages/NotificationsPage';
import SupportPage from './pages/SupportPage';
import SecurityPage from './pages/SecurityPage';
import DocumentationPage from './pages/DocumentationPage';
import ProtectedRoute from './components/ProtectedRoute';
import { config } from './lib/wagmi';
import '@rainbow-me/rainbowkit/styles.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

export default function App() {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider
          modalSize="compact"
          showRecentTransactions={true}
        >
          <BrowserRouter>
            <AuthProvider>
              <Toaster 
                position="top-right" 
                theme="dark"
                toastOptions={{
                  style: {
                    background: '#1a1f2e',
                    border: '1px solid rgba(218, 165, 32, 0.3)',
                    color: '#e8e6e3',
                  },
                }}
              />
              <Routes>
                <Route path="/" element={<Landing />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignupPage />} />
                <Route path="/2fa-verify" element={<TwoFactorVerifyPage />} />
                <Route path="/business" element={<BusinessDashboard />} />
                <Route path="/personal" element={<PersonalDashboard />} />
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/admin-master" element={<AdminMasterControl />} />
                <Route path="/admin-panel" element={<AdminPanel />} />
                <Route path="/products" element={<ProductsPage />} />
                <Route path="/gaming" element={<GamingPage />} />
                <Route path="/faucets" element={<FaucetsPage />} />
                <Route path="/community" element={<CommunityPage />} />
                <Route path="/membership/success" element={<MembershipSuccess />} />
                <Route path="/membership/cancel" element={<MembershipCancel />} />
                <Route path="/settings" element={<SettingsPage />} />
                <Route path="/payments" element={<PaymentsPage />} />
                <Route path="/analytics" element={<AnalyticsPage />} />
                <Route path="/notifications" element={<NotificationsPage />} />
                <Route path="/support" element={<SupportPage />} />
                <Route path="/security" element={<SecurityPage />} />
                <Route path="/docs" element={<DocumentationPage />} />
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/2fa-setup"
                  element={
                    <ProtectedRoute>
                      <TwoFactorSetupPage />
                    </ProtectedRoute>
                  }
                />
              </Routes>
            </AuthProvider>
          </BrowserRouter>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <Login />
    </div>
  );
}

function SignupPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <Signup />
    </div>
  );
}


