"use client"
import Image from "next/image"
import axios from "axios"
import '@/styles/selectedPost.css'
import LikeFn from "@/client/likefn"
import { QueryClient, QueryClientProvider, useQuery, useMutation } from "@tanstack/react-query"

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

    async function fetchOnePost(){
        const result = await axios.get(`/api/post/getOne?postId=${postid}`)
        console.log(result.data.post[0])
        return result.data.post[0]
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
    
    const sendlike = async () => {
        await mutationFN.mutateAsync()
        if(mutationFN.isSuccess){
            console.log('like')
        }
    }


    return(
    <>
        <div className="BoxPost">
            <div className="BoxIMG">
                <Image
                    src={ulrTest}
                    alt="Picture of the author"
                    width={0}
                    height={0}
                    sizes="100vw"
                    style={{ width: '100%', height: 'auto' }}
                    className='profilePostImg'
                />
            </div>
            <div className="BoxContent">
                <div className="BoxHeader">
                    <strong>{data?.Name}</strong>
                    <p>{data?.Username}</p>
                </div>
                <div className="BoxText">
                    <p>{data?.Content}</p>
                </div>
                <div className="BoxGalery"></div>
                <div className="BoxOptions">
                    <button>Coment</button>
                    <button>Share</button>
                    <button onClick={sendlike}>{data?.cantidad_likes} - Like</button>
                </div>
            </div>
        </div>
        <div className="BoxReply"></div>
    </>
    )
}