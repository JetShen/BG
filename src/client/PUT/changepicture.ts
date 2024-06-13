import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";


export default function ChangePicture(){
    const queryClient = useQueryClient()
    const mutation = useMutation({
        mutationKey: ['picture'],
        mutationFn: async (Credential: FormData) =>  await axios.put(`/api/profile/info/pfp`, Credential),
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['user'], refetchType: 'active'})
        },
        onError: (error) => {
            console.log(error)
        },
    });
    return mutation;
}