// components/chat/MessageInput.tsx
'use client';

import { useState, useRef, ChangeEvent } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { messageSchema } from '@/src/lib/validation';
import { useChat } from '@/src/hooks/useChat';
import { useToast } from '@/src/hooks/useToast';
import { Send, Image, X } from 'lucide-react';

type FormData = {
  content: string;
};

export default function MessageInput() {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { sendMessage } = useChat();
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(messageSchema),
    defaultValues: {
      content: '',
    },
  });

  const content = watch('content');

  const handleImageUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: 'Invalid file type',
        description: 'Please upload an image file.',
        type: 'error',
      });
      return;
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: 'File too large',
        description: 'Please upload an image smaller than 5MB.',
        type: 'error',
      });
      return;
    }

    setIsUploading(true);

    // Create preview URL
    const previewUrl = URL.createObjectURL(file);
    setImagePreview(previewUrl);

    setIsUploading(false);
    toast({
      title: 'Image uploaded',
      description: 'Image ready to send with your message.',
      type: 'success',
    });
  };

  const removeImage = () => {
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const onSubmit = async (data: FormData) => {
    if (!data.content.trim() && !imagePreview) return;

    try {
      await sendMessage(data.content, imagePreview || undefined);
      reset();
      removeImage();
    } catch (error) {
      toast({
        title: 'Failed to send message',
        type: 'error',
      });
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSubmit(onSubmit)();
    }
  };

  return (
    <div className="space-y-3">
      {/* Image Preview */}
      {imagePreview && (
        <div className="relative inline-block">
          <div className="relative group">
            <img
              src={imagePreview}
              alt="Preview"
              className="h-20 rounded-lg border border-gray-200 dark:border-gray-700"
            />
            <button
              onClick={removeImage}
              className="absolute -top-2 -right-2 p-1 bg-red-500 hover:bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        </div>
      )}

      {/* Input Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="relative">
        <div className="flex space-x-3">
          {/* Image Upload Button */}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="flex-shrink-0 p-3 max-h-12 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 transition-colors"
          >
            <Image className="h-5 w-5" />
          </button>

          {/* Hidden File Input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />

          {/* Text Input */}
          <div className="flex-1 relative">
            <textarea
              {...register('content')}
              placeholder="Type your message..."
              onKeyPress={handleKeyPress}
              rows={1}
              className="w-full px-4 py-3 pr-12 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none max-h-32 scrollbar-thin"
              style={{
                minHeight: '48px',
                height: 'auto',
              }}
              onInput={(e) => {
                const target = e.target as HTMLTextAreaElement;
                target.style.height = 'auto';
                target.style.height = target.scrollHeight + 'px';
              }}
            />
          </div>

          {/* Send Button */}
          <button
            type="submit"
            disabled={isSubmitting || (!content.trim() && !imagePreview)}
            className="flex-shrink-0 p-3 max-h-12 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 dark:disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
          >
            <Send className="h-5 w-5" />
          </button>
        </div>

        {errors.content && (
          <p className="mt-1 ml-14 text-sm text-red-600 dark:text-red-400">
            {errors.content.message}
          </p>
        )}
      </form>
    </div>
  );
}