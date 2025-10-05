import { useState, useCallback, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/src/lib/store';
import {
    setChatRooms,
    addChatRoom,
    deleteChatRoom,
    setCurrentChatRoom as setCurrentChatRoomAction,
    setMessages,
    addMessage,
    addOlderMessages,
    setLoading,
    setHasMore,
    setCurrentPage,
    setIsTyping,
} from '@/src/lib/slices/chatSlice';
import { ChatRoom, Message } from '@/src/types';
import { useToast } from '@/src/hooks/useToast';

export const useChat = () => {
    const dispatch = useDispatch();
    const {
        chatRooms,
        currentChatRoom,
        messages,
        isLoading,
        hasMore,
        currentPage,
        isTyping,
    } = useSelector((state: RootState) => state.chat);

    const throttleRef = useRef<NodeJS.Timeout>(undefined);
    const toast = useToast();

    const loadChatRooms = useCallback(() => {
        const saved = localStorage.getItem('chatRooms');
        if (saved) {
            // Keep timestamps as ISO strings for serializability in Redux state
            const rooms: ChatRoom[] = JSON.parse(saved).map((room: any) => ({
                ...room,
                createdAt: typeof room.createdAt === 'string' ? room.createdAt : new Date(room.createdAt).toISOString(),
                updatedAt: typeof room.updatedAt === 'string' ? room.updatedAt : new Date(room.updatedAt).toISOString(),
            }));
            rooms.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
            dispatch(setChatRooms(rooms));
        }
    }, [dispatch]);

    const createChatRoom = useCallback((title: string) => {
        const nowIso = new Date().toISOString();
        const newRoom: ChatRoom = {
            id: Date.now().toString(),
            title,
            createdAt: nowIso,
            updatedAt: nowIso,
            messageCount: 0,
        };

        dispatch(addChatRoom(newRoom));

        const updatedRooms = [newRoom, ...chatRooms];
        localStorage.setItem('chatRooms', JSON.stringify(updatedRooms));
        toast.success('Chat room created', `"${title}" was created.`);

        return newRoom;
    }, [dispatch, chatRooms, toast]);

    const removeChatRoom = useCallback((id: string) => {
        dispatch(deleteChatRoom(id));
        const updatedRooms = chatRooms.filter(room => room.id !== id);
        localStorage.setItem('chatRooms', JSON.stringify(updatedRooms));

        const allMessages = JSON.parse(localStorage.getItem('messages') || '{}');
        delete allMessages[id];
        localStorage.setItem('messages', JSON.stringify(allMessages));
    }, [dispatch, chatRooms, toast]);

    const loadMessages = useCallback((chatRoomId: string, page = 1) => {
        dispatch(setLoading(true));

        setTimeout(() => {
            const allMessages = JSON.parse(localStorage.getItem('messages') || '{}');
            const roomMessages: Message[] = allMessages[chatRoomId] || [];
            if (roomMessages.length >= 2) {
                const firstTs = roomMessages[0].timestamp;
                const lastTs = roomMessages[roomMessages.length - 1].timestamp;
                if (new Date(firstTs).getTime() > new Date(lastTs).getTime()) {
                    roomMessages.reverse();
                }
            }

            const startIndex = Math.max(0, roomMessages.length - page * 20);
            const endIndex = roomMessages.length - (page - 1) * 20;
            const pageMessages = roomMessages.slice(startIndex, endIndex).map(msg => ({
                ...msg,
                timestamp: typeof msg.timestamp === 'string' ? msg.timestamp : new Date(msg.timestamp).toISOString(),
            }));

            if (page === 1) {
                dispatch(setMessages(pageMessages));
            } else {
                dispatch(addOlderMessages(pageMessages));
            }

            dispatch(setHasMore(startIndex > 0));
            dispatch(setCurrentPage(page));
            dispatch(setLoading(false));
        }, 500);
    }, [dispatch]);

    const sendMessage = useCallback((content: string, imageUrl?: string) => {
        if (!currentChatRoom) return;

        const nowIso = new Date().toISOString();
        const userMessage: Message = {
            id: Date.now().toString(),
            chatRoomId: currentChatRoom.id,
            content,
            type: 'user',
            timestamp: nowIso,
            imageUrl,
        };

        dispatch(addMessage(userMessage));

        // Save to localStorage
        const allMessages = JSON.parse(localStorage.getItem('messages') || '{}');
        const roomMessages = allMessages[currentChatRoom.id] || [];
        allMessages[currentChatRoom.id] = [...roomMessages, userMessage];
        localStorage.setItem('messages', JSON.stringify(allMessages));

        // Update chat room
        const updatedRooms = chatRooms.map(room =>
            room.id === currentChatRoom.id
                ? { ...room, updatedAt: new Date().toISOString(), messageCount: room.messageCount + 1 }
                : room
        );
        dispatch(setChatRooms(updatedRooms));
        localStorage.setItem('chatRooms', JSON.stringify(updatedRooms));

        // Simulate AI response with throttling
        if (throttleRef.current) {
            clearTimeout(throttleRef.current);
        }

        dispatch(setIsTyping(true));

        throttleRef.current = setTimeout(() => {
            const aiMessage: Message = {
                id: (Date.now() + 1).toString(),
                chatRoomId: currentChatRoom.id,
                content: `This is a simulated AI response. In a real application, this would be generated by an AI model.`,
                type: 'ai',
                timestamp: new Date().toISOString(),
            };

            dispatch(addMessage(aiMessage));
            dispatch(setIsTyping(false));

            const updatedAllMessages = JSON.parse(localStorage.getItem('messages') || '{}');
            const updatedRoomMessages = updatedAllMessages[currentChatRoom.id] || [];
            updatedAllMessages[currentChatRoom.id] = [...updatedRoomMessages, aiMessage];
            localStorage.setItem('messages', JSON.stringify(updatedAllMessages));

            // Update chat room again
            const finalUpdatedRooms = updatedRooms.map(room =>
                room.id === currentChatRoom.id
                    ? { ...room, updatedAt: new Date().toISOString(), messageCount: room.messageCount + 2 }
                    : room
            );
            dispatch(setChatRooms(finalUpdatedRooms));
            localStorage.setItem('chatRooms', JSON.stringify(finalUpdatedRooms));
        }, 2000 + Math.random() * 1000);
    }, [dispatch, currentChatRoom, chatRooms]);

    // Wrapper to dispatch setting the current chat room
    const setCurrentChatRoom = useCallback((room: ChatRoom) => {
        dispatch(setCurrentChatRoomAction(room));
    }, [dispatch]);

    return {
        chatRooms,
        currentChatRoom,
        messages,
        isLoading,
        hasMore,
        isTyping,
        loadChatRooms,
        createChatRoom,
        removeChatRoom,
        setCurrentChatRoom,
        loadMessages,
        sendMessage,
    };
};