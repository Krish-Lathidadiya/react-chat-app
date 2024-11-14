import React from "react";
import {
  selectChatData,
  setChatData,
  setChatType,
  selectChatType,
  selectDirectMessagesContacts,
  addChatMessage,
  selectChannels,
} from "@/features/chat/chatSlice";
import { useSelector, useDispatch } from "react-redux";
import { Avatar, AvatarImage } from "@radix-ui/react-avatar";
import { getColor } from "@/lib/utils";
function ContactList({ contacts, isChannel = false }) {
  const dispatch = useDispatch();
  const selectedChatData = useSelector(selectChatData);
  const selectedChatType = useSelector(selectChatType);

  const handleClick = (contact) => {
    if (isChannel) {
      dispatch(setChatType("channel"));
      dispatch(setChatData(contact));
    } else {
      dispatch(setChatType("contact"));
      dispatch(setChatData(contact));
    }
    //jeni sathe vat karto hov ane jene dm mate choose karva no che te same no hova jove
    if (selectedChatData && selectedChatData._id !== contact._id) {
      dispatch(addChatMessage([]));
    }
  };

  return (
    <div className="mt-5">
      {contacts.map((contact) => {
        return (
          <div
            key={contact._id}
            className={`pl-10 py-2 transition-all duration-300 cursor-pointer ${
              selectedChatData && selectedChatData._id === contact._id
                ? "bg-[#8417ff] hover:bg-[#8417ff]"
                : "hover:bg-[#f1f1f111]"
            }`}
            onClick={() => handleClick(contact)}
          >
            <div className="flex gap-5 items-center justify-center text-neutral-300">
              {!isChannel && (
                <Avatar className="h-10 w-10 rounded-full overflow-hidden">
                  {contact?.profilePicture ? (
                    <AvatarImage
                      src={contact?.profilePicture}
                      className="object-cover w-full h-full bg-black"
                    />
                  ) : (
                    <div
                      className={`
                        
                        ${
                          selectedChatData?._id &&
                          selectedChatData?._id === contact._id
                            ? "bg-[ffffff22] border border-white/70"
                            : getColor(contact.color)
                        }
                        uppercase rounded-full w-10 h-10 text-lg border-[1px] flex items-center justify-center `}
                    >
                      {contact?.firstName
                        ? contact?.firstName.charAt(0)
                        : contact?.email.charAt(0)}
                    </div>
                  )}{" "}
                </Avatar>
              )}
              {isChannel && (
                <div
                  className="bg-[#ffffff22] h-10 w-10 flex items-center justify-center
                    rounded-full"
                >
                  #
                </div>
              )}

              {isChannel ? (
                <span>{contact.name}</span>
              ) : (
                <span>{contact.firstName ?`${contact.firstName} ${contact.lastName}` : `${contact.email}`}</span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default ContactList;
