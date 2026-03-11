import { create } from 'zustand';
import { axiosInstance } from '../config/axios';
import toast from 'react-hot-toast';
import {io}from "socket.io-client";

const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:5000" : "/";
export const useAuthStore = create((set,get) => ({
    authUser: null,
    isSigningup: false,
    isLogining: false,
    isUpdatingProfile: false,
    onlineUser:[],
    socket:null,

    isCheckingAuth: true,

    checkAuth: async () => {
        set({ isCheckingAuth: true });
        get().connectSocket();
        try {
            const res = await axiosInstance.get("/auth/check");
            set({ authUser: res.data });
        } catch (err) {
            set({ authUser: null });
            console.log("Error in checkAuth:", err);
        } finally {
            set({ isCheckingAuth: false });
        }
    },
    signup: async (data) => {
        set({ isSigningup: true });

        try {
            const res = await axiosInstance.post("/auth/signup", data);
            // Store user in state
            set({ authUser: res.data });
            toast.success("Account created successfully");
            get().connectSocket();
        } catch (err) {
            // Handle if server doesn't send a structured error
            const message =
                err.response?.data?.message || "Signup failed. Please try again.";
            toast.error(message);
        } finally {
            set({ isSigningup: false });
        }
    },
    login: async (data) => {
        set({ isLogining: true })
        try {
            const res = await axiosInstance.post("/auth/login", data);
            set({ authUser: res.data });
            toast.success("Logged in successfully");

            get().connectSocket();
        } catch (err) {
            toast.error(err.response.message || "login failed. Please try again.");
        }
        finally {
            set({ isLogining: false });
        }
    },
    updateProfile: async (data) => {
        set({ isUpdatingProfile: true });
        try {
            const res = await axiosInstance.put("/auth/update-profile", data);
            set({ authUser: res.data });
            toast.success("Profile image updated successfully!");
        } catch (err) {
            console.error("Error in updateProfile:", err);
            const message = err.response?.data?.message || "Something went wrong.";
            toast.error(message);
        } finally {
            set({ isUpdatingProfile: false });
        }
    },
    logout: async () => {
        try {
            await axiosInstance.post("/auth/logout");
            set({ authUser: null });
            toast.success("Logged out successfully");
            get().disconnectSocket();
        } catch (err) {
            const message =
                err.response?.data?.message || "Signup failed. Please try again.";
            toast.error(message);
        }
    },
    connectSocket:()=>{
        const {authUser}=get();
        if(!authUser||get().socket?.connected)return;

        const socket=io(BASE_URL,{
            query:{
                userId:authUser._id,
            }
        });
        socket.connect();


        set({socket:socket});

        socket.on("getOnlineUser",(userId)=>{
            set({onlineUser:userId})
        })
    },
    disconnectSocket:()=>{
        if(get().socket?.connected)get().socket.disconnect();
    },
}))