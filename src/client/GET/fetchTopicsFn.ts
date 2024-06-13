import { useInfiniteQuery } from "@tanstack/react-query";
import axios from "axios";


export default function FetchTopicsFn(username: string){
    const {
        data,
        fetchNextPage,
        fetchPreviousPage,
    } = useInfiniteQuery({
        queryKey: ['topics'],
        queryFn: async ({ pageParam }) => {
            const res = await axios.get('/api/profile/topics?cursor='+pageParam+'&username='+username)
            return res.data
        },
        initialPageParam: 0,
        getNextPageParam: (lastPage, pages) => lastPage.nextId,
        getPreviousPageParam: (firstPage, pages) => firstPage.previousId,
    })


    return { data, fetchNextPage, fetchPreviousPage }
}