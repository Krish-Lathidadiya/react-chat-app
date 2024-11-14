import { createContext, useContext, useEffect, useRef } from "react";
import io from "socket.io-client";
import { HOST } from "@/utils/constants";
import { selectUser } from "@/features/auth/authSlice";
import { useSelector, useDispatch } from "react-redux";
import {
  selectChatType,
  selectChatData,
  addMessage,
  addChannelInChannelList,
  addContactsInDMContacts,
} from "@/features/chat/chatSlice";
export const SocketContext = createContext(null);

export const SocketContextProvider = ({ children }) => {
  const socket = useRef(null);
  const userInfo = useSelector(selectUser);
  const selectedChatData = useSelector(selectChatData);
  const selectedChatType = useSelector(selectChatType);
  const dispatch = useDispatch();

  useEffect(() => {
    // Initialize socket connection
    if (userInfo) {
      socket.current = io(HOST, {
        // transports: ["websocket"],
        withCredentials: true,
        query: {
          userId: userInfo._id,
        },
      });
      socket.current.on("connect", () => {
        console.log("Socket connected:", socket.current.id);
      });

      //testing socket connection
      // socket.current.emit("sendData", {
      //   data: "ok done everything"
      // });

      // Handle receiving messages
      const handleReceiveMessage = (message) => {
        if (
          selectedChatType !== null &&
          (selectedChatData._id === message.sender._id ||
            selectedChatData._id === message.recipient._id)
        ) {
          console.log("message received:", message);
          dispatch(addMessage(message));
        }
        dispatch(addContactsInDMContacts({ message, userInfo }));

      };

      const handleRecieveChannelMessage = (message) => {
        console.log("channel received message:",message);
        if (
          selectedChatType !== null &&
          selectedChatData._id === message.channelId
        ) {
          dispatch(addMessage(message));
        }
        dispatch(addChannelInChannelList(message))
      };
      socket.current.on("receiveMessage", handleReceiveMessage);
      socket.current.on("recieve-channel-message", handleRecieveChannelMessage);

      socket.current.on("connect_error", (error) => {
        console.error("Socket connection error:", error);
      });

      socket.current.on("disconnect", () => {
        console.log("Socket disconnected");
      });

      // Cleanup on unmount
      return () => {
        if (socket.current) {
          socket.current.disconnect();
        }
      };
    }
  }, [userInfo, selectedChatData, selectedChatType, dispatch]);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};

const useSocketContext = () => {
  const context = useContext(SocketContext);
  if (context === null) {
    throw new Error(
      "useSocketContext must be used within a SocketContextProvider"
    );
  }
  return context;
};

export default useSocketContext;
