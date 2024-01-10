'use client'
import { useRouter } from "next/navigation"

export default function Profile(){
    const router = useRouter()
    return (router.replace('/profile/posts'))
}