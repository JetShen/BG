import { useInfiniteQuery } from "@tanstack/react-query";
import axios from "axios";

// Get all post by query of a user
export default function FetchPostFn(query:string){
    const {
        data,
        isFetching,
        isFetchingNextPage,
        fetchNextPage,
        fetchPreviousPage,
    } = useInfiniteQuery({
    queryKey: ['PostQuery'],
    queryFn: async ({ pageParam }) => {
        const res = await axios.get('/api/search/post?cursor=' + pageParam + '&query=' + query)
        return res.data
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage, pages) => lastPage.nextId,
    getPreviousPageParam: (firstPage, pages) => firstPage.previousId,
    })

    // console.log(data) // logs the data of the first page
    return {
        data,
        isFetching,
        isFetchingNextPage,
        fetchNextPage,
        fetchPreviousPage,
    }
}