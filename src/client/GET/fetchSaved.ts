import { useInfiniteQuery } from '@tanstack/react-query'
import axios from 'axios'



export default function FetchSavedPost(userid:number) {
    const {
        data,
        isFetching,
        isFetchingNextPage,
        fetchNextPage,
        fetchPreviousPage,
    } = useInfiniteQuery({
        queryKey: ['saved'],
        queryFn: async ({ pageParam }) => {
            const res = await axios.get('/api/profile/save/posts?cursor='+pageParam+'&userid='+ userid)
            return res.data
        },
        initialPageParam: 0,
        getNextPageParam: (lastPage, pages) => lastPage.nextId,
        getPreviousPageParam: (firstPage, pages) => firstPage.previousId,
    });

    return {
        data,
        isFetching,
        isFetchingNextPage,
        fetchNextPage,
        fetchPreviousPage,
    }
}