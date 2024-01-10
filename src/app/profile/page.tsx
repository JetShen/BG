"use client"
import { useRouter } from "next/navigation";

const Profile = () => {
    const router = useRouter();
    router.push('/profile/posts');

    return null;
};

export default Profile;
