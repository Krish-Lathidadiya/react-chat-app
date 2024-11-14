import React, { useEffect, useRef, useState } from "react";
import { GrAttachment } from "react-icons/gr";
import { RiEmojiStickerLine } from "react-icons/ri";
import { IoSend } from "react-icons/io5";
import EmojiPicker from "emoji-picker-react";
import { useSelector, useDispatch } from "react-redux";
import { selectChatType, selectChatData, setIsUploading } from "@/features/chat/chatSlice";
import { selectUser } from "@/features/auth/authSlice";
import { uploadFile } from "@/features/messages/messagesApi"; // Adjust the path as necessary
import useSocketContext from "@/context/SocketContext";
import { toast } from "sonner";

function MessageBar() {
  const dispatch = useDispatch();
  const fileInputRef = useRef();
  const emojiRef = useRef();
  const socket = useSocketContext();
  const selectedChatType = useSelector(selectChatType);
  const selectedChatData = useSelector(selectChatData);
  const userInfo = useSelector(selectUser);
  const [message, setMessage] = useState("");
  const [emojiPickerOpen, setEmojiPickerOpen] = useState(false);

  const handleAddEmoji = (emoji) => {
    setMessage((msg) => msg + emoji.emoji);
  };

  const handleSendMessage = () => {
    if (!message.trim()) return;

    const payload = {
      sender: userInfo._id,
      content: message,
      messageType: "text",
      fileUrl: null,
    };

    if (selectedChatType === "contact") {
      payload.recipient = selectedChatData._id;
      socket.current.emit("sendMessage", payload);
    } else if (selectedChatType === "channel") {
      payload.channelId = selectedChatData._id;
      socket.current.emit("send-channel-message", payload);
    }

    setMessage("");
  };

  const handleAttachmentClick = () => {
    fileInputRef.current?.click();
  };

  const handleAttachmentChange = async (e) => {
    try {
      const file = e.target.files[0];
      if (file) {
        const formData = new FormData();
        formData.append("file", file);
        dispatch(setIsUploading(true));
        const response = await uploadFile(formData, dispatch);

        if (response.statusCode === 200) {
          dispatch(setIsUploading(false));
          const payload = {
            sender: userInfo._id,
            content: null,
            messageType: "file",
            fileUrl: response.data.fileUrl,
          };

          if (selectedChatType === "contact") {
            payload.recipient = selectedChatData._id;
            socket.current.emit("sendMessage", payload);
          } else if (selectedChatType === "channel") {
            payload.channelId = selectedChatData._id;
            socket.current.emit("send-channel-message", payload);
          }
        }
      }
    } catch (error) {
      dispatch(setIsUploading(false));
      toast.error(error.message || "File upload failed");
    }
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (emojiRef.current && !emojiRef.current.contains(e.target)) {
        setEmojiPickerOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="h-[10vh] bg-[#1c1d25] flex justify-center items-center px-8 mb-6 gap-6">
      <div className="flex-1 flex bg-[#2a2b33] rounded-md items-center gap-5 pr-5">
        <input
          type="text"
          className="flex-1 p-5 bg-transparent rounded-md focus:border-none focus:outline-none"
          placeholder="Enter Message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button
          className="text-neutral-500 focus:border-none focus:outline-none focus:text-white duration-300 transition-all"
          onClick={handleAttachmentClick}
        >
          <GrAttachment className="text-2xl" />
        </button>
        <input
          type="file"
          className="hidden"
          ref={fileInputRef}
          onChange={handleAttachmentChange}
        />
        <div className="relative">
          <button
            className="text-neutral-500 focus:border-none focus:outline-none focus:text-white duration-300 transition-all"
            onClick={() => setEmojiPickerOpen(!emojiPickerOpen)}
          >
            <RiEmojiStickerLine className="text-2xl" />
          </button>
          {emojiPickerOpen && (
            <div className="absolute bottom-16 right-0" ref={emojiRef}>
              <EmojiPicker
                theme="dark"
                onEmojiClick={handleAddEmoji}
                autoFocusSearch={false}
              />
            </div>
          )}
        </div>
      </div>
      <button
        className="bg-[#8417ff] rounded-md flex items-center justify-center p-5 focus:border-none focus:outline-none hover:bg-[#741bda] text-white duration-300 transition-all"
        onClick={handleSendMessage}
      >
        <IoSend className="text-2xl" />
      </button>
    </div>
  );
}

export default MessageBar;
