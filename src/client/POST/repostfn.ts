import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";


export default function Repost({OriginalUser, UserId, PostId, Key}:{OriginalUser: number, UserId: number ,PostId: number, Key: string}){
    const queryClient = useQueryClient()
    const mutation = useMutation({
        mutationKey: ['repost'],
        mutationFn: async () =>  {
            const result = await axios.post('/api/post/repost', { UserId: UserId, PostId: PostId})
            if (result.status && UserId !== OriginalUser){
                await axios.post('/api/profile/notification', {UserId: UserId, Type: 'Repost', DestinationId: OriginalUser, PostId: PostId});
            }
            return result;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [Key], refetchType: 'active', })
        },
        onError: (error) => {
            console.log(error)
        },
    });
    return mutation;
}