import { useMutation } from "@tanstack/react-query";
import axios from "axios";

export default function GetUsers() {
    const mutation = useMutation({
        mutationKey: ['userList'],
        mutationFn: async (userid: number) => await axios.get(`/api/search/users?userid=${userid}`),
        onSuccess: () => {
        },
        onError: (error) => {
            console.log(error);
        },
    });
    return mutation;
}