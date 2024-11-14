const { ApiError } = require("../utils/ApiError");
const { ApiResponse } = require("../utils/ApiResponse");
const Message = require("../models/message.model");
const { uploadOnCloudinary } = require("../utils/cloudinary");

exports.getMessages = async (req, res, next) => {
  try {
    console.log("under message controller..");
    const user1 = req.user._id;
    console.log("req.body.id", req.body.id);
    const { id } = req.body;
    console.log("id:", id);

    const user2 = req.body.id;

    if (!user1 || !user2) {
      throw new ApiError(400, "Both user IDs are required");
    }

    const messages = await Message.find({
      $or: [
        { sender: user1, recipient: user2 },
        { sender: user2, recipient: user1 },
      ],
    }).sort({ createdAt: 1 });

    res
      .status(200)
      .json(
        new ApiResponse(200, { messages }, "Messages retrieved successfully")
      );
  } catch (error) {
    next(error);
  }
};



const checkIfImage = (fileUrl) => {
  const imageRegex = /\.(jpg|jpeg|png|bmp|tiff|tif|webp|svg|ico|heic|heif)$/i;
  return imageRegex.test(fileUrl);
};

const checkIfZip = (fileUrl) => {
  const zipRegex = /\.(zip)$/i;
  return zipRegex.test(fileUrl);
};

exports.uploadFile = async (req, res, next) => {
  try {
    if (!req.file) {
      throw new ApiError(400, "File is required");
    }

    const fileLocalPath = req.file.path;
    const uploadResponse = await uploadOnCloudinary(fileLocalPath,"uploadedFile");
    console.log("uploadResponse", uploadResponse);

    const fileUrl = uploadResponse.secure_url;
    if (!fileUrl) {
      throw new ApiError(400, "Error uploading file to Cloudinary");
    }

    // Check if the uploaded file is an image or ZIP file
    const isImage = checkIfImage(fileUrl);
    const isZip = checkIfZip(fileUrl);

    if (!isImage && !isZip) {
      throw new ApiError(400, "Uploaded file is neither an image nor a ZIP file");
    }

    res.status(200).json(new ApiResponse(200, { fileUrl }, "Uploaded file"));
  } catch (error) {
    next(error);
  }
};