
import Link from "next/link";
import Image from "next/image";

export default function StartPage() {
  return (
    <div className="flex min-h-screen">
      {/* Left side */}
      <div className="w-1/2 flex items-center justify-center bg-white">
        <Image
          src="/images/photo1.png"
          alt="Illustration"
          width={260}
          height={260}
          priority
        />
      </div>

      {/* Right side */}
      <div className="w-1/2 bg-purpleLight flex flex-col justify-center items-center text-center px-10">
        <p className="mb-6 text-black font-medium">
          “Lost something? Don’t worry — your campus community is here to help.”
        </p>

        <Link
          href="/login"
          className="px-6 py-2 bg-purpleDark text-white rounded-full font-semibold hover:bg-purpleDarker"
        >
          Get started
        </Link>
      </div>
    </div>
  );
}
