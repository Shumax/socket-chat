import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  content: String,
  clientOffset: { type: String, unique: true },
  username: String,
})

const Message = mongoose.model('Message', messageSchema)

export default Message
