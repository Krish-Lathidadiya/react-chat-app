import React from "react";
import { RiCloseFill } from "react-icons/ri";
import {
  closeChat,
  selectChatData,
  selectChatType,
} from "@/features/chat/chatSlice";
import { useDispatch, useSelector } from "react-redux";
import { Avatar } from "@/components/ui/avatar";
import { AvatarImage } from "@radix-ui/react-avatar";
import { getColor } from "@/lib/utils";
function ChatHeader() {
  const dispatch = useDispatch();
  const selectedChatData = useSelector(selectChatData);
  const selectedChatType = useSelector(selectChatType);
  const handleCloseChat = async () => {
    await dispatch(closeChat());
  };
  return (
    <div className="h-[10vh] border-b-2 border-[#2f303b] flex items-center justify-between px-20">
      <div className="flex gap-5 items-center w-full justify-between">
        {/* left side:userInfo */}
        <div className="flex gap-3 items-center justify-center ">
          {/* logo */}

          <div className="w-12 h-12 relative">
            {selectedChatType === "contact" ? (
              <Avatar className="h-12 w-12 rounded-full overflow-hidden">
                {selectedChatData?.profilePicture ? (
                  <AvatarImage
                    src={selectedChatData?.profilePicture}
                    className="object-cover w-full h-full bg-black"
                  />
                ) : (
                  <div
                    className={`uppercase rounded-full w-12 h-12 text-lg border-[1px] flex items-center justify-center ${getColor(
                      selectedChatData?.color
                    )}`}
                  >
                    {selectedChatData?.firstName
                      ? selectedChatData?.firstName.charAt(0)
                      : selectedChatData?.email.charAt(0)}
                  </div>
                )}
              </Avatar>
            ) : (
              <div className="bg-[#ffffff22] h-10 w-10 flex items-center justify-center rounded-full">
                #
              </div>
            )}
          </div>
          {/* text */}
          <div>
            {selectedChatType === "channel" && selectedChatData.name}
            {selectedChatType === "contact" && selectedChatData?.firstName
              ? `${selectedChatData?.firstName} ${selectedChatData?.lastName}`
              : selectedChatData?.email}
          </div>
        </div>
        {/* right side: closeChat button */}
        <div className="flex items-center justify-center gap-5">
          <button
            className="text-neutral-500 
            focus:border-none focus:outline-none focus:text-white duration-300 transition-all
       "
            onClick={handleCloseChat}
          >
            <RiCloseFill className="text-3xl" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default ChatHeader;
