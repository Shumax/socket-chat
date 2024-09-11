import { Server } from 'socket.io'
import MessageService from '../../app/messages.js'

export default function socketConnect(server) {
  const io = new Server(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST']
    }
  })

  io.on('connection', async (socket) => {
    console.log('a user connected:', socket.id)

    socket.on('chat message', async (msg, clientOffset, username, callback) => {

      let result

      try {
        result = await MessageService.createMessage({ content: msg, clientOffset: clientOffset, username: username })
      } catch (err) {
        console.log(err)
        if (err.code === 11000) {
          callback()
          return
        }
      }
      
      io.emit('chat message', msg, result._id)
      console.log(`Message: ${msg} from username: ${username}`)
      callback()
    })

    if (!socket.recovered) {
      try {
        const messages = await MessageService.getAllMessagesRoom()
        messages.forEach((message) => {
          //console.log('message: ' + message)
          socket.emit('chat message', message.content, message._id, message.username)
        })
      } catch (e) {
        console.log('Error: ' + e)
      }
    }

    socket.on('disconnect', () => {
      console.log('user disconnected:', socket.id)
    })
  })
}
