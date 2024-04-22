import { useInfiniteQuery } from "@tanstack/react-query";
import axios from "axios";


export default function FetchReplys(postId:number){
    const {
        data,
        isFetching,
        isFetchingNextPage,
        fetchNextPage,
        fetchPreviousPage,
    } = useInfiniteQuery({
    queryKey: ['replys'],
    queryFn: async ({ pageParam }) => {
        const res = await axios.get(`/api/post/getreplys?postid=${postId}&cursor=${pageParam}`)
        return res.data.posts
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