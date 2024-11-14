import axios from "axios";

export const createChannel = async (name, members) => {
  console.log("name members", name, members);
  try {
    const response = await axios.post(
      "/server/channel/create-channel",
      { name, members },
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
        : error.response.data.message;

    throw new Error(
      errorMessage || "Create Channel failed. Please try again later."
    );
  }
};

export const getUserChannels = async () => {
  try {
    const response = await axios.get("/server/channel/get-user-channels");

    return response.data;
  } catch (error) {
    const errorMessage =
      error.response &&
      error.response.data &&
      error.response.data.errors &&
      error.response.data.errors.length > 0
        ? error.response.data.errors.join(", ")
        : error.response.data.message;

    throw new Error(
      errorMessage || "Get User Channel failed. Please try again later."
    );
  }
};

export const getChannelMessages = async (channelId) => {
  try {
    const response = await axios.get(`
/server/channel/get-channel-messages/${channelId}`);
    return response.data;
  } catch (error) {
    const errorMessage =
      error.response &&
      error.response.data &&
      error.response.data.errors &&
      error.response.data.errors.length > 0
        ? error.response.data.errors.join(", ")
        : error.response.data.message;

    throw new Error(
      errorMessage || "Get Channel Messages failed. Please try again later."
    );
  }
};
