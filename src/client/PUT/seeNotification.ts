import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";


export default function SeeNotification(){
    const queryClient = useQueryClient()
    const mutation = useMutation({
        mutationKey: ['privateAcc'],
        mutationFn: async (NotificationId: number) =>  await axios.put(`/api/profile/notification/upt?NotificationId=${NotificationId}`),
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['NotificationList'], refetchType: 'active'})
        },
        onError: (error) => {
            console.log(error)
        },
    });
    return mutation;
}