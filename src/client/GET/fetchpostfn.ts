import { useInfiniteQuery } from "@tanstack/react-query";
import axios from "axios";

// Get all posts of a user
export default function FetchPostFn(userid:number){
    const {
        data,
        isFetching,
        isFetchingNextPage,
        fetchNextPage,
        fetchPreviousPage,
    } = useInfiniteQuery({
    queryKey: ['post'],
    queryFn: async ({ pageParam }) => {
        const res = await axios.get('/api/post/getall?cursor=' + pageParam + '&userid=' + userid)
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