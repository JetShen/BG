"use client"
import Image from "next/image"
import '@/styles/selectedPost.css'
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { useRouter } from 'next/navigation';
import Post from "@/component/Post"
import { useEffect, useState } from "react"
import { UserType } from "@/type/post"

import FetchPost from "@/client/fetchPost"
import FetchReplys from "@/client/fetchReplys";
import GetUser from "@/client/getUser";

const queryClient = new QueryClient()

export default function Page({params}:any){
    const { username, postid } = params;
    const dataUser = GetUser() as any
    if (!dataUser) {
        return null
    }
    const user = dataUser.user
    return(
        <QueryClientProvider client={queryClient}>
            <PostPage params={{username, postid}} user={user}/>
        </QueryClientProvider>
    )
}



function PostPage({params,user}:{params:any,user:UserType}){
    const { username, postid } = params;
    const router = useRouter()
    
    const { data, isLoading, isError, error } = FetchPost(postid)
    const reply = FetchReplys(postid)

   

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