"use client"
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

const Profile = () => {
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      router.push('/profile/posts');
    }
  }, []);

  return null;
};

export default Profile;
