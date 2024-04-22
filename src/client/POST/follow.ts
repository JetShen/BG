import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

export default function FollowFn({ key }: { key: string }) {
    const queryClient = useQueryClient();
    const mutation = useMutation({
        mutationKey: ['follow'],
        mutationFn: async (FollowData: FormData) => await axios.post('/api/profile/follow', FollowData),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [key], refetchType: 'active', });
            
        },
        onError: (error) => {
            console.log(error);
        },
    });
    return mutation;
}
