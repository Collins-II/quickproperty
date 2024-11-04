'use client';

import Image from "next/image";
import { useRouter } from "next/navigation";

const Logo = () => {
  const router = useRouter();

  return (
    <>
      {/*<p onClick={() => router.push('/')} className="font-bold text-2xl text-yellow-900 cursor-pointer">Homes.Com</p>*/}
      <Image
        onClick={() => router.push('/')}
        className="cursor-pointer"
        src="/images/logo1.png"
        height="60"
        width="60"
        alt="Logo"
      />
    </>
  );
}

export default Logo;
