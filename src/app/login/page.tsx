// app/login/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { RootState } from '@/src/lib/store';
import LoginForm from '@/src/components/auth/LoginForm';
import OTPVerification from '@/src/components/auth/OTPVerification';

export default function LoginPage() {
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [phoneData, setPhoneData] = useState<{ phone: string; countryCode: string } | null>(null);
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, router]);

  const handlePhoneSubmit = (phone: string, countryCode: string) => {
    setPhoneData({ phone, countryCode });
    setStep('otp');
  };

  const handleOTPVerified = () => {
    router.push('/');
  };

  if (isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl text-white font-bold">G</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Gemini Clone
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Sign in to start chatting with AI
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
          {step === 'phone' ? (
            <LoginForm onPhoneSubmit={handlePhoneSubmit} />
          ) : (
            <OTPVerification
              phone={phoneData?.phone || ''}
              countryCode={phoneData?.countryCode || ''}
              onVerified={handleOTPVerified}
              onBack={() => setStep('phone')}
            />
          )}
        </div>
      </div>
    </div>
  );
}