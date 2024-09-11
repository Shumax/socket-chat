import { useEffect, useState, FormEvent } from 'react';
import { useRouter } from 'next/router';

import { io, Socket } from 'socket.io-client';

import '@/styles/globals.css';

interface ServerToClientEvents {
  'chat message': (msg: string, serverOffset: number, username: string) => void;
}

interface ClientToServerEvents {
  'chat message': (msg: string, clientOffset: string, username: string, callback?: () => void) => void;
}

interface MessageBody {
  msg: string
  username: string
}

export default function chat() {
  const [socket, setSocket] = useState<Socket<ServerToClientEvents, ClientToServerEvents> | null>(null);
  const [messagesBody, setMessagesBody] = useState<MessageBody[]>([]);
  const [input, setInput] = useState<string>('');
  const [connected, setConnected] = useState<boolean>(true);
  const [counter, setCounter] = useState<number>(0);
  
  const router = useRouter();
  const { username }: any = router.query;

  useEffect(() => {
    // console.log(username)
    // if(username == undefined) {
    //   console.log(username)
    //   //router.push('/');
    // }

    const newSocket: Socket<ServerToClientEvents, ClientToServerEvents> = io('http://localhost:3030', {
      auth: { serverOffset: 0 },
      ackTimeout: 10000,
      retries: 3,
    });
    setSocket(newSocket);

    newSocket.on('chat message', (msg: string, serverOffset: number, username: string) => {
      // console.log(msg, serverOffset, username);
      setMessagesBody((prevMessages: MessageBody[]) => [...prevMessages, { msg, username }]);
      newSocket.auth = { ...newSocket.auth, serverOffset };
    });

    return () => {
      newSocket.close();
    };
  }, [username]);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
  
    if (input && socket && username) {
      setCounter(counter + 1);

      const clientOffset = `${socket.id}-${counter}`;
      
      socket.emit('chat message', input, clientOffset, username);
      setInput('');
    }
  }

  function toggleConnection () {
    if (socket) {
      if (connected) {
        socket.disconnect();
      } else {
        socket.connect();
      }
      setConnected(!connected);
    }
  }

  return (
    <div>
      <ul id="messages">
        {messagesBody.map((message, index) => (
          <li key={index}>{message.username}: {message.msg}</li>
        ))}
      </ul>
      <form id='form' onSubmit={handleSubmit}>
        <input
          id='input'
          value={input}
          onChange={(e) => setInput(e.target.value)}
          autoComplete="off"
        />
        <button type="submit">Send</button>
        <button id='toggle-btn' type="button" onClick={toggleConnection}>
          {connected ? 'Disconnect' : 'Connect'}
        </button>
      </form>
    </div>
  );
}

