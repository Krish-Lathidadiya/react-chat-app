const mongoose = require("mongoose");
const User = require('./user.model');
 
const messageSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true,"sender name is required"],
  },
  recipient: {
    type:  mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: false,
  },
  messageType: {
    type: String,
    validate: {
      validator: function(value) {
        return ["text", "file"].includes(value);
      },
      message: props => `${props.value} is not a valid message type. Allowed values are 'text' and 'file'.`
    },
    required: true,
  },
  content: {
    type: String,
    required: function () {
      return this.messageType === "text";
    },
  },
  fileUrl: {
    type: String,
    required: function () {
      return this.messageType === "file";
    },
  },
}, {
  timestamps: true
});

const Message = mongoose.model("Message", messageSchema);

module.exports = Message;
