'use client' 
import { useRouter } from 'next/navigation'

export default function Follow(){
    const router = useRouter()

    return (
        <>
        <button type="button" onClick={() => router.replace('/')}>
          Home
        </button>
        </>
      )
}