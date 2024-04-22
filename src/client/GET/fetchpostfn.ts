import { useInfiniteQuery } from "@tanstack/react-query";
import axios from "axios";


export default function FetchPostFn(){
    const {
        data,
        isFetching,
        isFetchingNextPage,
        fetchNextPage,
        fetchPreviousPage,
    } = useInfiniteQuery({
    queryKey: ['post'],
    queryFn: async ({ pageParam }) => {
        const res = await axios.get('/api/post/getall?cursor=' + pageParam)
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