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

export default function chat() {
  const [socket, setSocket] = useState<Socket<ServerToClientEvents, ClientToServerEvents> | null>(null);
  const [messages, setMessages] = useState<string[]>([]);
  const [input, setInput] = useState<string>('');
  const [connected, setConnected] = useState<boolean>(true);
  const [counter, setCounter] = useState<number>(0);
  
  const router = useRouter();
  const { username } = router.query; 

  console.log(username)

  useEffect(() => {
    const newSocket: Socket<ServerToClientEvents, ClientToServerEvents> = io('http://localhost:3030', {
      auth: { serverOffset: 0 },
      ackTimeout: 10000,
      retries: 3,
    });
    setSocket(newSocket);

    newSocket.on('chat message', (msg: string, serverOffset: number, username: string) => {
      setMessages((prevMessages) => [...prevMessages, msg, username]);
      newSocket.auth = { ...newSocket.auth, serverOffset };
    });

    return () => {
      newSocket.close();
    };
  }, []);

  function handleSubmit (e: FormEvent<HTMLFormElement>) {
    
    if (input && socket) {
      setCounter(counter + 1)

      const clientOffset = `${socket.id}-${counter}`;
      console.log(clientOffset)
      socket.emit('chat message', input, clientOffset, username);
      setInput('');
    }

    return false
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
        {messages.map((msg, index) => (
          <li key={index}>{msg}</li>
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
};

