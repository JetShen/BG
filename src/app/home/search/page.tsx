"use client";
import { Fragment, useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { QueryClient, QueryClientProvider, useInfiniteQuery } from '@tanstack/react-query';
import '@/styles/search.css';
import { PostType } from '@/type/post';
import Post from '@/component/Post';
import fetchSearchFn from '@/client/fetchSearchFn';

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Search />
    </QueryClientProvider>
  );
}

function Search() {
    const { ref, inView } = useInView();
    const [query, setQuery] = useState<string>('');
    const [search, setSearch] = useState<boolean>(false);

      const {
        data,
        isFetching,
        isFetchingNextPage,
        fetchNextPage,
        fetchPreviousPage,
        refetch,
        isLoading,
        isFetched,
        isError,
    } = fetchSearchFn(query);
    
    useEffect(() => {
        if (inView) {
          fetchNextPage()
        }
    }, [search]);
    
    if(isFetched ){
      refetch();
    }
  
    function activateSearch(event: any) {
        event.preventDefault();
        const input = event.target.querySelector('.SearchInput');
        setQuery(input.value);
        setSearch(!search);
    }
  
    return (
      <div className='searchDiv'>
        <form className="boxSearch" onSubmit={activateSearch}>
          <input type="text" className="SearchInput" placeholder="Search..." />
          <button type='submit'>Search</button>
        </form>

        <div className="resultPeople">
        </div>
        <div className="resultPost">
          {isLoading && <div>Loading...</div>} 
          {data?.pages.map((page: any, index: any) => (
            <Fragment key={index}>
              {page.posts.map((post: PostType) => (
                <Post
                    key={post.PostID}
                    props={post}
                    KeyMutation="searchPost"
                />
              ))}
            </Fragment>
          ))}
          {isFetchingNextPage ? <div>Loading...</div> : null}
        </div>
      </div>
    );
  }
