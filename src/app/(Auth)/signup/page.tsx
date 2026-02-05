'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function Signup() {
  const router = useRouter();

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!username || !email || !password || !confirmPassword) {
      alert('Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    // Demo logic (replace later with real backend)
    console.log('Signup:', { username, email, password });

    alert('Account created successfully!');

    // After signup, go to login
    router.push('/login');
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-purpleLight rounded-xl p-10 w-80 text-center shadow-lg">
        <div className="mb-5">
          <Image
            src="/images/photo1.png"
            alt="Person waving"
            width={100}
            height={100}
            className="mx-auto"
            priority
          />
        </div>

        <h1 className="text-black text-lg mb-5">
          Welcome to Campus Lost & Found!
        </h1>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full p-2 mb-3 border border-gray-300 rounded-lg bg-purpleLighter text-black"
          />

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 mb-3 border border-gray-300 rounded-lg bg-purpleLighter text-black"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 mb-3 border border-gray-300 rounded-lg bg-purpleLighter text-black"
          />

          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full p-2 mb-4 border border-gray-300 rounded-lg bg-purpleLighter text-black"
          />

          <button
            type="submit"
            className="w-full p-2 bg-purpleDark text-white rounded-lg font-bold hover:bg-purpleDarker"
          >
            Sign Up
          </button>
        </form>

        <p className="text-sm text-black mt-5 italic">
          "Lost something? Don&apos;t worry— your campus community is here to help."
        </p>

        <p className="text-sm mt-2 text-black">
          Already have an account?{' '}
          <Link href="/login" className="text-purpleDark">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
