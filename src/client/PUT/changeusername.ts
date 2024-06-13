import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";


export default function ChangeUsername(){
    const queryClient = useQueryClient()
    const mutation = useMutation({
        mutationKey: ['ChangeUsername'],
        mutationFn: async (Credential: {UserId:number, Username:string}) =>  await axios.put(`/api/profile/info/username`, Credential),
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['user'], refetchType: 'active'})
        },
        onError: (error) => {
            console.log(error)
        },
    });
    return mutation;
}