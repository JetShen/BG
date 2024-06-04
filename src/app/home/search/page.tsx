'use client';
import React, { Fragment, useEffect, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useInView } from 'react-intersection-observer';
import '@/styles/search.css';
import FetchPostFn from '@/client/GET/fetchPostsFn';
import FetchUsers from '@/client/GET/fetchUsersFn';
import PersonSearch from '@/component/PersonSearch';
import Post from '@/component/Post';
import GetUser from '@/client/GET/getUser';
import { PostType, UserType } from '@/type/post';

const queryClient = new QueryClient();

export default function SearchPage() {
  const dataUser = GetUser() as any;
  if (!dataUser) {
    return null;
  }
  const user = dataUser.user;
  return (
    <QueryClientProvider client={queryClient}>
      <Search userClient={user} />
    </QueryClientProvider>
  );
}

function Search({ userClient }: { userClient: UserType }) {
  const [query, setQuery] = useState('');
  const { ref: refUsers, inView: inViewUsers } = useInView();
  const { ref: refPosts, inView: inViewPosts } = useInView();

  const {
    data: userData,
    fetchNextPage: fetchNextPageUsers,
    fetchPreviousPage: fetchPreviousPageUsers,
    refetch: refetchUsers
  } = FetchUsers(query);

  const {
    data: postData,
    fetchNextPage: fetchNextPagePosts,
    fetchPreviousPage: fetchPreviousPagePosts,
    refetch: refetchPosts
  } = FetchPostFn(query);

  useEffect(() => {
    if (query !== '') {
      refetchUsers();
      refetchPosts();
    }
  }, [query]);

  useEffect(() => {
    if (inViewUsers) {
      fetchNextPageUsers();
    }
  }, [inViewUsers]);

  useEffect(() => {
    if (inViewPosts) {
      fetchNextPagePosts();
    }
  }, [inViewPosts]);

  function activateSearch(event: any) {
    event.preventDefault();
    const input = event.target.querySelector('.SearchInput').value;
    setQuery(input);
  }

  return (
    <div className='searchDiv'>
      <form className="boxSearch" onSubmit={activateSearch}>
        <input type="text" className="SearchInput" placeholder="Search..." />
        <button type='submit'>Search</button>
      </form>

      <div className="resultPeople">
        <div className="PeopleGrid">
          {userData?.pages.map((page, index) => (
            <Fragment key={index}>
              {page.users.map((user: UserType, userIndex: number) => (
                <PersonSearch key={userIndex} user={user} userid={userClient.UserId} />
              ))}
            </Fragment>
          ))}
          <div ref={refUsers} />
        </div>
      </div>
      <div className="resultPosts">
        {postData?.pages.map((page, index) => (
          <Fragment key={index}>
            {page.posts.map((post: PostType, postIndex: number) => (
              <Post key={postIndex} props={post} user={userClient} KeyMutation='PostSearch' />
            ))}
          </Fragment>
        ))}
        <div ref={refPosts} />
      </div>
    </div>
  );
}
