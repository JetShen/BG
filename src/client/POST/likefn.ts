import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";


export default function LikeFn({OriginalUser, UserId, PostId, Key}:{OriginalUser: number, UserId: number ,PostId: number, Key: string}){
    const keyPost = Key;
    const queryClient = useQueryClient()
    const mutation = useMutation({
        mutationKey: ['likePost'],
        mutationFn: async () =>  {
            const result = await axios.post('/api/post/like', { UserID: UserId, PostID: PostId});
            if (result.status && UserId !== OriginalUser){
                await axios.post('/api/profile/notification', {UserId: UserId, Type: 'Like', DestinationId: OriginalUser, PostId: PostId});
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