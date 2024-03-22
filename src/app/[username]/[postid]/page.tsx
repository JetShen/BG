"use client"
import Image from "next/image"
import '@/styles/selectedPost.css'
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { useRouter } from 'next/navigation';
import Post from "@/component/Post"
import { useEffect, useState } from "react"
import { UserType } from "@/type/post"
import useUser from "@/client/useUser"
import FetchPost from "@/client/fetchPost"
import FetchReplys from "@/client/fetchReplys";

const queryClient = new QueryClient()

export default function Page({params}:any){
    const { username, postid } = params;

    return(
        <QueryClientProvider client={queryClient}>
            <PostPage params={{username, postid}}/>
        </QueryClientProvider>
    )
}



function PostPage({params}:any){
    const { username, postid } = params;
    const router = useRouter()
    const [userNM, setUsername] = useState('')
    const [user, setUser] = useState<UserType>()
    const getUser = useUser()
    const { data, isLoading, isError, error } = FetchPost(postid)
    const reply = FetchReplys(postid)

    async function checkUser(username: string) {
        const result = await getUser(username)
        setUser(result.data.user)
    }

    useEffect(() => {
        setUsername(sessionStorage.getItem('session-id') || '')
    }, [])

    useEffect(() => {
        if (userNM === '') return
        checkUser(userNM)
    }, [userNM])
    // wait to get user data 
    if(!user){
        return <div>loading</div>
    }

    if(isLoading){
        console.log('loading')
    }
    if(isError){
        console.log(error)
    }

    return(
    <div className="mainTest">
        <div className="BoxPost">
            {data?.map((post: any, index: number) => (
                <Post
                    key={index}
                    props={post}
                    KeyMutation="getone"
                    user={user}
                />
            ))}
        </div>
        <div className="BoxReplyHeader">
                <strong>Replys</strong>
            </div>
        <div className="BoxReply">
            <div className="BoxReplyContent">
                {reply.data?.pages.map((page, index) => (
                    <div key={index}>
                        {page.map((post: any, index: number) => (
                            <Post
                                key={index}
                                props={post}
                                KeyMutation="replys"
                                user={user}
                            />
                        ))}
                    </div>
                ))}
            </div>
        </div>
    </div>
    )
}