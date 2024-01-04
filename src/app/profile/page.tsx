'use client'
import { useRouter } from "next/navigation"

export default function profile(){
    const router = useRouter()
    return (router.replace('/profile/posts'))
}