'use client' 
import { useRouter } from 'next/navigation'

export default function Navbar(){
    const router = useRouter()

    return (
        <>
        <button type="button" onClick={() => router.replace('/profile/games')}>
          Games
        </button>
        <button type="button" onClick={() => router.replace('/profile/posts')}>
          Posts
        </button>
        <button type="button" onClick={() => router.replace('/profile/media')}>
          Media
        </button>
        <button type="button" onClick={() => router.replace('/profile/likes')}>
          Likes
        </button>
        </>
      )
}

