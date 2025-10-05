// components/chat/Message.tsx
'use client';

import { useState } from 'react';
import { Message as MessageType } from '@/src/types';
import { format } from 'date-fns';
import { Bot, User, Copy, Check, Image } from 'lucide-react';
import { useToast } from '@/src/hooks/useToast';

interface MessageProps {
  message: MessageType;
}

export default function Message({ message }: MessageProps) {
  const [isCopied, setIsCopied] = useState(false);
  const { toast } = useToast();
  const isAI = message.type === 'ai';

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.content);
      setIsCopied(true);
      toast({
        title: 'Copied to clipboard',
        type: 'success',
      });
      
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      toast({
        title: 'Failed to copy',
        type: 'error',
      });
    }
  };

  return (
    <div
      className={`
        group flex space-x-4
        ${isAI ? 'flex-row' : 'flex-row-reverse space-x-reverse'}
      `}
    >
      {/* Avatar */}
      <div
        className={`
          flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center
          ${
            isAI
              ? 'bg-gradient-to-r from-blue-500 to-purple-600'
              : 'bg-gradient-to-r from-green-500 to-blue-500'
          }
        `}
      >
        {isAI ? (
          <Bot className="h-4 w-4 text-white" />
        ) : (
          <User className="h-4 w-4 text-white" />
        )}
      </div>

      {/* Message Content */}
      <div
        className={`
          flex-1 max-w-3xl
          ${isAI ? 'text-left' : 'text-right'}
        `}
      >
        <div
          className={`
            inline-block px-4 py-3 rounded-2xl
            ${
              isAI
                ? 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white'
                : 'bg-blue-500 text-white'
            }
          `}
        >
          {/* Image Preview */}
          {message.imageUrl && (
            <div className="mb-3">
              <div className="relative group/image">
                <img
                  src={message.imageUrl}
                  alt="Uploaded"
                  className="max-w-sm rounded-lg border border-gray-200 dark:border-gray-700"
                />
                <div className="absolute top-2 left-2 flex items-center space-x-1 px-2 py-1 bg-black/50 rounded text-white text-xs">
                  <Image className="h-3 w-3" />
                  <span>Image</span>
                </div>
              </div>
            </div>
          )}

          {/* Message Text */}
          <p className="whitespace-pre-wrap">{message.content}</p>
        </div>

        {/* Timestamp and Actions */}
        <div
          className={`
            flex items-center space-x-2 mt-2
            ${isAI ? 'justify-start' : 'justify-end'}
          `}
        >
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {format(new Date(message.timestamp), 'h:mm a')}
          </span>
          
          <button
            onClick={handleCopy}
            className={`
              opacity-0 group-hover:opacity-100 p-1 rounded transition-all
              ${
                isAI
                  ? 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
                  : 'hover:bg-blue-400 text-blue-100 hover:text-white'
              }
            `}
          >
            {isCopied ? (
              <Check className="h-3 w-3" />
            ) : (
              <Copy className="h-3 w-3" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}