"use client"
import { useRouter } from "next/navigation";

const Profile = () => {
    const router = useRouter();
    router.push('/home');

    return null;
};

export default Profile;
