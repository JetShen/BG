"use client";
import useUser from "@/client/useUser";
import { UserType } from "@/type/post";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react";


const queryClient = new QueryClient()

export default function Option() {
    return (
        <QueryClientProvider client={queryClient}>
            <Optionsub />
        </QueryClientProvider>
    )
}

function Optionsub() {
    const router = useRouter()

    const [userNM, setUsername] = useState('')
    const [user, setUser] = useState<UserType>()
    const getUser = useUser()

    async function checkUser(username: string) {
        const result = await getUser(username)
        setUser(result.data.user)
    }

    useEffect(() => {
        setUsername(sessionStorage.getItem('session-id') || '')
    }, [])

    useEffect(() => {
        if (userNM === '') return
        checkUser(userNM)
    }, [userNM])

    return (
        <>
            <li className="option" onClick={() => router.push('/home')}>Home</li>
            <li className="option" onClick={() => router.push('/home/notifications')}>Notification</li>
            <li className="option" onClick={() => router.push('/home/search')}>Search</li>
            <li className="option" onClick={() => router.push(`/${user?.Username}/posts`)}>Profile</li>
            <li className="option" onClick={() => router.push(`/saved`)}>Saved Post</li>
            <li className="option" onClick={() => router.push('/home/settings')}>Settings</li>
        </>
    )
}