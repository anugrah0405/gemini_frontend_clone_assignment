'use client';

import { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/src/hooks/useAuth';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { useToast } from '@/src/hooks/useToast';

interface OTPVerificationProps {
  phone: string;
  countryCode: string;
  onVerified: () => void;
  onBack: () => void;
}

export default function OTPVerification({
  phone,
  countryCode,
  onVerified,
  onBack,
}: OTPVerificationProps) {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const { isLoading, verifyOTP } = useAuth();
  const toast = useToast();

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    if (newOtp.every(digit => digit) && index === 5) {
      handleSubmit(newOtp.join(''));
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 6);
    if (/^\d+$/.test(pastedData)) {
      const newOtp = pastedData.split('').slice(0, 6);
      setOtp([...newOtp, ...Array(6 - newOtp.length).fill('')]);

      const nextIndex = Math.min(newOtp.length, 5);
      inputRefs.current[nextIndex]?.focus();

      if (newOtp.length === 6) {
        handleSubmit(newOtp.join(''));
      }
    }
  };

  const handleSubmit = async (otpValue: string = otp.join('')) => {
    if (otpValue.length !== 6) {
      setError('Please enter all 6 digits');
      return;
    }

    setError('');
    const isValid = await verifyOTP(otpValue, phone, countryCode);

    if (isValid) {
      onVerified();
    } else {
      setError('Invalid OTP. Please try again.');
      setOtp(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    }
  };

  const formatPhone = (phone: string) => {
    return `${countryCode} ${phone.slice(countryCode.length)}`;
  };

  return (
    <div className="space-y-6 flex flex-col justify-center items-center">
      <div className="flex flex-col items-center space-x-2">
        <button
          onClick={onBack}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
        >
          <ArrowLeft className="h-5 w-5 text-gray-600 dark:text-gray-400" />
        </button>
        <div className='flex flex-col items-center'>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Verify your phone
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            We sent a code to {formatPhone(phone)}
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Enter verification code ( Use 123456 for simulation)
          </label>

          <div className="flex space-x-3 justify-center">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => { inputRefs.current[index] = el; }}
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={index === 0 ? handlePaste : undefined}
                className="w-12 h-12 text-center text-lg font-semibold border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            ))}
          </div>

          {error && (
            <p className="mt-2 text-sm text-red-600 dark:text-red-400 text-center">
              {error}
            </p>
          )}
        </div>

        <button
          onClick={() => handleSubmit()}
          disabled={isLoading || otp.some(digit => !digit)}
          className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            'Verify OTP'
          )}
        </button>
      </div>

      <div className="text-center">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Didn't receive the code?{' '}
          <button
            type="button"
            className="text-blue-600 hover:text-blue-500 font-medium"
            onClick={() => {
              setTimeout(() => {
                toast.success('OTP resent successfully!');
              }, 1000);
            }}
          >
            Resend OTP
          </button>
        </p>
      </div>
    </div>
  );
}