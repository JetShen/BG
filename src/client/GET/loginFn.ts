import { useMutation } from "@tanstack/react-query";
import axios from "axios";



export default function Login() {

    const mutation = useMutation({
        mutationKey: ['login'],
        mutationFn: async (credentials: {username: string,  password: string}) => await axios.get('/api/login', {params: credentials}),
        onSuccess: () => {
            console.log('Login successful');
        },
        onError: (error) => {
            console.log(error);
        },
    });
    return mutation;
}