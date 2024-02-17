"use client";
import { TopicType } from "@/type/post";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import FetchTopicByfn from "@/client/fetchTopicByfn";
import { useInView } from "react-intersection-observer";
import { useEffect } from "react";
import { PostType } from "@/type/post";
import Post from "@/component/Post";

const queryClient = new QueryClient()

export default function App({ params }: any) {
    const { username, topicname } = params;

    return (
        <QueryClientProvider client={queryClient}>
            <Topic topicname={topicname} username={username} />
        </QueryClientProvider>
    )
}

function Topic({ topicname, username }: { topicname: string, username: string }) {
    const { ref, inView } = useInView()
    const { data, fetchNextPage, fetchPreviousPage } = FetchTopicByfn(username, topicname);

    const trackScrolling = () => {
        const wrappedElement = document.getElementsByClassName('TopicContainter')[0]
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
        const scrollElement = document.getElementsByClassName('TopicContainter')[0]
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


    const test = () => {
        console.log(data);
        console.log(topicname);
    }

    return (
        <div className="TopicContainter">
            <div className="TopicMain">
                <button onClick={test}>test</button>
            </div>
            <div className="ContainerPost">
                {/* {data?.pages.map((page, index) => (
                    <div key={index}>
                        {page.posts.map((post: PostType, indexj: number) => (
                            <Post KeyMutation="Topicpost" key={indexj} props={post} />
                        ))}
                    </div>
                ))} */}
            </div>
        </div>
    )
}