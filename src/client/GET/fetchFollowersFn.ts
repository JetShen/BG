import { useInfiniteQuery } from '@tanstack/react-query'
import axios from 'axios'



export default function FetchFollowersFn(userid:number) {
    const {
        data,
        fetchNextPage,
        fetchPreviousPage,
    } = useInfiniteQuery({
        queryKey: ['followersList'],
        queryFn: async ({ pageParam }) => {
            const res = await axios.get('/api/search/followers?userid='+userid+'&cursor='+ pageParam)
            return res.data
        },
        initialPageParam: 0,
        getNextPageParam: (lastPage, pages) => lastPage.nextId,
        getPreviousPageParam: (firstPage, pages) => firstPage.previousId,
    });

    return { data, fetchNextPage, fetchPreviousPage }
}