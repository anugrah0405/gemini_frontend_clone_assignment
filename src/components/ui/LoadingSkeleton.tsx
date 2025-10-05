'use client';

export default function LoadingSkeleton() {
  const items = Array.from({ length: 6 });

  return (
    <div className="w-[80%] mx-auto p-6 space-y-4">
      {items.map((_, i) => {
        const isUser = i % 2 === 1;
        return (
          <div
            key={i}
            className={`flex items-start ${isUser ? 'justify-end' : 'justify-start'}`}
          >
            {!isUser && (
              <div className="flex-shrink-0 mr-3">
                <div className="w-9 h-9 rounded-full bg-gray-300 dark:bg-gray-700 animate-pulse" />
              </div>
            )}

            <div className={`w-[75%] ${isUser ? 'text-right' : 'text-left'}`}>
              <div
                className={`w-full inline-block rounded-2xl p-3 animate-pulse
                  ${isUser ? 'bg-blue-100 dark:bg-blue-800' : 'bg-gray-100 dark:bg-gray-700'}`}
              >
                <div className="space-y-2">
                  <div className={`h-3 rounded bg-gray-300 dark:bg-gray-600 ${isUser ? 'w-3/4 ml-auto' : 'w-5/6'}`} />
                  <div className={`h-3 rounded bg-gray-300 dark:bg-gray-600 ${isUser ? 'w-1/2 ml-auto' : 'w-3/4'}`} />
                  {i % 3 === 0 && (
                    <div className={`h-3 rounded bg-gray-300 dark:bg-gray-600 ${isUser ? 'w-2/5 ml-auto' : 'w-2/3'}`} />
                  )}
                </div>
              </div>
            </div>

            {isUser && (
              <div className="flex-shrink-0 ml-3">
                <div className="w-9 h-9 rounded-full bg-gray-300 dark:bg-gray-700 animate-pulse" />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}