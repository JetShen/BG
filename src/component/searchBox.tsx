"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import FetchSearchFn from "@/client/fetchSearchFn";
import { Fragment, useEffect, useState } from "react";
import { PostType, UserType } from "@/type/post";
import Post from "./Post";
import { useInView } from "react-intersection-observer";
import useUser from "@/client/useUser";

const queryClient = new QueryClient();
export default function App({query}:{query:string}){

    return (
        <QueryClientProvider client={queryClient}>
          <SearchPage query={query}  />
        </QueryClientProvider>
      );
}


function SearchPage({query }:{query:string}){
    const {data, isFetching, isFetchingNextPage, fetchNextPage, fetchPreviousPage, refetch, isLoading, isFetched, isError} = FetchSearchFn(query);
    const [ref, isView] = useInView();
    const [userNM, setUsername] = useState('')
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
        if (userNM === '') return
        checkUser(userNM)
    }, [userNM])

    const handleScroll = () => {
        const mainElement = document.querySelector('.searchDiv');
        if (!mainElement) return;
      
        const { scrollTop, scrollHeight, clientHeight } = mainElement;
        if (scrollTop === 0) { // top of the page 
          fetchPreviousPage();
        }
      
        if (scrollHeight - scrollTop === clientHeight) { // bottom of the page
          fetchNextPage();
        }
      };
    
      useEffect(() => {
        const mainElement = document.querySelector('.searchDiv') as HTMLElement;
        if (!mainElement) return;
    
        mainElement.addEventListener('scroll', handleScroll);
    
        return () => {
          mainElement.removeEventListener('scroll', handleScroll);
        };
      }, []);

    useEffect(() => {
        refetch();
    }, [query]);

    useEffect(() => {
        if (isView && data && data.pages.length > 0 && !isFetchingNextPage) {
        fetchNextPage();
        }
    }, [isView, data, isFetchingNextPage]);

    if(!user) return <div>loading...</div>
    
    return(
        <div className="resultPost">
            {isFetching && <div>loading...</div>}
            {isFetched && data?.pages.map((page, index) => (
                <Fragment key={index}>
                {page.posts.map((post: PostType) => (
                    <Post
                    key={post.PostID}
                    props={post}
                    KeyMutation="searchPost"
                    user={user}
                />
                ))}
                </Fragment>
            ))}
        <div ref={ref}></div>
        </div>
    )
}