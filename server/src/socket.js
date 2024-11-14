// setupSocket.js
const socketIo = require("socket.io");
const Message = require("./models/message.model");
const Channel = require("./models/channel.model");

const setupSocket = (server) => {
  const io = socketIo(server, {
    cors: {
      origin: ["http://localhost:5173", "http://127.0.0.1:5173", "*"],
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  // Initialize a map to store userId to socket.id mappings
  const userSocketMap = new Map();

  const sendMessage = async (message) => {
    console.log("Sending message:", message);
    try {
      const createMessage = await Message.create(message);
      const messageData = await Message.findById(createMessage.id)
        .populate("sender", "id email firstName lastName image color")
        .populate("recipient", "id email firstName lastName image color");

      const recipientSocketId = userSocketMap.get(message.recipient);
      if (recipientSocketId) {
        io.to(recipientSocketId).emit("receiveMessage", messageData);
      }

      const senderSocketId = userSocketMap.get(message.sender);
      if (senderSocketId && senderSocketId !== recipientSocketId) {
        io.to(senderSocketId).emit("receiveMessage", messageData);
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const sendChannelMessage = async (message) => {
    const { sender, content, messageType, fileUrl, channelId } = message;

    //create a new message
    const createdMessage = await Message.create({
      sender,
      recipients: null,
      content,
      messageType,
      fileUrl,
    });

    const messageData = await Message.findById(createdMessage._id)
      .populate("sender", "id email firstName lastName profilePicture")
      .exec();

    //push the message from message array of channels
    await Channel.findByIdAndUpdate(channelId, {
      $push: { messages: createdMessage._id },
    });

    //fetching the channel with all the memebers
    const channel = await Channel.findById(channelId).populate("members");

    const finalData = { ...messageData._doc, channelId: channel._id };

    if (channel && channel.members) {
      channel.members.forEach((member) => {
        const membersSocketId = userSocketMap.get(member._id.toString());

        // If member is online, send them the message
        if (membersSocketId) {
          io.to(membersSocketId).emit("recieve-channel-message", finalData);
        }
      });

      const adminSocketId = userSocketMap.get(channel.admin._id.toString());
      if (adminSocketId) {
        io.to(adminSocketId).emit("recieve-channel-message", finalData);
      }
    }
  };

  const handleData = (data) => {
    console.log(data);
  };

  io.on("connection", (socket) => {
    const userId = socket.handshake.query.userId;
    if (userId) {
      userSocketMap.set(userId, socket.id);
      console.log(`User connected: ${userId} with socket ID: ${socket.id}`);
    } else {
      console.log("User ID not provided during connection");
    }

    // socket.on("sendMessage", sendMessage);
    socket.on("sendMessage", sendMessage);
    socket.on("send-channel-message", sendChannelMessage);

    // socket.on("sendData", handleData);

    socket.on("disconnect", () => {
      console.log(`Client Disconnected: ${socket.id}`);
      for (const [userId, socketId] of userSocketMap.entries()) {
        if (socketId === socket.id) {
          userSocketMap.delete(userId);
          break;
        }
      }
    });
  });
};

module.exports = setupSocket;
