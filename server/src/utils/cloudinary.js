const cloudinary = require("../config/cloudinary");
const fs = require("fs");

const uploadOnCloudinary = async (localFilePath,folder) => {
  try {
    if (!localFilePath) {
      res.status(404).json({ message: "local file not found" });
    }
    if(!folder){
      res.status(404).json({ message: "plaese provide folder name"});
    }

    // console.log("cloudinary middleware in localFilePath:", localFilePath);
    if (!localFilePath) return null;
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
      folder:folder
      // folder: 'profile_pictures',
      // folder:'uploadedFile'
    });

    // console.log("file is uploaded on cloudinary ", response.url);
    // Remove the locally saved temporary file after upload
    fs.unlinkSync(localFilePath);

    return response;
  } catch (error) {
    console.error("Error uploading file to Cloudinary:", error.message);
    if (fs.existsSync(localFilePath)) {
      fs.unlinkSync(localFilePath);
    }

    return null;
  }
};

module.exports = { uploadOnCloudinary };
