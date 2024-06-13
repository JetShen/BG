import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

export default function Notification({ key }: { key: string }) {
    const queryClient = useQueryClient();
    const mutation = useMutation({
        mutationKey: ['notification'],
        mutationFn: async (notificationData: 
                { userid:number, DestinationId:number, Type:string, PostId: number | null }) => await axios.post('/api/profile/notification', notificationData),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [key], refetchType: 'active', });
            
        },
        onError: (error) => {
            console.log(error);
        },
    });
    return mutation;
}
