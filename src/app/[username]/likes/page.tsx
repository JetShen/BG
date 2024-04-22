'use client';
import { Fragment, useEffect, useState } from 'react';
import { QueryClient, QueryClientProvider,} from '@tanstack/react-query';
import Post from '@/component/Post';
import { PostType, UserType } from '@/type/post';
import { useInView } from 'react-intersection-observer'
import Navbar from '@/component/Navbar';
import '@/styles/postpage.css'
import FetchLikeFn from '@/client/GET/fetchLikeFn';
import GetUser from '@/client/GET/getUser';

const queryClient = new QueryClient()

export default function App({params}:any){
  const { username } = params;

  const dataUser = GetUser() as any
  if (!dataUser) {
      return null
  }
  const user = dataUser.user
  return (
    <QueryClientProvider client={queryClient}>
      <Home username={username} user={user}/>
    </QueryClientProvider>
  )
}


function Home({username, user}: {username: string, user:UserType} ) {
  const { ref, inView } = useInView()
  const userId:number = 1; // test user id
  const { data, fetchNextPage, fetchPreviousPage } = FetchLikeFn(userId);
  

  const trackScrolling = () => {
    const wrappedElement = document.getElementsByClassName('main')[0]
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
    const scrollElement = document.getElementsByClassName('main')[0]
    scrollElement?.addEventListener('scroll', trackScrolling);

    return () => {
      scrollElement?.removeEventListener('scroll', trackScrolling);
    };
  }, []);


  

  useEffect(() => {
    if (inView) {
      fetchNextPage()
    }
  }, [fetchNextPage, inView])

  if(!user) return <div>Loading...</div>

  return (
    <>
      <div className="pfNav">
        <Navbar username={username} />
      </div>
      <div className='testbox'>
      {data?.pages.map((page, index) => (
        <Fragment key={index}>
          {page.posts.map((post: PostType, indexj:number) => (
            <Post
            key={indexj}
            props={post}
            KeyMutation='postLikes'
            user={user}
          />
          ))}
        </Fragment>
      ))}
      </div>
    </>
  );
}
