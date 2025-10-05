// types/index.ts
export interface User {
  id: string;
  phone: string;
  countryCode: string;
  name?: string;
}

export interface Country {
  name: string;
  dialCode: string;
  code: string;
}

export interface ChatRoom {
  id: string;
  title: string;
  // timestamps are stored as ISO strings in Redux/localStorage for serializability
  createdAt: string;
  updatedAt: string;
  messageCount: number;
}

export interface Message {
  id: string;
  chatRoomId: string;
  content: string;
  type: 'user' | 'ai';
  // timestamp is stored as ISO string for serializability
  timestamp: string;
  imageUrl?: string;
  isTyping?: boolean;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface ChatState {
  chatRooms: ChatRoom[];
  currentChatRoom: ChatRoom | null;
  messages: Message[];
  isLoading: boolean;
  hasMore: boolean;
  currentPage: number;
  isTyping: boolean;
}