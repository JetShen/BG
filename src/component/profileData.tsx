'use client'
import Image from 'next/image'
const ulrTest = 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cc/Anime_Girl_with_cat.svg/1200px-Anime_Girl_with_cat.svg.png'
import { useState, useEffect } from 'react'
import { UserType } from '@/type/post'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import GetUser from '@/client/getUser'
const queryClient = new QueryClient()



export default function ProfileDataClient(){
    const dataUser = GetUser() as any
    if (!dataUser) {
        return null
    }
    const user = dataUser.user
    return (
        <QueryClientProvider client={queryClient}>
          <ProfileData user={user}/>
        </QueryClientProvider>
    )
}


function ProfileData({user}: {user: UserType}){
    


    
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