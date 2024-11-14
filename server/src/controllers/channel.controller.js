const { ApiError } = require("../utils/ApiError");
const { ApiResponse } = require("../utils/ApiResponse");
const User = require("../models/user.model");
const Channel = require("../models/channel.model");
const { default: mongoose } = require("mongoose");

exports.createChannel = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { name, members } = req.body;

    // Check if the admin user exists
    const admin = await User.findById(userId);
    if (!admin) {
      throw new ApiError(404, "Admin not found");
    }

    // Check if all provided members are valid users
    const validMembers = await User.find({ _id: { $in: members } });
    if (validMembers.length !== members.length) {
      throw new ApiError(400, "Some members are not valid users");
    }

    // Create new channel
    const newChannel = new Channel({
      name,
      members,
      admin: userId,
    });

    await newChannel.save();
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { channel: newChannel },
          "New channel created successfully"
        )
      );
  } catch (error) {
    next(error);
  }
};

//get perticular user(channel admin) channel
exports.getUserChannels = async (req, res, next) => {
  try {
    const userId = req.user && req.user._id;

    if (!userId) {
      throw new ApiError(400, "User ID is required");
    }

    const objectId = new mongoose.Types.ObjectId(userId);
    const channels = await Channel.find({
      $or: [{ admin: objectId }, { members: objectId }],
    }).sort({ updatedAt: -1 });

    res
      .status(200)
      .json(
        new ApiResponse(200, { channels }, "User channels fetched successfully")
      );
  } catch (error) {
    next(error);
  }
};
exports.getChannelMessages = async (req, res, next) => {
  try {
    const { channelId } = req.params;

    // Make sure channelId is a string and valid
    if (!channelId || typeof channelId !== 'string') {
      throw new ApiError(400, "Invalid channelId");
    }

    // Fetch the channel using the channelId directly
    const channel = await Channel.findById(channelId).populate({
      path: "messages",
      populate: {
        path: "sender",
        select: "firstName lastName email _id profilePicture color",
      },
    });

    if (!channel) {
      throw new ApiError(404, "Channel not found");
    }

    const messages = channel.messages;

    res.status(200).json(
      new ApiResponse(200, { messages }, "Get channel messages successfully")
    );
  } catch (error) {
    next(error);
  }
};