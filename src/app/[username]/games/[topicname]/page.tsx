"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import FetchTopicByfn from "@/client/fetchTopicByfn";
import { useInView } from "react-intersection-observer";
import { useEffect, useState } from "react";
import { PostType, UserType } from "@/type/post";
import Post from "@/component/Post";
import FetchTopicFn from "@/client/fetchTopicFn";
import Image from 'next/image'
import '@/styles/topicPageOne.css'
import useUser from "@/client/useUser";

const queryClient = new QueryClient()

export default function App({ params }: any) {
    const { username, topicname } = params;

    return (
        <QueryClientProvider client={queryClient}>
            <TopicPage topicname={topicname} username={username} />
        </QueryClientProvider>
    )
}
const dsUrl = 'https://myhotposters.com/cdn/shop/products/mL1833_1024x1024.jpg?v=1571445492' // img test url

function TopicPage({ topicname, username }: { topicname: string, username: string }) {
    const { ref, inView } = useInView()
    const { data, fetchNextPage, fetchPreviousPage } = FetchTopicByfn(username, topicname);
    const TopicData = FetchTopicFn(topicname, username);
    const [userNM, setUsername] = useState('')
    const [user, setUser] = useState<UserType>()
    const getUser = useUser()

    async function checkUser(username: string) {
        const result = await getUser(username)
        setUser(result.data.user)
    }

    useEffect(() => {
        setUsername(sessionStorage.getItem('session-id') || '')
    }, [])

    useEffect(() => {
        if (userNM === '') return
        checkUser(userNM)
    }, [userNM])

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

    if(user === undefined) return (<div>Loading...</div>)

    return (
        <div className="TopicContainter">
            <div className="TopicMain">
                <div className="TopicImageMain">
                    <Image
                        src={dsUrl}
                        alt="Picture of the author"
                        width={0}
                        height={0}
                        sizes="20%"
                        style={{ width: '100%', height: 'auto' }}
                    />
                </div>
                <div className="TopicDetailsMain">
                    <span>Post: {TopicData?.PostCount}</span>
                    <h3>Name: {TopicData?.Name}</h3>
                    <h2>Details: {TopicData?.Description}</h2>
                </div>
            </div>
            <div className="ContainerPost">
                {data?.pages.map((page, index) => (
                    <div key={index}>
                        {page.topics.map((post: PostType, indexj: number) => (
                            <Post KeyMutation="Topicpost" key={indexj} props={post} user={user} />
                        ))}
                    </div>
                ))}
            </div>
        </div>
    )
}