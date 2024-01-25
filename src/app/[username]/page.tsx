"use client"
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';


export default function Profile({params}:any){
  const router = useRouter();
  const { username } = params;
  useEffect(() => {
    if (typeof window !== 'undefined') {
      router.push(`/${username}/posts`);
    }
  }, []);

  return null;
}
