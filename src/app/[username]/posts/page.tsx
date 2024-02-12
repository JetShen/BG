'use client';
import  { Fragment, useEffect } from 'react';
import { QueryClient, QueryClientProvider,} from '@tanstack/react-query';
import Post from '@/component/Post';
import { PostType } from '@/type/post';
import { useInView } from 'react-intersection-observer'
import Navbar from '@/component/Navbar';
import '@/styles/postpage.css'
import FetchPostByFn from '@/client/fetchPostByfn'

const queryClient = new QueryClient()

export default function App({params}:any){
  const { username } = params;
  return (
    <QueryClientProvider client={queryClient}>
      <Home username={username}/>
    </QueryClientProvider>
  )
}


function Home({username}: {username: string} ) {
  const { ref, inView } = useInView()
  const userId = 1; // test user id
  const { data, fetchNextPage, fetchPreviousPage } = FetchPostByFn(userId);

  

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
            KeyMutation='post'
          />
          ))}
        </Fragment>
      ))}
      </div>
    </>
  );
}
