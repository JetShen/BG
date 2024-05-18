import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";


export default function Repost({UserID, PostID, Key}:{UserID: number, PostID: number, Key: any}){
    const queryClient = useQueryClient()
    const mutation = useMutation({
        mutationKey: ['repost'],
        mutationFn: async () =>  await axios.post('/api/post/repost', { UserID: UserID, PostID: PostID}),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [Key], refetchType: 'active', })
        },
        onError: (error) => {
            console.log(error)
        },
    });
    return mutation;
}