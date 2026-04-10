import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user-model.js";

// Generate JWT Token
//token add as identifier (reuest k sath token jayega ) (check krega ki kaun user hai )
const generateToken = (userId) => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not configured");
  }

  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: "7d", // 7d means 7 days
  });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public

//!register
export const registerUser = async (req, res) => {
  try {
    //fronted se liye idhr
    const { name, email, password } = req.body;

    //agr koi data mising hoga to 

    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ message: "Please provide all required fields" });
    }

    // user model m find krenge us email ko 
    const userExists = await User.findOne({ email });

    

    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }


//hashedPassword ek baar decrypt kr diye to fir decode ni kr skte
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    //data idhr bej rhe 
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      
    });

     // user ka data bej rhe hai
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      
      token: generateToken(user._id),
    });
// to handle error 

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public

//!login 
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    //validate password same aa raha hash value ya ni

    if (user && (await bcrypt.compare(password, user.password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};