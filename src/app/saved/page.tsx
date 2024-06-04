"use client"
import { PostType, UserType } from "@/type/post";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Fragment, useEffect, useState } from "react";
import FetchSavedPost from "@/client/GET/fetchSaved";
import Post from "@/component/Post";
import GetUser from "@/client/GET/getUser";

const queryClient = new QueryClient()

export default function App() {
  const data = GetUser() as any
  if (!data) {
    return null
  }
  return (
    <QueryClientProvider client={queryClient}>
      <Saved user={data.user}/>
    </QueryClientProvider>
  )
}


function Saved({ user }: { user: UserType}) {



  const {
    isFetching,
    isFetchingNextPage,
    data,
    fetchNextPage,
    fetchPreviousPage,
  } = FetchSavedPost(user.UserId)

  const trackScrolling = () => {
    const wrappedElement = document.getElementsByClassName('testbox')[0]
    if (wrappedElement === null) {
      return;
    }

    if (wrappedElement.scrollTop === 0) {
      fetchPreviousPage();
    }

    if (wrappedElement.scrollHeight - wrappedElement.scrollTop === wrappedElement.clientHeight) {
      fetchNextPage();
    }
  };

  useEffect(() => {
    const scrollElement = document.getElementsByClassName('testbox')[0]
    scrollElement?.addEventListener('scroll', trackScrolling);

    return () => {
      scrollElement?.removeEventListener('scroll', trackScrolling);
    };
  }, []);


  return (
    <>
      <div className='testbox'>
      {user && data?.pages.map((page, index) => (
        <Fragment key={index}>
          {page.posts.map((post: PostType, indexj:number) => (
            <Post
            key={indexj}
            props={post}
            KeyMutation='saved'
            user={user}
          />
          ))}
        </Fragment>
      ))}
      </div>
      <div>
        {isFetching && !isFetchingNextPage ? 'Background Updating...' : null}
      </div>
    </>
  )
}