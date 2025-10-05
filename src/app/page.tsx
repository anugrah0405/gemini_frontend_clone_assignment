// app/page.tsx
'use client';

import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { RootState } from '@/src/lib/store';
import Header from '@/src/components/layout/Header';
import Sidebar from '@/src/components/layout/Sidebar';
import ChatRoomList from '@/src/components/dashboard/ChatRoomList';
import { useChat } from '@/src/hooks/useChat';

export default function Dashboard() {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const { loadChatRooms } = useChat();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    
    // Check for stored user data
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      router.push('/login');
      return;
    }

    loadChatRooms();
  }, [isAuthenticated, router, loadChatRooms]);

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="h-screen flex flex-col bg-white dark:bg-gray-900">
      <Header />
      
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        
        <main className="flex-1 overflow-hidden">
          <div className="h-full flex flex-col">
            <div className="flex-1 overflow-hidden p-6">
              <div className="max-w-4xl mx-auto h-full">
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 h-full flex flex-col">
                  <div className="flex-1 overflow-hidden flex flex-col">
                    {/* Welcome Section */}
                    <div className="flex-1 flex items-center justify-center p-8">
                      <div className="text-center">
                        <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                          <span className="text-2xl text-white font-bold">G</span>
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                          Welcome to Gemini Clone
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400 max-w-md">
                          Start a new conversation or select an existing chat room to continue your discussion with AI.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}