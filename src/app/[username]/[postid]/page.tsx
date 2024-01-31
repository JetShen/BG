"use client"
import Image from "next/image"
import axios from "axios"
import '@/styles/selectedPost.css'
import LikeFn from "@/client/likefn"
import { QueryClient, QueryClientProvider, useQuery, useMutation } from "@tanstack/react-query"
import { useRouter } from 'next/navigation';
import Post from "@/component/Post"

const ulrTest = 'https://img.freepik.com/premium-vector/anime-cat-motorcycle-helmet-futuristic-cat-print-your-design-vector-illustration-eps_380711-475.jpg'
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

    async function fetchOnePost(){
        const result = await axios.get(`/api/post/getOne?postId=${postid}`)
        console.log(result.data.post)
        return result.data.post
    }
    
    const { isPending, isError, data, error, isSuccess } = useQuery({ 
        queryKey: ['getone'], 
        queryFn: fetchOnePost,
    })
    
    
    const mutationFN= LikeFn({UserID: data?.UserID, PostID: data?.PostID, Key: 'getone'});

    if(isPending){
        console.log('loading')
    }
    if(isError){
        console.log(error)
    }
    // if(isSuccess){
    //     mutationFN = LikeFn({UserID: data.UserID, PostID: data.PostID})
    // }
    
    async function fetchAllReplys(){
        const result = await axios.get(`/api/post/getreplys?postid=${postid}&cursor=${0}`)
        return result.data?.posts
    }

    const reply = useQuery({ 
        queryKey: ['getreplys'], 
        queryFn: fetchAllReplys,
    })




    return(
    <div className="mainTest">
        <div className="BoxPost">
            {data?.map((post: any, index: number) => (
                <Post
                    key={index}
                    props={post}
                    KeyMutation="getone"
                />
            ))}
        </div>
        <div className="BoxReply">
            <div className="BoxReplyHeader">
                <strong>Replys</strong>
            </div>
            <div className="BoxReplyContent">
                {reply.data?.map((post: any, index: number) => (
                    <Post
                        key={index}
                        props={post}
                        KeyMutation="getreplys"
                    />
                ))}
            </div>
        </div>
    </div>
    )
}