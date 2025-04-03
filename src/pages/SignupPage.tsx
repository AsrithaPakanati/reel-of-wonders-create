
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { SignupForm } from '@/components/auth/SignupForm';
import { useAuth } from '@/contexts/AuthContext';
import { Header } from '@/components/common/Header';

const SignupPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow flex items-center justify-center p-4">
        <SignupForm />
      </main>
    </div>
  );
};

export default SignupPage;
