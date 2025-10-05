'use client';

import { useState, useEffect } from 'react';
import Select from 'react-select';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { phoneSchema } from '@/src/lib/validation';
import { useAuth } from '@/src/hooks/useAuth';
import { Country } from '@/src/types';
import { Loader2 } from 'lucide-react';

type FormData = {
  countryCode: string;
  phoneNumber: string;
};

interface LoginFormProps {
  onPhoneSubmit: (phone: string, countryCode: string) => void;
}

const getCustomStyles = (isDarkMode: boolean) => ({
  control: (provided: any, state: any) => ({
    ...provided,
    minWidth: '120px',
    minHeight: '42px',
    height: '42px',
    borderRadius: '0.5rem',
    borderColor: state.isFocused
      ? '#3b82f6'
      : isDarkMode ? '#4b5563' : '#d1d5db',
    borderWidth: '1px',
    backgroundColor: isDarkMode ? '#374151' : '#ffffff',
    color: isDarkMode ? '#ffffff' : '#111827',
    '&:hover': {
      borderColor: state.isFocused ? '#3b82f6' : isDarkMode ? '#6b7280' : '#9ca3af',
    },
    boxShadow: state.isFocused ? '0 0 0 2px #3b82f6' : 'none',
  }),
  input: (provided: any) => ({
    ...provided,
    color: isDarkMode ? '#ffffff' : '#111827',
    margin: '0',
    padding: '0',
  }),
  singleValue: (provided: any) => ({
    ...provided,
    color: isDarkMode ? '#ffffff' : '#111827',
    fontSize: '0.875rem',
    lineHeight: '1.25rem',
  }),
  placeholder: (provided: any) => ({
    ...provided,
    color: isDarkMode ? '#9ca3af' : '#64748b',
    fontSize: '1rem',
  }),
  menu: (provided: any) => ({
    ...provided,
    borderRadius: '0.5rem',
    zIndex: 50,
    width: '300px',
    backgroundColor: isDarkMode ? '#374151' : '#ffffff',
    border: `1px solid ${isDarkMode ? '#4b5563' : '#e5e7eb'}`,
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    color: isDarkMode ? '#ffffff' : '#111827',
  }),
  menuList: (provided: any) => ({
    ...provided,
    padding: '0',
    borderRadius: '0.5rem',
    scrollbarWidth: 'thin',
    scrollbarColor: '#9ca3af transparent',
    '&::-webkit-scrollbar': {
      width: '6px',
    },
    '&::-webkit-scrollbar-track': {
      background: 'transparent',
      borderRadius: '3px',
    },
    '&::-webkit-scrollbar-thumb': {
      backgroundColor: '#9ca3af',
      borderRadius: '3px',
    },
    '&::-webkit-scrollbar-thumb:hover': {
      backgroundColor: '#6b7280',
    },
    '@media (prefers-color-scheme: dark)': {
      scrollbarColor: '#4b5563 transparent',
      '&::-webkit-scrollbar-thumb': {
        backgroundColor: '#4b5563',
      },
      '&::-webkit-scrollbar-thumb:hover': {
        backgroundColor: '#6b7280',
      },
    },
  }),
  option: (provided: any, state: any) => ({
    ...provided,
    fontSize: '0.875rem',
    backgroundColor: state.isSelected
      ? '#3b82f6'
      : state.isFocused
        ? isDarkMode ? '#4b5563' : '#f3f4f6'
        : 'transparent',
    color: state.isSelected
      ? '#ffffff'
      : isDarkMode ? '#ffffff' : '#111827',
    '&:hover': {
      backgroundColor: state.isSelected
        ? '#3b82f6'
        : isDarkMode ? '#4b5563' : '#f3f4f6',
      color: state.isSelected ? '#ffffff' : isDarkMode ? '#ffffff' : '#111827',
    },
  }),
  dropdownIndicator: (provided: any, state: any) => ({
    ...provided,
    padding: '4px',
    color: isDarkMode ? '#9ca3af' : '#6b7280',
    '&:hover': {
      color: isDarkMode ? '#ffffff' : '#111827',
    },
  }),
  indicatorSeparator: () => ({
    display: 'none',
  }),
  container: (provided: any) => ({
    ...provided,
    width: '100%',
  }),
});

export default function LoginForm({ onPhoneSubmit }: LoginFormProps) {
  const [countries, setCountries] = useState<Country[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const { isLoading, sendOTP } = useAuth();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(phoneSchema),
    defaultValues: {
      countryCode: '',
      phoneNumber: '',
    },
  });

  useEffect(() => {
    const checkDarkMode = () => {
      const isDark = document.documentElement.classList.contains('dark');
      setIsDarkMode(isDark);
    };

    checkDarkMode();

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'class') {
          checkDarkMode();
        }
      });
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await fetch('https://restcountries.com/v3.1/all?fields=name,idd,cca2');
        const data = await response.json();

        const countryList: Country[] = data
          .filter((country: any) => country.idd?.root && country.idd?.suffixes?.[0])
          .map((country: any) => ({
            name: country.name.common,
            dialCode: country.idd.root + country.idd.suffixes[0],
            code: country.cca2,
          }))
          .sort((a: Country, b: Country) => a.name.localeCompare(b.name));

        setCountries(countryList);
      } catch (error) {
        console.error('Error fetching countries:', error);

        const fallbackCountries: Country[] = [
          { name: 'United States', dialCode: '+1', code: '1' },
          { name: 'United Kingdom', dialCode: '+44', code: '44' },
          { name: 'India', dialCode: '+91', code: '91' },
        ];
        setCountries(fallbackCountries);
        setSelectedCountry(fallbackCountries[0]);
        setValue('countryCode', '+1');
      }
    };

    fetchCountries();
  }, [setValue]);

  const onSubmit = async (data: FormData) => {
    const fullPhone = data.countryCode + data.phoneNumber;
    await sendOTP(fullPhone, data.countryCode);
    onPhoneSubmit(fullPhone, data.countryCode);
  };

  const selectCountry = (country: Country) => {
    setSelectedCountry(country);
    setValue('countryCode', country.dialCode);
  };

  const customStyles = getCustomStyles(isDarkMode);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Phone Number
        </label>

        <div className="flex space-x-3">
          {/* Country Code Dropdown */}
          <div className="w-18">
            <Select
              inputId="country-select"
              instanceId="country-select"
              placeholder="Code"
              options={countries.map((c) => ({
                value: c.dialCode,
                label: c.dialCode + " " + c.name,
                data: c
              }))}
              value={selectedCountry ? {
                value: selectedCountry.dialCode,
                label: selectedCountry.dialCode,
                data: selectedCountry
              } : null}
              onChange={(opt: any) => {
                const country: Country = opt?.data;
                if (country) {
                  selectCountry(country);
                }
              }}
              classNamePrefix="react-select"
              styles={customStyles}
              menuPlacement="auto"
              isSearchable={true}
              className="text-sm"
            />
            {errors.countryCode && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {errors.countryCode.message}
              </p>
            )}
          </div>

          {/* Phone Number Input */}
          <div className="flex-1">
            <input
              type="tel"
              {...register('phoneNumber')}
              placeholder="Enter your phone number"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {errors.phoneNumber && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {errors.phoneNumber.message}
              </p>
            )}
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? (
          <Loader2 className="h-5 w-5 animate-spin" />
        ) : (
          'Send OTP'
        )}
      </button>

      <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
        By continuing, you agree to our Terms of Service and Privacy Policy
      </p>
    </form>
  );
}