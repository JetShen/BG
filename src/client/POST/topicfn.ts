import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";


export default function TopicFn({name, description, Key}:{name: string, description: string, Key: any}){
    const keyPost = Key;
    const queryClient = useQueryClient();
    const mutation = useMutation({
        mutationKey: ['maketopic'],
        mutationFn: async () =>  await axios.post('/api/topic/make', { Name: name, Description: description }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [keyPost], refetchType: 'active', });
        },
        onError: (error) => {
            console.log(error)
        },
    });
    return mutation;
}