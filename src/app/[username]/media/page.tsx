'use client';
import  { Fragment, useEffect } from 'react';
import { QueryClient, QueryClientProvider,} from '@tanstack/react-query';
import {  PostType, UserType } from '@/type/post';
import { useInView } from 'react-intersection-observer'
import '@/styles/postpage.css'
import GetUser from '@/client/GET/getUser';
import Post from '@/component/Post';
import { useRouter } from 'next/navigation';
import Navbar from '@/component/Navbar';
import FetchMediaFn from '@/client/GET/fetchMediaFn';

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
      <Home username={username} userClient={user}/>
    </QueryClientProvider>
  )
}


function Home({username, userClient}: {username: string, userClient:UserType} ) {
  const { ref, inView } = useInView()
  const { data, fetchNextPage, fetchPreviousPage } = FetchMediaFn(userClient.UserId);
  const router = useRouter()

  const trackScrolling = () => {
    const wrappedElement = document.getElementsByClassName('main')[0]
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

  if(userClient === undefined) return (<div>Loading...</div>)

  return (
    <>
      <Navbar username={userClient.Username} />
      <div className='Profile-children'>
      {data?.pages.map((page: any, index: number) => (
        <Fragment key={index}>
            {page.posts.map((post: PostType) => (
                <Post key={post.PostId} user={userClient} props={post} KeyMutation='MediaView' />
            ))}
        </Fragment>
      ))}
      </div>
    </>
  );
}
