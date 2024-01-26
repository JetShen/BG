'use client' 
import { useRouter } from 'next/navigation'
import '@/styles/follow.css'
import Person from './person'

export default function Follow(){
    const router = useRouter()
    
    return (
        <>
        <div className="logoSection">
          <button type="button" onClick={() => router.replace('/home')}>
            Home
          </button>

        </div>
        <ul className="people">
            <Person />
            <Person />
            <Person />
            <Person />

        </ul>
        </>
      )
}