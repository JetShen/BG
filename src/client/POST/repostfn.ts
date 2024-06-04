import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";


export default function Repost({OriginalUser, UserId, PostID, Key}:{OriginalUser: number, UserId: number ,PostID: number, Key: string}){
    const queryClient = useQueryClient()
    const mutation = useMutation({
        mutationKey: ['repost'],
        mutationFn: async () =>  {
            const result = await axios.post('/api/post/repost', { UserID: UserId, PostID: PostID})
            if (result.status){
                await axios.post('/api/profile/notification', {UserId: UserId, Type: 'Repost', DestinationId: OriginalUser, PostId: PostID});
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