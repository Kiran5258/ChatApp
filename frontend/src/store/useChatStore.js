import { create } from 'zustand';
import toast from 'react-hot-toast';
import { axiosInstance } from '../config/axios';
import { useAuthStore } from './useAuthStore';

export const useChatStore = create((set, get) => ({
    messages: [],
    users: [],
    selectedUser: null,
    isUserLoading: false,
    isMessageLoading: false,

    // Fetch all users for sidebar
    getUser: async () => {
        set({ isUserLoading: true });
        try {
            const res = await axiosInstance.get("/messages/users");
            set({ users: res.data });
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to fetch users");
        } finally {
            set({ isUserLoading: false });
        }
    },

    // Fetch messages with selected user
    getMessages: async (userId) => {
        set({ isMessageLoading: true });
        try {
            const res = await axiosInstance.get(`/messages/${userId}`);
            // Backend returns { success: true, messages: [...] }
            set({ messages: res.data.messages || [] });
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to fetch messages");
        } finally {
            set({ isMessageLoading: false });
        }
    },

    // Send a new message
    sendMessage: async (messagedata) => {
        const { selectedUser, messages } = get();
        if (!selectedUser) return;

        const currentMessages = Array.isArray(messages) ? messages : [];

        try {
            const res = await axiosInstance.post(
                `/messages/send/${selectedUser._id}`,
                messagedata
            );

            // Extract the actual message object from response
            const newMsg = res.data.message;

            set({ messages: [...currentMessages, newMsg] });
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to send message");
        }
    },

    SubscribetoMessge:()=>{
        const {selectedUser}=get();
        if(!selectedUser)return;
        const socket=useAuthStore.getState().socket;
        socket.on("newMessage",(newMessage)=>{
            set({
                messages:[...get().messages,newMessage],
            })
        });
    },
    unsubscirbetoMessage:()=>{
        const socket=useAuthStore.getState().socket;
        socket.off("newMessage");
    },

    setSelectedUser: (user) => set({ selectedUser: user }),
}));