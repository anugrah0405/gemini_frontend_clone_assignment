'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { RootState } from '@/src/lib/store';
import Header from '@/src/components/layout/Header';
import Sidebar from '@/src/components/layout/Sidebar';
import ChatRoom from '@/src/components/chat/ChatRoom';
import { useChat } from '@/src/hooks/useChat';
import LoadingSkeleton from '@/src/components/ui/LoadingSkeleton';

export default function ChatRoomPage() {
  const params = useParams();
  const router = useRouter();
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const { chatRooms, loadMessages, setCurrentChatRoom } = useChat();
  const [isLoading, setIsLoading] = useState(true);

  const chatRoomId = params.id as string;
  const currentChatRoom = chatRooms.find(room => room.id === chatRoomId);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    if (!currentChatRoom) {
      router.push('/');
      return;
    }

    setCurrentChatRoom(currentChatRoom);
    loadMessages(chatRoomId);

    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [isAuthenticated, router, currentChatRoom, chatRoomId, setCurrentChatRoom, loadMessages]);

  if (!isAuthenticated || !currentChatRoom) {
    return null;
  }

  return (
    <div className="h-screen flex flex-col bg-white dark:bg-gray-900">
      <Header />
      
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        
        <main className="flex-1 overflow-hidden">
          {isLoading ? (
            <div className="h-full flex items-center justify-center">
              <LoadingSkeleton />
            </div>
          ) : (
            <ChatRoom />
          )}
        </main>
      </div>
    </div>
  );
}