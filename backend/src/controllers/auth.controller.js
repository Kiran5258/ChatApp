import cloudinary from "../config/cloudinary.js";
import { generateToken } from "../config/util.js";
import User from "../model/user.model.js"
import bcrypt from "bcryptjs";

export const signup = async (req, res) => {
    const { fullName, email, password } = req.body;

    try {
        if (!fullName || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }
        if (password.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters long" });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email is already registered" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            fullName,
            email,
            password: hashPassword,
        });

        await newUser.save();

        generateToken(newUser._id, res); // sets cookie

        res.status(201).json({
            _id: newUser._id,
            fullName: newUser.fullName,
            email: newUser.email,
            profileurl: newUser.profileurl,
        });
    } catch (err) {
        console.log("Error in signup controller:", err.message);
        res.status(500).json({ message: "Server error" });
    }
};

export const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const isPassword = await bcrypt.compare(password, user.password);
        if (!isPassword) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        generateToken(user._id, res);

        res.status(200).json({
            _id: user._id,
            fullName: user.fullName,
            email: user.email,
            profileurl: user.profileurl,
        });
    } catch (err) {
        console.error("Error in login controller:", err.message);
        res.status(500).json({ message: "Server Error" });
    }
};

export const logout = (req, res) => {
    try{
        res.cookie("jwt","",{maxAge:0});
        res.status(200).json({message:"Logged out Successfully"});
    }catch(err){
        console.log("Error is logout controller",err.message);
        res.status(200).json({message:"Server Error"})
    }
}

export const updateProfile = async (req, res) => {
  try {
    const { profileurl } = req.body;
    const userId = req.user._id;

    if (!profileurl) {
      return res.status(400).json({ message: "Profile pic is required" });
    }
    const uploadResponse = await cloudinary.uploader.upload(profileurl, {
      folder: "profile_pics",
      resource_type: "image",
      overwrite: true,
    });
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { profileurl: uploadResponse.secure_url },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error("Error uploading to Cloudinary:", error.message);
    res.status(500).json({ message: "Failed to upload image" });
  }
};


export const checkAuth=(req,res)=>{
    try{
        res.status(200).json(req.user);
    }catch(err){
        console.log("Error is CheckAuth controller",err.message);
        res.status(500).json({message:"Server Error"});
    }
}