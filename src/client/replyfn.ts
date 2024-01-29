import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";


export default function ReplyFn({UserID, PostID, Key, content}:{UserID: number, PostID: number, Key: any, content: any}){
    const keyPost = Key;
    const queryClient = useQueryClient()
    const mutation = useMutation({
        mutationKey: ['replyPost'],
        mutationFn: async () =>  await axios.post('/api/post/reply', { UserID: UserID, PostID: PostID, content: content}),
        onSuccess: () => {
            console.log('Reply added successfully in ', keyPost);
            queryClient.invalidateQueries({ queryKey: [keyPost], refetchType: 'active', });
        },
        onError: (error) => {
            console.log(error)
        },
    });
    return mutation;
}