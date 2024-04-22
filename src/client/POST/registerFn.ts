import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useRouter } from 'next/navigation';



export default function Register() {
    const router = useRouter();

    const queryClient = useQueryClient();
    const mutation = useMutation({
        mutationKey: ['register'],
        mutationFn: async (credentials: FormData) => await axios.post('/api/register', credentials),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['register'], refetchType: 'active', });
        },
        onError: (error) => {
            console.log(error);
        },
    });
    return mutation;
}