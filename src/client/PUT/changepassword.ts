import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";


export default function ChangePassword(){
    const queryClient = useQueryClient()
    const mutation = useMutation({
        mutationKey: ['ChangePassword'],
        mutationFn: async (Credential: {UserId:number, Password:string}) =>  await axios.put(`/api/profile/info/password`, Credential),
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['user'], refetchType: 'active'})
        },
        onError: (error) => {
            console.log(error)
        },
    });
    return mutation;
}