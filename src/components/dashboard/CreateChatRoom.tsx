'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { chatRoomSchema } from '@/src/lib/validation';
import { Plus, X } from 'lucide-react';

type FormData = {
  title: string;
};

interface CreateChatRoomProps {
  onSubmit: (title: string) => void;
  onCancel: () => void;
}

export default function CreateChatRoom({ onSubmit, onCancel }: CreateChatRoomProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(chatRoomSchema),
  });

  const handleFormSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    await onSubmit(data.title);
    setIsSubmitting(false);
    reset();
  };

  const handleCancel = () => {
    reset();
    onCancel();
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-3">
      <div>
        <input
          type="text"
          placeholder="Enter chat room title..."
          {...register('title')}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          autoFocus
        />
        {errors.title && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">
            {errors.title.message}
          </p>
        )}
      </div>

      <div className="flex space-x-2">
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 flex items-center justify-center space-x-2 py-2 px-3 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white rounded-lg text-sm font-medium transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>Create</span>
        </button>
        
        <button
          type="button"
          onClick={handleCancel}
          className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </form>
  );
}