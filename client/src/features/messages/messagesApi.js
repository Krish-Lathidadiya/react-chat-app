import axios from "axios";
import { setFileUploadProgress } from "@/features/chat/chatSlice/";

export const uploadFile = async (formData, dispatch) => {
  try {
    const response = await axios.post(
      "/server/messages/upload-file",
      formData,
      {
        onUploadProgress: (progress) => {
          dispatch(
            setFileUploadProgress(
              Math.round((100 * progress.loaded) / progress.total)
            )
          );
        },
      }
    );

    dispatch(setFileUploadProgress(0));
    return response.data;
  } catch (error) {
    const errorMessage =
      error.response &&
      error.response.data &&
      error.response.data.errors &&
      error.response.data.errors.length > 0
        ? error.response.data.errors.join(", ")
        : error.response.data.message ||
          "upload file failed. Please try again later.";

    throw new Error(errorMessage);
  }
};


export const getMessages = async (id) => {
  console.log("id", id);
  try {
    const response = await axios.post(
      "/server/messages/get-messages",
      { id },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    return response.data;
  } catch (error) {
    const errorMessage =
      error.response &&
      error.response.data &&
      error.response.data.errors &&
      error.response.data.errors.length > 0
        ? error.response.data.errors.join(", ")
        : error.response.data.message ||
          "Get Messages failed. Please try again later.";

    throw new Error(errorMessage);
  }
};
