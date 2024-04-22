"use client";
import GetUser from "@/client/GET/getUser";
import { UserType } from "@/type/post";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react";


const queryClient = new QueryClient()

export default function Option() {
    const dataUser = GetUser() as any
    if (!dataUser) {
        return null
    }
    const user = dataUser.user
    return (
        <QueryClientProvider client={queryClient}>
            <Optionsub user={user}/>
        </QueryClientProvider>
    )
}

function Optionsub({user}: {user: UserType}) {
    const router = useRouter()
    

    return (
        <>
            <li className="option" onClick={() => router.push('/home')}>Home</li>
            <li className="option" onClick={() => router.push('/home/notifications')}>Notification</li>
            <li className="option" onClick={() => router.push('/home/search')}>Search</li>
            <li className="option" onClick={() => router.push(`/${user?.Username}/posts`)}>Profile</li>
            <li className="option" onClick={() => router.push(`/saved`)}>Saved Post</li>
            <li className="option" onClick={() => router.push('/settings')}>Settings</li>
        </>
    )
}