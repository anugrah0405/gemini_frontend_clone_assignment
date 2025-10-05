// components/layout/Sidebar.tsx
'use client';

import { useState } from 'react';
import { useChat } from '@/src/hooks/useChat';
import ChatRoomList from '@/src/components/dashboard/ChatRoomList';
import CreateChatRoom from '@/src/components/dashboard/CreateChatRoom';
import SearchBar from '@/src/components/dashboard/SearchBar';
import { Plus, MessageSquare, Menu, X } from 'lucide-react';

export default function Sidebar() {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const { createChatRoom } = useChat();

  const handleCreateChatRoom = (title: string) => {
    createChatRoom(title);
    setShowCreateForm(false);
    setIsMobileOpen(false); // Close sidebar on mobile after creation
  };

  const handleCancelCreate = () => {
    setShowCreateForm(false);
  };

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setIsMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-40 p-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg"
      >
        <Menu className="h-5 w-5 text-gray-600 dark:text-gray-400" />
      </button>



      {/* Overlay */}
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

              {/* Desktop Create Button */}
              <button
                onClick={() => setShowCreateForm(true)}
                className="hidden lg:flex p-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white transition-colors"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Create Chat Room Form - Inside Sidebar */}
          {showCreateForm && (
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <CreateChatRoom
                onSubmit={handleCreateChatRoom}
                onCancel={handleCancelCreate}
              />
            </div>
          )}

          {/* Chat Room List */}
          <div className="flex-1 overflow-hidden">
            <ChatRoomList onRoomSelect={() => setIsMobileOpen(false)} />
          </div>

          {/* Mobile Create Button - Only show when sidebar is closed on mobile */}
          <button
            onClick={() => setShowCreateForm(true)}
            className="lg:hidden absolute top-4 right-14 z-40 p-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white shadow-lg transition-colors"
          >
            <Plus className="h-4 w-4" />
          </button>

          {/* Close button for mobile */}
          <button
            onClick={() => setIsMobileOpen(false)}
            className="lg:hidden absolute top-4 right-4 p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            <X className="h-4 w-4 text-gray-600 dark:text-gray-400" />
          </button>
        </div>
      </div>

      {/* Mobile Create Form Modal - Shows when form is open but sidebar is closed */}
      {showCreateForm && !isMobileOpen && (
        <>
          {/* Overlay */}
          <div
            className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-50"
            onClick={handleCancelCreate}
          />

          {/* Modal */}
          <div className="lg:hidden fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 w-11/12 max-w-md">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Create New Chat Room
                </h3>
                <button
                  onClick={handleCancelCreate}
                  className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <X className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                </button>
              </div>
              <CreateChatRoom
                onSubmit={handleCreateChatRoom}
                onCancel={handleCancelCreate}
              />
            </div>
          </div>
        </>
      )}
    </>
  );
}