// lib/storage.ts
// Utilities to normalize persisted localStorage data for messages/chatRooms.

export function normalizeStorage() {
  try {
    // Normalize chatRooms
    const chatRoomsRaw = localStorage.getItem('chatRooms');
    if (chatRoomsRaw) {
      const rooms = JSON.parse(chatRoomsRaw);
      if (Array.isArray(rooms)) {
        const normalized = rooms.map((r: any) => ({
          ...r,
          createdAt: typeof r.createdAt === 'string' ? r.createdAt : new Date(r.createdAt).toISOString(),
          updatedAt: typeof r.updatedAt === 'string' ? r.updatedAt : new Date(r.updatedAt).toISOString(),
        }));
        normalized.sort((a: any, b: any) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
        localStorage.setItem('chatRooms', JSON.stringify(normalized));
      }
    }

    // Normalize messages
    const messagesRaw = localStorage.getItem('messages');
    if (messagesRaw) {
      const all = JSON.parse(messagesRaw);
      if (all && typeof all === 'object') {
        Object.keys(all).forEach((roomId) => {
          const arr = all[roomId];
          if (Array.isArray(arr)) {
            const normalized = arr.map((m: any) => ({
              ...m,
              timestamp: typeof m.timestamp === 'string' ? m.timestamp : new Date(m.timestamp).toISOString(),
            }));
            // ensure oldest->newest
            if (normalized.length >= 2) {
              const first = normalized[0].timestamp;
              const last = normalized[normalized.length - 1].timestamp;
              if (new Date(first).getTime() > new Date(last).getTime()) {
                normalized.reverse();
              }
            }
            all[roomId] = normalized;
          }
        });
        localStorage.setItem('messages', JSON.stringify(all));
      }
    }
  } catch (err) {
    // ignore normalization errors
    // eslint-disable-next-line no-console
    console.warn('Storage normalization failed', err);
  }
}

export default normalizeStorage;
