import { X } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";

const ChatHeader = () => {
  const { selectedUser, setSelectedUser } = useChatStore();
  const { onlineUser } = useAuthStore();

  if (!selectedUser) return null; // Guard if no user selected

  return (
    <div className="p-2.5 border-b border-base-300">
      <div className="flex items-center justify-between">
        {/* Avatar + User Info */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full overflow-hidden relative">
            <img
              src={selectedUser.profileurl || "/avatar.png"}
              alt={selectedUser.fullName}
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <h3 className="font-medium">{selectedUser.fullName}</h3>
            <p className="text-sm text-base-content/70">
              {onlineUser && onlineUser.includes(selectedUser._id) ? "Online" : "Offline"}
            </p>
          </div>
        </div>

        {/* Close Button */}
        <button
          onClick={() => setSelectedUser(null)}
          className="p-1 rounded hover:bg-base-200 transition-colors"
        >
          <X size={18} />
        </button>
      </div>
    </div>
  );
};

export default ChatHeader;
