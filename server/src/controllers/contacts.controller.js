const { ApiError } = require("../utils/ApiError");
const { ApiResponse } = require("../utils/ApiResponse");
const mongoose = require("mongoose");
const User = require("../models/user.model");
const Message = require("../models/message.model");

exports.searchContacts = async (req, res, next) => {
  try {
    const user = req.user;

    if (!user) {
      throw new ApiError(401, "Unauthorized");
    }

    const { searchTerm } = req.body;

    if (searchTerm === undefined || searchTerm === null) {
      throw new ApiError(400, "searchTerm is required");
    }

    //remove the escape special characters for the search term
    const sanitizedSearchTerm = searchTerm.replace(
      /[.*+?^${}()|[\]\\]/g,
      "\\$&"
    );
    const regex = new RegExp(sanitizedSearchTerm, "i");

    const contacts = await User.find({
      _id: { $ne: user._id },
      $or: [{ firstName: regex }, { lastName: regex }, { email: regex }],
    });

    res
      .status(200)
      .json(
        new ApiResponse(200, { contacts }, "Successfully retrieved contacts")
      );
  } catch (error) {
    next(error);
  }
};

// We need to contact the user whose current session is under "loginUser" as the sender, and this user is the recipient. We need to format the data for the recipient for message collection, with my name (login user) as the sender.
exports.getContactsForDMList = async (req, res, next) => {
  try {
    let userId = req.user._id;
    userId = new mongoose.Types.ObjectId(userId);

    const contacts = await Message.aggregate([
      {
        $match: {
          $or: [{ sender: userId }, { recipient: userId }],
        },
      },
      {
        $sort: { createdAt: -1 },
      },
      {
        $group: {
          _id: {
            $cond: {
              if: { $eq: ["$sender", userId] },
              then: "$recipient",
              else: "$sender",
            },
          },
          lastMessageTime: { $first: "$createdAt" },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "contactInfo",
        },
      },
      //Deconstructs
      {
        $unwind: "$contactInfo",
      },
      {
        $project: {
          _id: 1,
          lastMessageTime: 1,
          email: "$contactInfo.email",
          firstName: "$contactInfo.firstName",
          lastName: "$contactInfo.lastName",
          profilePicture: "$contactInfo.profilePicture",
          color: "$contactInfo.color",
        },
      },
      {
        $sort: { lastMessageTime: -1 },
      },
    ]);
    res
      .status(200)
      .json(new ApiResponse(200, { contacts }, "contact get successfully"));
  } catch (error) {
    next(error);
  }
};


exports.getAllContacts = async (req, res, next) => {
  try {
    const users = await User.find(
      { _id: { $ne: req.user._id } },
      "firstName lastName email _id"
    );

    const contacts = users.map((user) => ({
      label: user.firstName ? `${user.firstName} ${user.lastName}` : user.email,
      value: user._id
    }));

    res.status(200).json(new ApiResponse(200, { contacts }, "Contact fetched successfully"));
  } catch (error) {
    next(error);
  }
};
