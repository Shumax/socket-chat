'use client'
import { useState } from 'react';
import { useRouter } from 'next/navigation';

import '@/styles/globals.css';

export default function Home() {
  const [username, setUsername] = useState('');
  const router = useRouter();

  function handleEnterChat() {
    if (username) {
      router.push(`/chat?username=${username}`);
    }
  }

  return (
    <div className='flex flex-col items-center justify-center h-screen'>
      <h1>Welcome to the Chat Room</h1>
      <input
        type="text"
        placeholder="Enter your username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        className="m-4 text-center"
        required
      />
      <button 
        onClick={handleEnterChat}
        className={`p-2 ${
          !username ? 'opacity-50 cursor-not-allowed' : ''
        }`}
        disabled={!username} // Disables the button if username is empty
      >
        Enter to Chat Room with your Name
      </button>
    </div>
  );
}
