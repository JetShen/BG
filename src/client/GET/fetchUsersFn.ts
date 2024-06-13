import { useInfiniteQuery } from '@tanstack/react-query'
import axios from 'axios'


// Get all users by username
export default function FetchUsers(username:string) {
    const {
        data,
        isFetching,
        isFetchingNextPage,
        fetchNextPage,
        fetchPreviousPage,
        refetch
    } = useInfiniteQuery({
        queryKey: ['UserSearch'],
        queryFn: async ({ pageParam }) => {
            const res = await axios.get('/api/search/user?cursor='+pageParam+'&username='+ username)
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
        refetch
    }
}