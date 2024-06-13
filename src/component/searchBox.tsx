"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import FetchSearchFn from "@/client/GET/fetchSearchFn";
import { Fragment, useEffect, useState } from "react";
import { PostType, UserType } from "@/type/post";
import Post from "./Post";
import { useInView } from "react-intersection-observer";
import GetUser from "@/client/GET/getUser";

const queryClient = new QueryClient();
export default function App({query}:{query:string}){
  const dataUser = GetUser() as any
  if (!dataUser) {
      return null
  }
  const user = dataUser.user
  return (
      <QueryClientProvider client={queryClient}>
        <SearchPage query={query} user={user} />
      </QueryClientProvider>
    );
}


function SearchPage({query,user}:{query:string,user:UserType}){
    const {data, isFetching, isFetchingNextPage, fetchNextPage, fetchPreviousPage, refetch, isLoading, isFetched, isError} = FetchSearchFn(query);
    const [ref, isView] = useInView();
    

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
                    key={post.PostId}
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