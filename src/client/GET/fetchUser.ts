import { useMutation } from "@tanstack/react-query";
import axios from "axios";

export default function GetUser() {

    const mutation = useMutation({
        mutationKey: ['user'],
        mutationFn: async (username: string) => await axios.get(`/api/profile/user?username=${username}`),
        onSuccess: () => {
        },
        onError: (error) => {
            console.log(error);
        },
    });
    return mutation;
}