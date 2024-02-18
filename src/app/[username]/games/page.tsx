"use client";
import '@/styles/topicPage.css';
import Topic from "@/component/topic";
import { Fragment, useEffect } from "react";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import FetchTopicsFn from '@/client/fetchTopicsFn';
import { useInView } from 'react-intersection-observer';
import { TopicType } from '@/type/post';
import Navbar from '@/component/Navbar';

const queryClient = new QueryClient()

export default function App({ params }: any) {
  const { username } = params;
  return (
    <QueryClientProvider client={queryClient}>
      <TopicPage username={username} />
    </QueryClientProvider>
  )
}

function TopicPage({ username }: { username: string }) {
  const { ref, inView } = useInView()
  const { data, fetchNextPage, fetchPreviousPage } = FetchTopicsFn(username);

  const trackScrolling = () => {
    const wrappedElement = document.getElementsByClassName('ContainerPost')[0]
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
    const scrollElement = document.getElementsByClassName('ContainerPost')[0]
    scrollElement?.addEventListener('scroll', trackScrolling);

    return () => {
      scrollElement?.removeEventListener('scroll', trackScrolling);
    };
  }, []);


  useEffect(() => {
    if (inView) {
      fetchNextPage();
    }
  }, [fetchNextPage, inView])

  return (
    <>
    <div className="pfNav">
        <Navbar username={username} />
    </div>
    <div className="testbox">
      {data?.pages.map((page, index) => (
        <Fragment key={index}>
          {page.topics.map((topic: TopicType, indexj: number) => (
            <Topic key={indexj} topic={topic} username={username} />
          ))}
        </Fragment>
      ))}
    </div>
    </>
  )
}