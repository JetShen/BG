import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";


export default function ReplyFn({OriginalUser, UserID, PostID, Key, content}:{OriginalUser:number, UserID: number, PostID: number, Key: any, content: any}){
    const keyPost = Key;
    const queryClient = useQueryClient()
    const mutation = useMutation({
        mutationKey: ['replyPost'],
        mutationFn: async () =>  {
            const result = await axios.post('/api/post/reply', { UserID: UserID, PostID: PostID, content: content});
            if (result.status && UserID !== OriginalUser){
                await axios.post('/api/profile/notification', {UserId: UserID, Type: 'Reply', PostId: result.data.result[0].PostId, DestinationId: OriginalUser});
            }
            return result;
        
        },
        onSuccess: () => {
            if ( keyPost === 'getone') {
                queryClient.invalidateQueries({ queryKey: [keyPost], refetchType: 'active', })
                queryClient.invalidateQueries({ queryKey: ['replys'], refetchType: 'active', })
            }
            else {
                queryClient.invalidateQueries({ queryKey: [keyPost], refetchType: 'active', })
            }
        },
        onError: (error) => {
            console.log(error)
        },
    });
    return mutation;
}