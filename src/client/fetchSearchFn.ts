import { useInfiniteQuery } from "@tanstack/react-query";
import axios from "axios";


export default function fetchSearchFn(query: string){

    const {
        data,
        isFetching,
        isFetchingNextPage,
        fetchNextPage,
        fetchPreviousPage,
        refetch,
        isLoading,
        isFetched,
        isError,
    } = useInfiniteQuery({
        queryKey: ['searchPost'],
        queryFn: async ({ pageParam }) => {
            const res = await axios.get('/api/search/post?query=' + query + '&cursor=' + pageParam)
            return res.data
        },
        initialPageParam: 0,
        getNextPageParam: (lastPage, pages) => lastPage.nextId,
        getPreviousPageParam: (firstPage, pages) => firstPage.previousId,
    })

    return {
        data,
        isFetching,
        isFetchingNextPage,
        fetchNextPage,
        fetchPreviousPage,
        refetch,
        isLoading,
        isFetched,
        isError,
    }
}