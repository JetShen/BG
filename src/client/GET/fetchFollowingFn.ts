import { useInfiniteQuery } from '@tanstack/react-query'
import axios from 'axios'



export default function FetchFollowingFn(userid:number) {
    const {
        data,
        fetchNextPage,
        fetchPreviousPage,
    } = useInfiniteQuery({
        queryKey: ['followingList'],
        queryFn: async ({ pageParam }) => {
            const res = await axios.get('/api/search/following?userid='+userid+'&cursor='+ pageParam)
            return res.data
        },
        initialPageParam: 0,
        getNextPageParam: (lastPage, pages) => lastPage.nextId,
        getPreviousPageParam: (firstPage, pages) => firstPage.previousId,
    });

    return { data, fetchNextPage, fetchPreviousPage }
}