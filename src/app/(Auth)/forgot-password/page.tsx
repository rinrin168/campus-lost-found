'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function ForgotPassword() {
  const router = useRouter();
  const [username, setUsername] = useState('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!username.trim()) {
      alert('Please enter your username or email');
      return;
    }

    // Demo sending email logi
    console.log('Password reset request for:', username);

    alert('Verification code sent!');

    // Verify Code page
    router.push('/verify-code');
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-purpleLight rounded-xl p-10 w-80 text-center shadow-lg">
        <Image
          src="/images/photo1.png"
          alt="Forgot password"
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
            type="text"
            placeholder="Username / Email"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full p-2 mb-3 border rounded-lg bg-purpleLighter text-black"
          />

          <button
            type="submit"
            className="w-full p-2 bg-purpleDark text-white rounded-lg font-bold hover:bg-purpleDarker"
          >
            Send
          </button>
        </form>

        <p className="text-sm mt-5 italic text-black">
          "Lost something? Don&apos;t worry—your campus community is here to help."
        </p>

        <p className="text-sm mt-2 text-black">
          Back to{' '}
          <Link href="/login" className="text-purpleDark">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
