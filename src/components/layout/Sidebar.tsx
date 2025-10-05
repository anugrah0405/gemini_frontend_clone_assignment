'use client';

import { useState } from 'react';
import { useChat } from '@/src/hooks/useChat';
import ChatRoomList from '@/src/components/dashboard/ChatRoomList';
import CreateChatRoom from '@/src/components/dashboard/CreateChatRoom';
import { Plus, MessageSquare, Menu, X } from 'lucide-react';

export default function Sidebar() {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const { createChatRoom } = useChat();

  const handleCreateChatRoom = (title: string) => {
    createChatRoom(title);
    setShowCreateForm(false);
  };

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setIsMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-40 p-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
      >
        <Menu className="h-5 w-5 text-gray-600 dark:text-gray-400" />
      </button>

      {isMobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed lg:static inset-y-0 left-0 z-40
        w-80 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700
        transform transition-transform duration-300 ease-in-out
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <MessageSquare className="h-5 w-5 text-blue-500" />
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Chat Rooms
                </h2>
              </div>
              
              <button
                onClick={() => setShowCreateForm(true)}
                className="p-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white transition-colors"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Create Chat Room Form */}
          {showCreateForm && (
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <CreateChatRoom
                onSubmit={handleCreateChatRoom}
                onCancel={() => setShowCreateForm(false)}
              />
            </div>
          )}

          {/* Chat Room List */}
          <div className="flex-1 overflow-hidden">
            <ChatRoomList onRoomSelect={() => setIsMobileOpen(false)} />
          </div>

          {/* Close button for mobile */}
          <button
            onClick={() => setIsMobileOpen(false)}
            className="lg:hidden absolute top-4 right-4 p-2 rounded-lg bg-gray-100 dark:bg-gray-700"
          >
            <X className="h-4 w-4 text-gray-600 dark:text-gray-400" />
          </button>
        </div>
      </div>
    </>
  );
}