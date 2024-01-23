'use client';
import React, { useEffect } from 'react';
import { useInfiniteQuery, QueryClient, QueryClientProvider,} from '@tanstack/react-query';
import { useState } from 'react';
import Post from '@/component/Post';
import { PostType } from '@/type/post';
import axios from 'axios'
import { useInView } from 'react-intersection-observer'

const queryClient = new QueryClient()

export default function App(){
  return (
    <QueryClientProvider client={queryClient}>
      <Home />
    </QueryClientProvider>
  )
}


function Home() {
  const { ref, inView } = useInView()
  const userId = 1; // test user id

  

  const trackScrolling = () => {
    const wrappedElement = document.getElementsByClassName('MainContainer')[0]
    if (wrappedElement === null) {
      return;
    }

    if (wrappedElement.scrollTop === 0) {
      console.log('top');
      fetchPreviousPage();
  }

    if (wrappedElement.scrollHeight - wrappedElement.scrollTop === wrappedElement.clientHeight) {
      console.log('bottom');
      fetchNextPage();
    }
  };

  useEffect(() => {
    const scrollElement = document.getElementsByClassName('MainContainer')[0]
    scrollElement?.addEventListener('scroll', trackScrolling);

    return () => {
      scrollElement?.removeEventListener('scroll', trackScrolling);
    };
  }, []);


  const {
    status,
    data,
    error,
    isFetching,
    isFetchingNextPage,
    isFetchingPreviousPage,
    fetchNextPage,
    fetchPreviousPage,
    hasNextPage,
    hasPreviousPage,
  } = useInfiniteQuery({
    queryKey: ['post'],
    queryFn: async ({ pageParam }) => {
      const res = await axios.get('/api/profile/posts?cursor='+pageParam+'&userid='+ userId)
      return res.data
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage, pages) => lastPage.nextId,
    getPreviousPageParam: (firstPage, pages) => firstPage.previousId,
  })

  React.useEffect(() => {
    if (inView) {
      fetchNextPage()
    }
  }, [fetchNextPage, inView])


  return (
    <>
      <div className='innerBox'>
      {data?.pages.map((page, index) => (
        <React.Fragment key={index}>
          {page.posts.map((post: PostType) => (
            <Post
            key={post.PostID}
            Name={post.Name}
            Username={post.Username}
            Content={post.Content}
            PostID={post.PostID}
            UserID={post.UserID}
            cantidad_likes={post.cantidad_likes}
          />
          ))}
        </React.Fragment>
      ))}
      </div>
    </>
  );
}
