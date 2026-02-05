'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function Login() {
  const router = useRouter();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!username.trim() || !password.trim()) {
      alert('Please enter username/email and password');
      return;
    }

    console.log('Login:', { username, password, remember });

    alert('Logged in (demo)');

    // After login, go )
    router.push('/start'); // or " other place"
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-purpleLight rounded-xl p-10 w-80 text-center shadow-lg">
        <Image
          src="/images/photo1.png"
          alt="Login"
          width={100}
          height={100}
          className="mx-auto mb-5"
          priority
        />

        <h1 className="text-black text-lg mb-5">
          Welcome to Campus Lost & Found!
          
        </h1>

        <form onSubmit={handleSubmit}>
          <input
            className="w-full p-2 mb-3 border rounded-lg bg-purpleLighter text-black"
            placeholder="Username / Email"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <input
            className="w-full p-2 mb-3 border rounded-lg bg-purpleLighter text-black"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <div className="flex justify-between items-center text-sm mb-3">
            <label className="flex items-center gap-1 text-black">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
              />
              Remember me
            </label>

            <Link href="/forgot-password" className="text-purpleDark">
              Forgot?
            </Link>
          </div>

          <button
            type="submit"
            className="w-full p-2 bg-purpleDark text-white rounded-lg font-bold hover:bg-purpleDarker"
          >
            Login
          
          </button>
        </form>

        <p className="text-sm mt-5 italic text-black">
          "Lost something? Don&apos;t worry—your campus community is here to help."
        </p>

        <p className="text-sm mt-2 text-black">
          Don’t have an account?{' '}
          <Link href="/signup" className="text-purpleDark">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}
