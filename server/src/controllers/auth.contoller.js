const User = require("../models/user.model");
const { ApiError } = require("../utils/ApiError");
const { ApiResponse } = require("../utils/ApiResponse");
const { uploadOnCloudinary } = require("../utils/cloudinary");

const maxAge = 3 * 24 * 60 * 60 * 1000;
exports.signup = async (req, res, next) => {
  console.log("under signup");
  const { email, password } = req.body;
  try {
    const userAlreadyExists = await User.findOne({ email: email });
    if (userAlreadyExists) {
      throw new ApiError(400, "User already exists");
    }
    const newUser = await User.create({ email: email, password: password });
 
    const token = await newUser.generateAccessToken();
      
    res
    .status(200)
    .cookie("accessToken", token, {
      httpOnly: true,
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 1 day
      secure: true,
      sameSite: "None",
    })
    .json(new ApiResponse(200, newUser, "user sigup successfully"));
  } catch (error) {
    next(error);
  }
};

exports.login = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      throw new ApiError(404, "user not found");
    }

    const isMatch = await user.isPasswordCorrect(password);
    if (!isMatch) {
      throw new ApiError(404, "invalid password");
    }

    const token = await user.generateAccessToken();

    res
      .status(200)
      .cookie("accessToken", token, {
        httpOnly: true,
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 1 day
        secure: true,
        sameSite: "None",
      })
      .json(new ApiResponse(200, user, "user signed in successfully"));
  } catch (error) {
    next(error);
  }
};

exports.getUserInfo = async (req, res, next) => {
  const user = req.user;
  try {
    const userInfo = await User.findById(user.id);
    // console.log(req.user);
    if (!user) {
      throw new ApiError(404, "user not found");
    }
    res
      .status(200)
      .json(new ApiResponse(200, userInfo, "get user info successfully"));
  } catch (error) {
    next(error);
  }
};

exports.updateprofile = async (req, res, next) => {
  try {
    const user = req.user;
    const { firstName, lastName, color } = req.body;

    let profilePictureUrl;
    if (req.file) {
      // console.log("req.file",req.file);
      const profilePictureLocalPath = req.file.path;
      const uploadResponse = await uploadOnCloudinary(profilePictureLocalPath,"profile_pictures");
      // console.log("uploadResponse",uploadResponse)
      profilePictureUrl = uploadResponse.secure_url;
      if (!profilePictureUrl) {
        throw new ApiError(
          400,
          "Error uploading profile picture to Cloudinary"
        );
      }
    }

    if (!firstName || !lastName || !color) {
      throw new ApiError(400, "All fields must be required");
    }

    const updatedUser = await User.findByIdAndUpdate(
      user.id,
      {
        firstName,
        lastName,
        color,
        profilePicture: profilePictureUrl,
        profileSetup: true,
      },
      { new: true }
    );

    if (!updatedUser) {
      throw new ApiError(404, "User not found");
    }

    res
      .status(200)
      .json(new ApiResponse(200, updatedUser, "updated successfully"));
  } catch (error) {
    next(error);
  }
};

exports.signOut = async (req, res, next) => {
  try {
    res
      .clearCookie("accessToken")
      .status(200)
      .json(new ApiResponse(200, {}, "User has been signed out"));
  } catch (error) {
    next(error);
  }
};
