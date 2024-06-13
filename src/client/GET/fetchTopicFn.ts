import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";


export default function FetchTopicFn(TopicName: string, username: string){
    const query = useQuery({
        queryKey: ['OneTopic'],
        queryFn: async () => await axios.get('/api/profile/OneTopic?username='+username+'&topicname='+TopicName),
        
    });
    return query.data?.data.topic[0];
}