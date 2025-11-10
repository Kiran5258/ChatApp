import Message from "../model/message.model.js";
import User from "../model/user.model.js";
import cloudinary from "../config/cloudinary.js";
import { getReceiverSocketId, io } from "../config/socket.js";

export const getUserForSidebar = async (req, res) => {
  try {
    const loggedInuserId = req.user._id;
    const filteruser = await User.find({ _id: { $ne: loggedInuserId } }).select("-password");
    res.status(200).json(filteruser);
  } catch (err) {
    console.log("Error in getUserForSidebar:", err.message);
    res.status(500).json({ message: "Server is error" });
  }
};

export const getMessage = async (req, res) => {
  try {
    const { id: userTocharId } = req.params;
    const myid = req.user._id;

    const message = await Message.find({
      $or: [
        { senderId: myid, receiverId: userTocharId },
        { senderId: userTocharId, receiverId: myid },
      ],
    }); 

    res.status(200).json({ success: true, messages: message });
  } catch (err) {
    console.log("Error in getMessage controller:", err.message);
    res.status(500).json({ message: "Server is Error" });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { text, image } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user._id;

    let imageUrl = null;

    if (image) {
      const uploadResponse = await cloudinary.uploader.upload(image, { folder: "chat_images" });
      imageUrl = uploadResponse.secure_url;
    }

    const newMessage = new Message({ senderId, receiverId, text, image: imageUrl });
    await newMessage.save();

    const receiverSokcetId=getReceiverSocketId(receiverId);
    if(receiverSokcetId){
      io.to(receiverSokcetId).emit("newMessage",newMessage);
    }

    res.status(200).json({ success: true, message: newMessage });
  } catch (err) {
    console.error("Error in sendMessage:", err.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
