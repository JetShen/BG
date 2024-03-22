'use client'
import Image from 'next/image'
const ulrTest = 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cc/Anime_Girl_with_cat.svg/1200px-Anime_Girl_with_cat.svg.png'
import { useState, useEffect } from 'react'
import { UserType } from '@/type/post'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import useUser  from '@/client/useUser'
const queryClient = new QueryClient()



export default function ProfileDataClient(){
    return (
        <QueryClientProvider client={queryClient}>
          <ProfileData />
        </QueryClientProvider>
    )
}


function ProfileData(){
    const [username, setUsername] = useState('')
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
        if (username === '') return
        checkUser(username)
    }, [username])


    
    return(
        <div className="miniN">
            <Image src={ulrTest}
            alt="Picture of the author"
            width={0}
            height={0}
            sizes="100vw"
            style={{ width: '50%', height: 'auto' }}
            className='profilePostImg' />
            <strong>{user?.Name}</strong>
            <p>@{user?.Username}</p>
        </div>
    )
}