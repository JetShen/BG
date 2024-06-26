import { useInfiniteQuery } from '@tanstack/react-query'
import axios from 'axios'



export default function FetchPostByfn(userid:number) {
    const {
        data,
        fetchNextPage,
        fetchPreviousPage,
    } = useInfiniteQuery({
        queryKey: ['post'],
        queryFn: async ({ pageParam }) => {
            const res = await axios.get('/api/profile/posts?cursor='+pageParam+'&userid='+ userid)
            return res.data
        },
        initialPageParam: 0,
        getNextPageParam: (lastPage, pages) => lastPage.nextId,
        getPreviousPageParam: (firstPage, pages) => firstPage.previousId,
    });

    return { data, fetchNextPage, fetchPreviousPage }
}