import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

export default function MakePostFn({ key }: { key: string}) {
    const queryClient = useQueryClient();
    const mutation = useMutation({
        mutationKey: ['makePost'],
        mutationFn: async (postdata: { userid: number, content: string, topicId?: number }) => await axios.post('/api/post/make', postdata),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [key], refetchType: 'active', });
        },
        onError: (error) => {
            console.log(error);
        },
    });
    return mutation;
}
