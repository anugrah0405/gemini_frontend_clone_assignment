'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { useChat } from '@/src/hooks/useChat';
import Message from '@/src/components/chat/Message';
import MessageInput from '@/src/components/chat/MessageInput';
import TypingIndicator from '@/src/components/chat/TypingIndicator';
import { ArrowDown, Bot, User } from 'lucide-react';

export default function ChatRoom() {
  const { currentChatRoom, messages, isLoading, hasMore, isTyping } = useChat();
  const { loadMessages } = useChat();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [isAtBottom, setIsAtBottom] = useState(true);

  useEffect(() => {
    if (isAtBottom && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping, isAtBottom]);

  const handleScroll = useCallback(() => {
    if (!messagesContainerRef.current) return;

    const { scrollTop, scrollHeight, clientHeight } = messagesContainerRef.current;
    
    const atBottom = scrollHeight - scrollTop - clientHeight < 100;
    setIsAtBottom(atBottom);
    
    setShowScrollButton(!atBottom);

    if (scrollTop < 100 && hasMore && !isLoading) {
      loadMessages(currentChatRoom!.id, 2);
    }
  }, [currentChatRoom, hasMore, isLoading, loadMessages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    setIsAtBottom(true);
    setShowScrollButton(false);
  };

  if (!currentChatRoom) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <Bot className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No chat room selected
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            Please select a chat room from the sidebar to start chatting.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Chat Header */}
      <div className="border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-6 py-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
            <Bot className="h-5 w-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              {currentChatRoom.title}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              AI Assistant
            </p>
          </div>
        </div>
      </div>

      {/* Messages Container */}
      <div
        ref={messagesContainerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-900/50 scrollbar-thin"
        role="log"
        aria-live="polite"
        aria-atomic="false"
      >
        <div className="max-w-4xl mx-auto p-6">
          {/* Welcome Message */}
          {messages.length === 0 && !isTyping && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Bot className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Welcome to {currentChatRoom.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
                Start a conversation with the AI assistant. Ask questions, get help with tasks, or just chat!
              </p>
            </div>
          )}

          {/* Messages */}
          <div className="space-y-6">
            {messages.map((message, index) => (
              <Message key={message.id} message={message} />
            ))}
            
            {/* Typing Indicator */}
            {isTyping && <TypingIndicator />}
          </div>

          {/* Scroll anchor */}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Scroll to bottom button */}
      {showScrollButton && (
        <button
          onClick={scrollToBottom}
          className="absolute bottom-24 self-center p-3 bg-blue-500 hover:bg-blue-600 text-white rounded-full shadow-lg transition-all hover:scale-105"
        >
          <ArrowDown className="h-5 w-5" />
        </button>
      )}

      {/* Message Input */}
      <div className="border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6">
        <div className="max-w-4xl mx-auto">
          <MessageInput />
        </div>
      </div>
    </div>
  );
}