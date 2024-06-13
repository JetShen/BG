import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";


export default function PrivateAcc(){
    const queryClient = useQueryClient()
    const mutation = useMutation({
        mutationKey: ['privateAcc'],
        mutationFn: async (Username: string) =>  await axios.put(`/api/profile/private?Username=${Username}`),
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['user'], refetchType: 'active'})
        },
        onError: (error) => {
            console.log(error)
        },
    });
    return mutation;
}