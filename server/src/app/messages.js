import Message from '../infra/db/message.schema.js'

async function createMessage({ content, clientOffset, username }) {
  return await Message.create({ content: content, clientOffset: clientOffset, username: username })
}

async function getAllMessagesRoom() {
  return await Message.find({})
}

const MessageService = {
  createMessage,
  getAllMessagesRoom
}

export default MessageService
