import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

export default function MakeImg({ key }: { key: string }) {
    const queryClient = useQueryClient();
    const mutation = useMutation({
        mutationKey: ['makeImg'],
        mutationFn: async (fileData: FormData) => await axios.post('/api/post/image', fileData),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [key], refetchType: 'active', });
        },
        onError: (error) => {
            console.log(error);
        },
    });
    return mutation;
}
