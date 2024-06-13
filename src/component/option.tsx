"use client";
import "@/styles/MenuOption.css";
import GetUser from "@/client/GET/getUser";
import { UserType } from "@/type/post";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useRouter } from "next/navigation"
import {HomeIcon, NotificationIcon, ProfileIcon, SavedIcon, SearchIcon, SettingsIcon} from "@/svg/icons";

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
            <ul className="options">
                <li onClick={() => router.push('/home')}> <HomeIcon/> Home</li>
                <li onClick={() => router.push('/home/notifications')}> <NotificationIcon/> Notification</li>
                <li onClick={() => router.push(`/${user?.Username}/posts`)}> <ProfileIcon/> Profile</li>
                <li onClick={() => router.push('/home/search')}> <SearchIcon/> Search</li>
                <li onClick={() => router.push(`/saved`)}> <SavedIcon/> Saved Post</li>
                <li onClick={() => router.push('/settings')}> <SettingsIcon/> Settings</li>
            </ul>
        </>
    )
}