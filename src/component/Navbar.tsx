'use client' 
import { useRouter } from 'next/navigation'

export default function Navbar({username}: {username: string}){
    const router = useRouter()

    return (
        <>
        <button type="button" onClick={() => router.replace(`/${username}/games`)}>
          Games
        </button>
        <button type="button" onClick={() => router.replace(`/${username}/posts`)}>
          Posts
        </button>
        <button type="button" onClick={() => router.replace(`/${username}/media`)}>
          Media
        </button>
        <button type="button" onClick={() => router.replace(`/${username}/likes`)}>
          Likes
        </button>
        </>
      )
}

