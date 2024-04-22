import { useQuery } from '@tanstack/react-query'
import axios from 'axios'


export default function FetchPost(postId:number){
    const {
        data,
        isFetching,
        isError,
        error,
        isLoading,
        isSuccess,
    } = useQuery({
        queryKey: ['getone'],
        queryFn: async () => {
            const res = await axios.get('/api/post/getOne?postId='+postId)
            return res.data.post
        },
    });

    return { data, isFetching, isError, error, isLoading, isSuccess }
}