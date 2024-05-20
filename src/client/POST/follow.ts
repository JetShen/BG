import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

export default function FollowFn({ key }: { key: string }) {
    const queryClient = useQueryClient();
    const mutation = useMutation({
        mutationKey: ['follow'],
        mutationFn: async (FollowData: FormData) => {
            const result = await axios.post('/api/profile/follow', FollowData);
            if (result.status){
                await axios.post('/api/profile/notification', {UserId: FollowData.get('userid'), Type: 'Follow', DestinationId: FollowData.get('followid')});
            }
            return result;
        },
        onSuccess:  () => {
            queryClient.invalidateQueries({ queryKey: ['userList'], refetchType: 'active', });
            console.log('Followed');
        },
        onError: (error) => {
            console.log(error);
        },
    });
    return mutation;
}
