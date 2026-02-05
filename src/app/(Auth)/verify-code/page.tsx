'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

const CODE_LENGTH = 5;

export default function VerifyCode() {
  const router = useRouter();

  const [codes, setCodes] = useState<string[]>(Array(CODE_LENGTH).fill(''));
  const inputs = useRef<Array<HTMLInputElement | null>>([]);

  const focusInput = (index: number) => {
    inputs.current[index]?.focus();
  };

  const setCharAt = (index: number, char: string) => {
    setCodes((prev) => {
      const next = [...prev];
      next[index] = char;
      return next;
    });
  };

  const handleChange = (index: number, rawValue: string) => {
    const value = rawValue.replace(/\D/g, '').slice(0, 1);
    setCharAt(index, value);

    if (value && index < CODE_LENGTH - 1) {
      focusInput(index + 1);
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      if (codes[index]) {
        e.preventDefault();
        setCharAt(index, '');
        return;
      }
      if (index > 0) {
        e.preventDefault();
        focusInput(index - 1);
        setCharAt(index - 1, '');
      }
    }

    if (e.key === 'ArrowLeft' && index > 0) {
      e.preventDefault();
      focusInput(index - 1);
    }

    if (e.key === 'ArrowRight' && index < CODE_LENGTH - 1) {
      e.preventDefault();
      focusInput(index + 1);
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, CODE_LENGTH);
    if (!pasted) return;

    setCodes(() => {
      const next = Array(CODE_LENGTH).fill('');
      for (let i = 0; i < CODE_LENGTH; i++) next[i] = pasted[i] ?? '';
      return next;
    });

    focusInput(Math.min(pasted.length, CODE_LENGTH - 1));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const code = codes.join('');
    if (code.length !== CODE_LENGTH) {
      alert('Please enter the full verification code.');
      return;
    }

    console.log('Code:', code);
    alert('Code verified (demo)');

    // After verification go back to login
    router.push('/login');
  };

  useEffect(() => {
    focusInput(0);
  }, []);

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-purpleLight rounded-xl p-10 w-80 text-center shadow-lg">
        <Image
          src="/images/photo1.png"
          alt="Verify code"
          width={100}
          height={100}
          className="mx-auto mb-5"
          priority
        />

        <h1 className="text-black text-lg mb-5">
          Welcome to Campus Lost & Found!
        </h1>

        <form onSubmit={handleSubmit}>
          <div className="flex justify-between mb-3">
            {codes.map((code, index) => (
              <input
                key={index}
                type="text"
                inputMode="numeric"
                pattern="\d*"
                maxLength={1}
                value={code}
                onPaste={handlePaste}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                ref={(el) => {
                  inputs.current[index] = el;
                }}
                className="w-10 p-2 text-center border border-gray-300 rounded-lg bg-purpleLighter text-black"
              />
            ))}
          </div>

          <button
            type="submit"
            className="w-full p-2 bg-purpleDark text-white rounded-lg font-bold hover:bg-purpleDarker"
          >
            Verify
          </button>
        </form>

        <Link href="/forgot-password" className="text-sm text-purpleDark block mt-3">
          Don&apos;t Receive the Code?
        </Link>

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
