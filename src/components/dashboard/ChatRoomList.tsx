// components/dashboard/ChatRoomList.tsx
'use client';

import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/src/lib/store';
import { useChat } from '@/src/hooks/useChat';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { MessageSquare, Trash2, Clock } from 'lucide-react';
import { useToast } from '@/src/hooks/useToast';
import SearchBar from './SearchBar';
import { useDebounce } from '@/src/hooks/useDebounce';
import ConfirmModal from '@/src/components/ui/ConfirmModal';

interface ChatRoomListProps {
  onRoomSelect?: () => void;
  // optional external search term controlled by parent (e.g., Sidebar)
  externalSearch?: string;
}

export default function ChatRoomList({ onRoomSelect, externalSearch }: ChatRoomListProps) {
  const { chatRooms, currentChatRoom } = useSelector((state: RootState) => state.chat);
  const { removeChatRoom, setCurrentChatRoom } = useChat();
  const [filteredRooms, setFilteredRooms] = useState(chatRooms);
  const [searchTerm, setSearchTerm] = useState('');
  // if parent provides an external search term, prefer that
  const effectiveSearch = externalSearch !== undefined ? externalSearch : searchTerm;
  const debouncedSearchTerm = useDebounce(effectiveSearch, 250);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    const term = debouncedSearchTerm.toLowerCase();
    setFilteredRooms(
      chatRooms.filter(room => room.title.toLowerCase().includes(term))
    );
  }, [chatRooms, debouncedSearchTerm]);

  const handleRoomSelect = (room: any) => {
    setCurrentChatRoom(room);
    router.push(`/chat/${room.id}`);
    onRoomSelect?.();
  };

  const handleDeleteRoom = async (roomId: string, roomTitle: string) => {
    // open modal instead of confirm; store selected room in state
    setModalState({ open: true, roomId, roomTitle });
  };

  // Modal state
  const [modalState, setModalState] = useState<{ open: boolean; roomId?: string; roomTitle?: string }>({ open: false });

  const handleModalConfirm = () => {
    const { roomId, roomTitle } = modalState;
    if (!roomId) return;
    removeChatRoom(roomId);
    toast({ title: 'Chat room deleted', description: `"${roomTitle}" has been deleted.`, type: 'success' });
    if (currentChatRoom?.id === roomId) router.push('/');
    setModalState({ open: false });
  };

  const handleModalCancel = () => setModalState({ open: false });

  if (chatRooms.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-center">
        <MessageSquare className="h-12 w-12 text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
          No chat rooms yet
        </h3>
        <p className="text-gray-500 dark:text-gray-400">
          Create your first chat room to start a conversation with AI.
        </p>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto scrollbar-thin">
      <div className="p-4">
        <SearchBar value={searchTerm} onChange={setSearchTerm} />
      </div>

      <div className="p-2">
        {filteredRooms.map((room) => (
          <div
            key={room.id}
            tabIndex={0}
            role="button"
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleRoomSelect(room);
              }
            }}
            className={`
              group relative p-3 rounded-lg cursor-pointer transition-colors mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500
              ${currentChatRoom?.id === room.id
                ? 'bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800'
                : 'hover:bg-gray-50 dark:hover:bg-gray-700/50 border border-transparent'
              }
            `}
            onClick={() => handleRoomSelect(room)}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-medium text-gray-900 dark:text-white truncate">
                  {room.title}
                </h3>
                <div className="flex items-center space-x-1 mt-1">
                  <Clock className="h-3 w-3 text-gray-400" />
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {format(new Date(room.updatedAt), 'MMM d, yyyy')}
                  </span>
                </div>
                <div className="flex items-center space-x-2 mt-1">
                  <MessageSquare className="h-3 w-3 text-gray-400" />
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {room.messageCount} messages
                  </span>
                </div>
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteRoom(room.id, room.title);
                }}
                className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-red-100 dark:hover:bg-red-900/20 transition-all"
              >
                <Trash2 className="h-4 w-4 text-red-500" />
              </button>
            </div>
          </div>
        ))}

        {filteredRooms.length === 0 && searchTerm && (
          <div className="text-center py-8">
            <p className="text-gray-500 dark:text-gray-400">
              No chat rooms found matching "{searchTerm}"
            </p>
          </div>
        )}
      </div>
      {/* Confirm deletion modal */}
      <ConfirmModal
        open={modalState.open}
        title={`Delete "${modalState.roomTitle || ''}"?`}
        description="This action cannot be undone. Are you sure you want to delete this chat room?"
        confirmLabel="Delete"
        cancelLabel="Cancel"
        onConfirm={handleModalConfirm}
        onCancel={handleModalCancel}
      />
    </div>
  );
}