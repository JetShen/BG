"use client";
import { useRouter } from "next/navigation"


export default function Option() {
    const router = useRouter()

    return (
        <>
        <li className="option" onClick={() => router.push('/home')}>Home</li>
        <li className="option" onClick={() => router.push('/home/notifications')}>Notification</li>
        <li className="option" onClick={() => router.push('/home/search')}>Search</li>
        <li className="option" onClick={() => router.push('/profile/posts')}>Profile</li>
        <li className="option" onClick={() => router.push('/settings')}>Settings</li>
        </>
    )
}