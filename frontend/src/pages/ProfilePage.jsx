import  { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Mail, Camera, User } from "lucide-react";


function ProfilePage() {
  const { authUser, updateProfile, isUpdatingProfile } = useAuthStore();
  const [selectedImage, setSelectedImage] = useState(null);

  // Handle image upload
const handleImageUpload = async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = async () => {
    const base64Image = reader.result; // data:image/png;base64,...
    
    // Show preview in UI
    setSelectedImage(base64Image);

    // Upload to backend (Cloudinary)
    await updateProfile({ profileurl: base64Image });
  };

  reader.readAsDataURL(file);
};



  return (
    <div className="min-h-screen pt-20 bg-base-100">
      <div className="max-w-2xl mx-auto p-4 py-8">
        <div className="bg-base-300 rounded-xl p-6 space-y-8 shadow-md">
          {/* Header */}
          <div className="text-center">
            <h1 className="text-2xl font-semibold">Profile</h1>
            <p className="mt-2 text-sm text-zinc-400">Your profile information</p>
          </div>

          {/* Profile Picture */}
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <img
                src={selectedImage || authUser.profileurl || "/avatar.png"}
                alt="Profile"
                className="w-32 h-32 rounded-full object-cover border-4 border-base-200"
              />
              <label
                htmlFor="avatar-upload"
                className={`absolute bottom-0 right-0 p-2 rounded-full cursor-pointer transition-transform duration-200
                  ${isUpdatingProfile ? "opacity-50 pointer-events-none animate-pulse" : "bg-base-content hover:scale-105"}`}
              >
                <Camera className="w-5 h-5 text-base-200" />
                <input
                  type="file"
                  id="avatar-upload"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={isUpdatingProfile}
                />
              </label>
            </div>
            <p className="text-sm text-zinc-400">
              {isUpdatingProfile ? "Uploading..." : "Click the camera icon to update your photo"}
            </p>
          </div>

          {/* User Info */}
          <div className="space-y-6">
            {/* Full Name */}
            <div className="space-y-1.5">
              <div className="text-sm text-zinc-400 flex items-center gap-2">
                <User className="w-4 h-4" /> Full Name
              </div>
              <p className="px-4 py-2.5 bg-base-200 rounded-lg border">{authUser?.fullName}</p>
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <div className="text-sm text-zinc-400 flex items-center gap-2">
                <Mail className="w-4 h-4" /> Email Address
              </div>
              <p className="px-4 py-2.5 bg-base-200 rounded-lg border">{authUser?.email}</p>
            </div>
          </div>

          {/* Account Information */}
          <div className="mt-6 bg-base-300 rounded-xl p-6 shadow-inner">
            <h2 className="text-lg font-medium mb-4">Account Information</h2>
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between py-2 border-b border-zinc-700">
                <span>Member since</span>
                <span>{authUser?.createdAt ? authUser.createdAt.split("T")[0] : "—"}</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span>Account Status</span>
                <span className="text-green-500">Active</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
