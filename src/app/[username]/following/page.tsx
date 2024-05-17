'use client';
import  { Fragment, useEffect } from 'react';
import { QueryClient, QueryClientProvider,} from '@tanstack/react-query';
import {  UserType } from '@/type/post';
import { useInView } from 'react-intersection-observer'
import '@/styles/postpage.css'
import FetchFollowersFn from '@/client/GET/fetchFollowersFn';
import GetUser from '@/client/GET/getUser';
import Person from '@/component/person';

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
  const { data, fetchNextPage, fetchPreviousPage } = FetchFollowersFn(userClient.UserId);
  

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
      <div className="pfNav">
        <button>Following</button>
        <button>Followers</button>
      </div>
      <div className='testbox'>
      {data?.pages.map((page, index) => (
        <Fragment key={index}>
            {page.users.map((user:UserType) => (
                <Person key={user.UserId} user={user} userid={userClient.UserId}/>
            ))}
        </Fragment>
      ))}
      </div>
    </>
  );
}
