import { useMutation } from "@tanstack/react-query";
import axios from "axios";


export default function DeleteAcc(){
    const mutation = useMutation({
        mutationKey: ['deleteAcc'],
        mutationFn: async (Username: string) =>  await axios.delete(`/api/profile/delete?Username=${Username}`),
        onSuccess: () => {
            console.log('Account deleted');
        },
        onError: (error) => {
            console.log(error)
        },
    });
    return mutation;
}