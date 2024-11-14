import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { selectUser, selectLoader } from "../../features/auth/authSlice";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import ContactsContainer from "./components/contacts-container";
import EmptyChatContainer from "./components/empty-chat-container";
import ChatContainer from "./components/chat-container";
import {
  selectChatData,
  selectChatType,
  selectFileDownloadProgress,
  selectFileUploadProgress,
  selectIsDownloading,
  selectIsUploading,
} from "@/features/chat/chatSlice";
function Chat() {
  const navigate = useNavigate();
  const selectedChatType = useSelector(selectChatType);
  const selectedChatData = useSelector(selectChatData);
  const userInfo = useSelector(selectUser);
  const isUploading = useSelector(selectIsUploading);
  const isDownloading = useSelector(selectIsDownloading);
  const fileUploadProgress = useSelector(selectFileUploadProgress);
  const fileDownloadProgress = useSelector(selectFileDownloadProgress);

  useEffect(() => {
    if (!userInfo?.profileSetup) {
      toast("Please set up profile to continue...");
      navigate("/profile");
    }
  }, [userInfo.profileSetup, navigate]);
  return (
    <div className="flex h-[100vh] text-white overflow-hidden">
      {isUploading && (
        <div className="h-[100vh] w-[100vw] fixed top-0 z-10 left-10  bg-black/80 flex items-center justify-center flex-col gap-5 backdrop-blur-lg">
          <h5 className="text-5xl animate-pulse">Uploading File</h5>
          {fileUploadProgress}%
        </div>
      )}
      {isDownloading && (
        <div className="h-[100vh] w-[100vw] fixed top-0 z-10 left-10  bg-black/80 flex items-center justify-center flex-col gap-5 backdrop-blur-lg">
          <h5 className="text-5xl animate-pulse">Downloading File</h5>
          {fileDownloadProgress}%
        </div>
      )}
      <ContactsContainer />
      {selectedChatType === null ? <EmptyChatContainer /> : <ChatContainer />}
    </div>
  );
}

export default Chat;
