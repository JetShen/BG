import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";


export default function LikeFn({UserID, PostID, Key}:{UserID: any, PostID: any, Key: any}){
    const keyPost = Key;
    const queryClient = useQueryClient()
    const mutation = useMutation({
        mutationKey: ['likePost'],
        mutationFn: async () =>  await axios.post('/api/post/like', { UserID: UserID, PostID: PostID}),
        onSuccess: () => {
            console.log('Like added successfully in ', keyPost);
            queryClient.invalidateQueries({ queryKey: [keyPost], refetchType: 'active', });
        },
        onError: (error) => {
            console.log(error)
        },
    });
    return mutation;
}