import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import chatReducer from "../features/chat/chatSlice";
import contactsReducer from "../features/contacts/contactsSlice";
import messagesReducer  from "../features/messages/messagesSlice";
import channelReducer from "../features/channels/channelSlice"
const store = configureStore({
  reducer: {
    auth: authReducer,
    chat:chatReducer,
    contacts:contactsReducer,
    messages:messagesReducer,
    channel:channelReducer,
  },
});

export default store;
