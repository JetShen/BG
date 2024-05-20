import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";


export default function LikeFn({OriginalUser, UserId, PostID, Key}:{OriginalUser: number, UserId: number ,PostID: number, Key: string}){
    const keyPost = Key;
    const queryClient = useQueryClient()
    const mutation = useMutation({
        mutationKey: ['likePost'],
        mutationFn: async () =>  {
            const result = await axios.post('/api/post/like', { UserID: UserId, PostID: PostID});
            if (result.status){
                await axios.post('/api/profile/notification', {UserId: UserId, Type: 'Like', DestinationId: OriginalUser, PostId: PostID});
            }
            return result;
        },
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