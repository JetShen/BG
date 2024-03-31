import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

export default function SavePost({ key }: { key: string }) {
    const queryClient = useQueryClient();
    const mutation = useMutation({
        mutationKey: ['savePost'],
        mutationFn: async (savedata: { userid: number, postId: number}) => await axios.post('/api/profile/save', savedata),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [key], refetchType: 'active', });
            
        },
        onError: (error) => {
            console.log(error);
        },
    });
    return mutation;
}
