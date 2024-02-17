import { useInfiniteQuery } from "@tanstack/react-query";
import axios from "axios";


export default function FetchTopicByfn(username: string, topicName: string){
    const {
        data,
        fetchNextPage,
        fetchPreviousPage,
    } = useInfiniteQuery({
        queryKey: ['Topicpost'],
        queryFn: async ({ pageParam }) => {
            const res = await axios.get('/api/profile/topic?cursor='+pageParam+'&username='+username+'&topicName='+topicName)
            return res.data
        },
        initialPageParam: 0,
        getNextPageParam: (lastPage, pages) => lastPage.nextId,
        getPreviousPageParam: (firstPage, pages) => firstPage.previousId,
    })


    return { data, fetchNextPage, fetchPreviousPage }
}