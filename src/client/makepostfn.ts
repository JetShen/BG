import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";


export default function MakePostFn({key, Post}:{key:string, Post: {userid: number, content: string, topicId?: number}}){
    const queryClient = useQueryClient()
    const mutation = useMutation({
        mutationKey: ['makePost'],
        mutationFn: async () =>  await axios.post('/api/post/make', Post),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [key], refetchType: 'active', });
        },
        onError: (error) => {
            console.log(error)
        },
    });
    return mutation;
}