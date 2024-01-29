'use client';
import React, { useEffect } from 'react';
import { useMutation, useQueryClient, useInfiniteQuery, QueryClient, QueryClientProvider,} from '@tanstack/react-query';
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
  const [ContentData, setContentData] = useState<string>('');
  const queryClient = useQueryClient()

  

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
      const res = await axios.get('/api/post/getall?cursor=' + pageParam)
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


  async function MakePostMutated(event: any) {
    const PostObject = {
      content: ContentData,
      userid: 1,
    }
  
    try {
      const res = await fetch('/api/post/make', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(PostObject)
      });

    } catch (error) {
      console.error('Error in MakePostMutated:', error);
    }
  }

  const mutation = useMutation({
    mutationFn: MakePostMutated,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['post'], refetchType: 'active', });
      setContentData('');
    }
  });

  function makePost(event: any) {
    event.preventDefault();
    mutation.mutate({ content: ContentData, userid: 1 }); // TODO: userid should be dynamic
  }

  function update(event: any) {
    setContentData(event.target.value);
  }

  return (
    <>
      <form onSubmit={makePost} className="makePost">
        <input
          contentEditable={true}
          placeholder="Make a Post"
          onChange={update}
          value={ContentData}
          maxLength={255}
        />
        <div className="PostOptions">
          <button type="submit">Post</button>
        </div>
      </form>
      <div className="testbox">
      {data?.pages.map((page, index) => (
        <React.Fragment key={index}>
          {page.posts.map((post: PostType) => (
            <Post
            key={post.PostID}
            props={post}
            KeyMutation="post"
          />
          ))}
        </React.Fragment>
      ))}
      </div>
      <div>
        {isFetching && !isFetchingNextPage ? 'Background Updating...' : null}
      </div>
    </>
  );
}
