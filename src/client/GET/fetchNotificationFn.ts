import { useInfiniteQuery } from '@tanstack/react-query'
import axios from 'axios'



export default function FetchNotification(userid:number) {
    const {
        data,
        isFetching,
        isFetchingNextPage,
        fetchNextPage,
        fetchPreviousPage,
    } = useInfiniteQuery({
        queryKey: ['NotificationList'],
        queryFn: async ({ pageParam }) => {
            const res = await axios.get('/api/profile/notification/get?cursor='+pageParam+'&userid='+ userid)
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