// hooks/useAuth.ts
import { useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setUser, logout, setLoading } from '@/src/lib/slices/authSlice';
import { RootState } from '@/src/lib/store';
import { useToast } from '@/src/hooks/useToast';

export const useAuth = () => {
  const dispatch = useDispatch();
  const { user, isAuthenticated, isLoading } = useSelector((state: RootState) => state.auth);
  const [otpSent, setOtpSent] = useState(false);
  const [pendingPhone, setPendingPhone] = useState<string | null>(null);
  const [pendingCountryCode, setPendingCountryCode] = useState<string | null>(null);
  const toast = useToast();

  const sendOTP = useCallback(async (phone: string, countryCode: string) => {
    dispatch(setLoading(true));
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        dispatch(setLoading(false));
        setOtpSent(true);
        // remember entered phone/country so verifyOTP can use them
        setPendingPhone(phone);
        setPendingCountryCode(countryCode);
        toast.success('OTP sent', 'A one-time password was sent to your phone.');
        resolve(true);
      }, 2000);
    });
  }, [dispatch, toast]);

  const verifyOTP = useCallback(async (otp: string, phone?: string | null, countryCode?: string | null) => {
    dispatch(setLoading(true));
    // Simulate OTP verification
    return new Promise((resolve) => {
      setTimeout(() => {
        dispatch(setLoading(false));
        if (otp === '123456') { // Mock valid OTP
          const user = {
            id: '1',
            // prefer explicit args (passed from OTPVerification), then pending values from sendOTP, then fallback
            phone: phone || pendingPhone || '1234567890',
            countryCode: countryCode || pendingCountryCode || '+1',
            name: 'User',
          };
          dispatch(setUser(user));
          localStorage.setItem('user', JSON.stringify(user));
          toast.success('Logged in', 'Welcome back!');
          resolve(true);
        } else {
          toast.error('Invalid OTP', 'Please check the code and try again.');
          resolve(false);
        }
      }, 2000);
    });
  }, [dispatch, toast, pendingPhone, pendingCountryCode]);

  const logoutUser = useCallback(() => {
    dispatch(logout());
    localStorage.removeItem('user');
    localStorage.removeItem('chatRooms');
    localStorage.removeItem('messages');
    toast.success('Logged out successfully!');
  }, [dispatch, toast]);
  

  return {
    user,
    isAuthenticated,
    isLoading,
    otpSent,
    sendOTP,
    verifyOTP,
    logout: logoutUser,
  };
};