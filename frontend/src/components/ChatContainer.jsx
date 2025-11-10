import React, { useEffect } from 'react';
import { useChatStore } from '../store/useChatStore';
import { useAuthStore } from '../store/useAuthStore';
import ChatHeader from './ChatHeader';
import MessageInput from './MessageInput';
import MessageSkeleton from './skeleton/MessageSkeleton';
import { useRef } from 'react';

const ChatContainer = () => {
  const { messages, getMessages, isMessageLoading, selectedUser,SubscribetoMessge,
    unsubscirbetoMessage
  } = useChatStore();
  const { authUser } = useAuthStore();
  const messageEndRef=useRef(null);

  useEffect(() => {
    if (selectedUser?._id) {
      getMessages(selectedUser._id);
      SubscribetoMessge();
      return()=>unsubscirbetoMessage();
    }
  }, [selectedUser?._id, getMessages,SubscribetoMessge,unsubscirbetoMessage]);
  useEffect(()=>{
    if(messageEndRef.current && messages)
    messageEndRef.current.scrollIntoView({behavior:"smooth"});
  },[messages])


  if (isMessageLoading) {
    return (
      <div className="flex-1 flex flex-col overflow-auto">
        <ChatHeader />
        <MessageSkeleton />
        <MessageInput />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-auto">
      <ChatHeader />

      <div className="flex-1 flex flex-col overflow-auto px-4 space-y-2">
        {Array.isArray(messages) && messages.length > 0 ? (
          messages.map((message) => (
            <div className={`chat ${String(message.senderId) === String(authUser._id) ? "chat-end" : "chat-start"}`}
            ref={messageEndRef}>
              <div className="chat-image avatar">
                <div className="size-10 rounded-full border overflow-hidden">
                  <img
                    src={
                      message.senderId === authUser._id
                        ? authUser.profileurl || "/avatar.png"
                        : selectedUser.profileurl || "/avatar.png"
                    }
                    alt="profile-pic"
                  />
                </div>
              </div>

              <div className="chat-header mb-1">
                <time className="text-xs opacity-50 ml-1">
                  {new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </time>
              </div>

              <div className="chat-bubble bg-base-200">
                {message.text}
                {message.image && (
                  <img
                    src={message.image}
                    alt="sent"
                    className="mt-2 w-48 h-48 object-cover rounded-md"
                  />
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center text-gray-400 mt-4">
            {selectedUser ? "No messages yet. Start the conversation!" : "Select a user to chat"}
          </div>
        )}
      </div>

      <MessageInput />
    </div>
  );
};

export default ChatContainer;
