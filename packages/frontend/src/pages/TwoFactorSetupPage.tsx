import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import TwoFactorSetup from '../components/TwoFactorSetup';

export default function TwoFactorSetupPage() {
  const navigate = useNavigate();
  const { refreshUser } = useAuth();

  const handleSuccess = async () => {
    await refreshUser();
    navigate('/dashboard');
  };

  const handleCancel = () => {
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <TwoFactorSetup onSuccess={handleSuccess} onCancel={handleCancel} />
    </div>
  );
}
