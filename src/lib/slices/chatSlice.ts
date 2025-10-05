// lib/slices/chatSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ChatState, ChatRoom, Message } from '@/src/types';

const initialState: ChatState = {
  chatRooms: [],
  currentChatRoom: null,
  messages: [],
  isLoading: false,
  hasMore: true,
  currentPage: 1,
  isTyping: false,
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    setChatRooms: (state, action: PayloadAction<ChatRoom[]>) => {
      state.chatRooms = action.payload;
    },
    addChatRoom: (state, action: PayloadAction<ChatRoom>) => {
      state.chatRooms.unshift(action.payload);
    },
    deleteChatRoom: (state, action: PayloadAction<string>) => {
      state.chatRooms = state.chatRooms.filter(room => room.id !== action.payload);
    },
    setCurrentChatRoom: (state, action: PayloadAction<ChatRoom>) => {
      state.currentChatRoom = action.payload;
    },
    setMessages: (state, action: PayloadAction<Message[]>) => {
      state.messages = action.payload;
    },
    addMessage: (state, action: PayloadAction<Message>) => {
      state.messages.push(action.payload);
    },
    addOlderMessages: (state, action: PayloadAction<Message[]>) => {
      state.messages.unshift(...action.payload);
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setHasMore: (state, action: PayloadAction<boolean>) => {
      state.hasMore = action.payload;
    },
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    },
    setIsTyping: (state, action: PayloadAction<boolean>) => {
      state.isTyping = action.payload;
    },
  },
});

export const {
  setChatRooms,
  addChatRoom,
  deleteChatRoom,
  setCurrentChatRoom,
  setMessages,
  addMessage,
  addOlderMessages,
  setLoading,
  setHasMore,
  setCurrentPage,
  setIsTyping,
} = chatSlice.actions;
export default chatSlice.reducer;