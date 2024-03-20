import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useRouter } from 'next/navigation';



export default function login() {
    const router = useRouter();

    const mutation = useMutation({
        mutationKey: ['login'],
        mutationFn: async (credentials: {username: string,  password: string}) => await axios.get('/api/login', {params: credentials}),
        onSuccess: () => {
            console.log(mutation.data);
            mutation.data?.data?.match ? router.push('/home') : router.push('/login');
        },
        onError: (error) => {
            console.log(error);
        },
    });
    return mutation;
}