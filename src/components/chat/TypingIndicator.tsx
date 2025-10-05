// components/chat/TypingIndicator.tsx
'use client';

import { Bot } from 'lucide-react';

export default function TypingIndicator() {
  return (
    <div className="flex space-x-4">
      {/* Avatar */}
      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
        <Bot className="h-4 w-4 text-white" />
      </div>

      {/* Typing Indicator */}
      <div className="flex-1">
        <div className="inline-block px-4 py-3 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
          <div className="flex space-x-1">
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            </div>
          </div>
        </div>
        
        <div className="mt-2">
          <span className="text-xs text-gray-500 dark:text-gray-400">
            Gemini is typing...
          </span>
        </div>
      </div>
    </div>
  );
}