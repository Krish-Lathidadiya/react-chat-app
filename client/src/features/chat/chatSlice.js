import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  chatType: null,
  chatData: null,
  chatMessages: [],
  channels: [],
  directMessagesContacts: [],
  isUploading: false,
  isDownloading: false,
  fileUploadProgress: 0,
  fileDownloadProgress: 0,
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setChatType: (state, action) => {
      state.chatType = action.payload;
    },
    setChatData: (state, action) => {
      state.chatData = action.payload;
    },
    addChatMessage: (state, action) => {
      const newMessages = action.payload;
      const existingMessageIds = new Set(
        state.chatMessages.map((msg) => msg._id)
      );

      newMessages.forEach((msg) => {
        if (!existingMessageIds.has(msg._id)) {
          state.chatMessages.push(msg);
        }
      });
    },
    closeChat: (state) => {
      state.chatType = null;
      state.chatData = null;
      state.chatMessages = [];
    },
    addMessage: (state, action) => {
      const message = action.payload;
      const normalizedMessage = {
        ...message,
        recipient:
          state.chatType === "channel"
            ? message.recipient
            : message.recipient._id,
        sender:
          state.chatType === "channel" ? message.sender : message.sender._id,
      };

      const exists = state.chatMessages.some(
        (msg) => msg._id === normalizedMessage._id
      );
      if (!exists) {
        state.chatMessages.push(normalizedMessage);
      }
    },
    setDirectMessagesContacts: (state, action) => {
      state.directMessagesContacts = action.payload;
    },
    setIsUploading: (state, action) => {
      state.isUploading = action.payload;
    },
    setIsDownloading: (state, action) => {
      state.isDownloading = action.payload;
    },
    setFileUploadProgress: (state, action) => {
      state.fileUploadProgress = action.payload;
    },
    setFileDownloadProgress: (state, action) => {
      state.fileDownloadProgress = action.payload;
    },
    setChannels: (state, action) => {
      state.channels = action.payload;
    },
    addChannel: (state, action) => {
      state.channels.push(action.payload);
    },
    // if anyone can send a message to the channel then we find the index of this channel and put it top
    addChannelInChannelList: (state, action) => {
      const channels = state.channels;
      const message = action.payload;

      // Find the channel to be updated
      const data = channels.find(
        (channel) => channel._id === message.channelId
      );

      // Log channels, data, and index for debugging
      console.log("Channels before update:", channels);
      console.log("Data to be moved:", data);

      if (data) {
        // Find the index of the channel to be removed
        const index = channels.findIndex(
          (channel) => channel._id === message.channelId
        );

        console.log("Index of the channel to be moved:", index);

        if (index !== -1) {
          // Remove the channel from the array
          channels.splice(index, 1);

          // Add the channel to the beginning of the array
          channels.unshift(data);

          // Log channels after update for debugging
          console.log("Channels after update:", channels);
        } else {
          console.error("Channel index not found."); // Handle case where index is not found
        }
      } else {
        console.error("Channel data not found."); // Handle case where channel data is not found
      }
    },
    addContactsInDMContacts: (state, action) => {
      const { userInfo, message } = action.payload;
      const userId = userInfo._id;

      // Determine the ID of the contact who is not the current user
      const fromId =
        message.sender._id === userId
          ? message.recipient._id // If the sender is the current user, use the recipient's ID
          : message.sender._id; // Otherwise, use the sender's ID

      // Determine the contact data based on who is sending or receiving the message
      const fromData =
        message.sender._id === userId ? message.recipient : message.sender;

      const dmContacts = state.directMessagesContacts;

      // Find the contact with the same ID as `fromId` in the direct messages contacts
      const data = dmContacts.find((contact) => contact._id === fromId);

      // Find the index of the contact with the same ID as `fromId` in the direct messages contacts
      const index = dmContacts.findIndex((contact) => contact._id === fromId);

      console.log({ data, index, dmContacts, userId, message, fromData });

      if (index !== -1) {
        console.log("in if condition");

        // Remove the contact from its current position in the array
        dmContacts.splice(index, 1);

        // Add the contact to the beginning of the array
        dmContacts.unshift(data);
      } else {
        console.log("in else condition");

        // If the contact doesn't exist in the list, add it to the beginning of the array
        dmContacts.unshift(fromData);
      }
      state.directMessagesContacts = dmContacts;
    },
  },
});

export const {
  addMessage,
  setChatType,
  setChatData,
  addChatMessage,
  closeChat,
  setDirectMessagesContacts,
  setIsUploading,
  setIsDownloading,
  setFileUploadProgress,
  setFileDownloadProgress,
  setChannels,
  addChannel,
  addChannelInChannelList,
  addContactsInDMContacts,
} = chatSlice.actions;
export default chatSlice.reducer;
export const selectChatType = (state) => state.chat.chatType;
export const selectChatData = (state) => state.chat.chatData;
export const selectChatMessages = (state) => state.chat.chatMessages;
export const selectDirectMessagesContacts = (state) =>
  state.chat.directMessagesContacts;
export const selectIsUploading = (state) => state.chat.isUploading;
export const selectIsDownloading = (state) => state.chat.isDownloading;
export const selectFileUploadProgress = (state) =>
  state.chat.fileUploadProgress;
export const selectFileDownloadProgress = (state) =>
  state.chat.fileDownloadProgress;
export const selectChannels = (state) => state.chat.channels;
