import React, { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { selectUser } from "@/features/auth/authSlice";
import {
  selectChatType,
  selectChatData,
  selectChatMessages,
} from "@/features/chat/chatSlice";
import {
  addChatMessage,
  setIsDownloading,
  setFileDownloadProgress,
} from "@/features/chat/chatSlice";
import { getMessagesAsync } from "@/features/messages/messagesSlice";
import { getChannelMessagesAsync } from "@/features/channels/channelSlice";
import moment from "moment";
import { toast } from "sonner";
import axios from "axios";
import { MdFolderZip, MdFileDownload } from "react-icons/md";
import { IoCloseSharp } from "react-icons/io5";
import { Avatar, AvatarImage } from "@radix-ui/react-avatar";
import { getColor } from "@/lib/utils";
import { AvatarFallback } from "@/components/ui/avatar";

function MessageContainer() {
  const dispatch = useDispatch();
  const scrollRef = useRef(null);
  const selectedChatData = useSelector(selectChatData);
  const userInfo = useSelector(selectUser);
  const selectedChatType = useSelector(selectChatType);
  const selectedChatMessages = useSelector(selectChatMessages);
  const [showImage, setShowImage] = useState(false);
  const [imageURL, setImageURl] = useState(null);
  const [contactMessageLoading, setContactMessageLoading] = useState(false);
  const [channelMessageLoading, setChannelMessageLoading] = useState(false);

  useEffect(() => {
    const getMessages = async () => {
      try {
        setContactMessageLoading(true);
        const response = await dispatch(
          getMessagesAsync({ id: selectedChatData._id })
        ).unwrap();

        if (response.statusCode === 200) {
          dispatch(addChatMessage(response.data.messages));
        }
        setContactMessageLoading(false);
      } catch (error) {
        toast.error(error.message || "Failed to fetch messages");
      }
    };

    const getChannelMessages = async () => {
      try {
        // const channelId=selectedChatData._id;
        setChannelMessageLoading(true);
        const response = await dispatch(
          getChannelMessagesAsync({ channelId: selectedChatData._id })
        ).unwrap();

        if (response.statusCode === 200) {
          dispatch(addChatMessage(response.data.messages));
        }
        setChannelMessageLoading(false);
      } catch (error) {
        toast.error(error.message || "Failed to fetch messages");
      }
    };
    if (selectedChatData?._id) {
      if (selectedChatType === "contact") getMessages();
      else if (selectedChatType === "channel") getChannelMessages();
    }
  }, [selectedChatData, selectedChatType, dispatch]);

  useEffect(() => {
    scrollToBottom();
  }, [selectedChatMessages]);

  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const isImage = (url) =>
    /\.(jpg|jpeg|png|bmp|tiff|tif|webp|svg|ico|heic|heif)$/i.test(url);
  const isZip = (url) => /\.(zip)$/i.test(url);

  const downloadFile = async (url) => {
    try {
      dispatch(setIsDownloading(true));
      dispatch(setFileDownloadProgress(0));

      const response = await axios.get(url, {
        responseType: "blob",
        onDownloadProgress: (progress) => {
          const { loaded, total } = progress;
          const percentCompleted = Math.round((loaded * 100) / total);
          dispatch(setFileDownloadProgress(percentCompleted));
        },
      });

      if (response.status !== 200) {
        throw new Error("Failed to download file");
      }

      const urlBlob = window.URL.createObjectURL(new Blob([response.data]));

      const link = document.createElement("a");
      link.href = urlBlob;
      link.setAttribute("download", url.split("/").pop());
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(urlBlob);
      dispatch(setIsDownloading(false));
      dispatch(setFileDownloadProgress(0));
    } catch (error) {
      toast.error(error.message || "Failed to download file");
    }
  };

  const renderMessages = () => {
    let lastDate = null;

    return selectedChatMessages?.map((message, index) => {
      const messageDate = moment(message?.createdAt).format("YYYY-MM-DD");
      const showDate = messageDate !== lastDate;
      lastDate = messageDate;

      return (
        <div key={index}>
          {showDate && <div>{moment(message?.createdAt).format("LL")}</div>}
          {selectedChatType === "contact" && renderDMMessages(message)}
          {selectedChatType === "channel" && renderChannelDMMessages(message)}
        </div>
      );
    });
  };

  const renderDMMessages = (message) => {
    return (
      <div
        className={`${
          message?.sender === selectedChatData?._id ? "text-left" : "text-right"
        }`}
      >
        {message?.messageType === "text" && (
          <div
            className={`${
              message?.sender !== selectedChatData?._id
                ? "bg-[#8417ff]/5 text-[#8417ff]/90 border-[#8417ff]/50 "
                : "bg-[#2a2b33]/5 text-white/80  border-[#ffffff]/20 "
            }border inline-block p-4 rounded my-1 max-w-[50%] break-words`}
          >
            {message?.content}
          </div>
        )}
        {message?.messageType === "file" && (
          <div
            className={`${
              message?.sender !== selectedChatData?._id
                ? "bg-[#8417ff]/5 text-[#8417ff]/90 border-[#8417ff]/50 "
                : "bg-[#2a2b33]/5 text-white/80  border-[#ffffff]/20 "
            }border inline-block p-4 rounded my-1 max-w-[50%] break-words`}
          >
            {isImage(message.fileUrl) && (
              <div
                onClick={() => {
                  setShowImage(true);
                  setImageURl(message.fileUrl);
                }}
                className="cursor-pointer"
              >
                <img
                  src={message.fileUrl}
                  alt="Uploaded file"
                  width={300}
                  height={300}
                />
              </div>
            )}

            {/* TODO:check zip file download */}

            {isZip(message.fileUrl) && (
              <div className="flex flex-col gap-2">
                <div className="text-xl">
                  <MdFolderZip />
                </div>
                <div>{message.fileUrl.split("/").pop()}</div>

                <div className="flex justify-end items-center  my-1">
                  <button
                    className="bg-black/20 p-3 text-lg rounded-full hover:bg-black/50 cursor-pointer transition-all duration-300"
                    onClick={() => downloadFile(imageURL)}
                  >
                    <MdFileDownload />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
        <div className="text-sm text-gray-600">
          {moment(message?.createdAt).format("LT")}
        </div>
      </div>
    );
  };

  const renderChannelDMMessages = (message) => {
    return (
      <div
        className={`mt-5 ${
          message.sender._id !== userInfo._id ? "text-left" : "text-right"
        }`}
      >
        {message?.messageType === "text" && (
          <div
            className={`${
              message?.sender._id === userInfo?._id
                ? "bg-[#8417ff]/5 text-[#8417ff]/90 border-[#8417ff]/50 "
                : "bg-[#2a2b33]/5 text-white/80  border-[#ffffff]/20 "
            }border inline-block p-4 rounded my-1 max-w-[50%] break-words ml-9`}
          >
            {message?.content}
          </div>
        )}
        {message?.messageType === "file" && (
          <div
            className={`${
              message?.sender._id !== userInfo?._id
                ? "bg-[#8417ff]/5 text-[#8417ff]/90 border-[#8417ff]/50 "
                : "bg-[#2a2b33]/5 text-white/80  border-[#ffffff]/20 "
            }border inline-block p-4 rounded my-1 max-w-[50%] break-words`}
          >
            {isImage(message.fileUrl) && (
              <div
                onClick={() => {
                  setShowImage(true);
                  setImageURl(message.fileUrl);
                }}
                className="cursor-pointer"
              >
                <img
                  src={message.fileUrl}
                  alt="Uploaded file"
                  width={300}
                  height={300}
                />
              </div>
            )}

            {/* TODO:check zip file download */}

            {isZip(message.fileUrl) && (
              <div className="flex flex-col gap-2">
                <div className="text-xl">
                  <MdFolderZip />
                </div>
                <div>{message.fileUrl.split("/").pop()}</div>

                <div className="flex justify-end items-center  my-1">
                  <button
                    className="bg-black/20 p-3 text-lg rounded-full hover:bg-black/50 cursor-pointer transition-all duration-300"
                    onClick={() => downloadFile(imageURL)}
                  >
                    <MdFileDownload />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
        {/* dispaly sender message image */}
        {message.sender._id !== userInfo?._id ? (
          <div className="flex items-center justify-start gap-3">
            <div>
              <Avatar className="h-8 w-8 rounded-full overflow-hidden">
                {message?.sender.profilePicture && (
                  <AvatarImage
                    src={message?.sender.profilePicture}
                    className="object-cover w-full h-full bg-black"
                  />
                )}
                <AvatarFallback
                  className={`uppercase w-8 h-8 text-lg  flex items-center justify-center rounded-full ${getColor(
                    message.sender.color
                  )}`}
                >
                  {message?.sender?.firstName
                    ? message.sender.firstName.charAt(0)
                    : message?.sender?.email
                    ? message.sender.email.charAt(0)
                    : "?"}
                </AvatarFallback>
              </Avatar>

              <span className="text-sm text-white/60 ">
                {`${message.sender.firstName} ${message.sender.lastName}`}
              </span>
              <span className="text-xs text-white/60 mt-1 ml-2">
                {moment(message?.createdAt).format("LT")}
              </span>
            </div>
          </div>
        ) : (
          <div className="text-xs text-white/60 mt-1">
            {moment(message?.createdAt).format("LT")}
          </div>
        )}
      </div>
    );
  };
  return (
    <div className="flex-1 overflow-y-auto scrollbar-hidden p-4 px-8 md:w-[65vw] lg:w-[70vw] xl:w-[80vw] w-full">
      {contactMessageLoading || channelMessageLoading ? (
        <div>Loading...</div>
      ) : (
        renderMessages()
      )}
      <div ref={scrollRef} />
      {showImage && (
        <div className="fixed z-[1000] top-0 left-0 h-[100vh] w-[100vw] flex items-center justify-center backdrop:blur-lg flex-col">
          <div>
            <img src={imageURL} alt="" className="h-[80vh] w-full bg-cover" />
          </div>
          <div className="flex gap-5 fixed top-0 mt-5">
            <button
              className="bg-black/20 p-3 text-2xl rounded-full hover:bg-black/50 cursor-pointer transition-all duration-300"
              onClick={() => downloadFile(imageURL)}
            >
              <MdFileDownload />
            </button>
            <button
              className="bg-black/20 p-3 text-2xl rounded-full hover:bg-black/50 cursor-pointer transition-all duration-300"
              onClick={() => {
                setShowImage(false);
                setImageURl(null);
              }}
            >
              <IoCloseSharp />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default MessageContainer;
