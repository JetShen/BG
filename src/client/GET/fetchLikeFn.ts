import { useInfiniteQuery } from "@tanstack/react-query";
import axios from "axios";



export default function FetchLikeFn(userid:number){
    const {
        data,
        fetchNextPage,
        fetchPreviousPage,
    } = useInfiniteQuery({
        queryKey: ['postLikes'],
        queryFn: async ({ pageParam }) => {
            const res = await axios.get('/api/profile/likes?cursor='+pageParam+'&userid='+ userid)
            return res.data
        },
        initialPageParam: 0,
        getNextPageParam: (lastPage, pages) => lastPage.nextId,
        getPreviousPageParam: (firstPage, pages) => firstPage.previousId,
    });

    return {data, fetchNextPage, fetchPreviousPage}
}