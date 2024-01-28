import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";
import '@/styles/modalreply.css'



export default function ModalReply({ closeModal, PostId }: { closeModal: any, PostId: number}){
    const [ContentData, setContentData] = useState<string>('');
    const queryClient = useQueryClient()

    const update = (event: any) => {
        setContentData(event.target.value);
    };

    const mutation = useMutation({
        mutationFn: MakePostMutated,
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ['post'], refetchType: 'active', });
          setContentData('');
        }
    });
    
    function makePost(event: any) {
        event.preventDefault();
        event.stopPropagation()
        console.log('makePost')
        mutation.mutate({ content: ContentData, postid: PostId, userid: 1 }); // TODO: userid should be dynamic
    }

    async function MakePostMutated(event: any) {
        const PostObject = {
          content: ContentData,
          postid: PostId,
          userid: 1,
        }
      
        try {
            await axios.post('/api/post/reply', PostObject)
    
        } catch (error) {
          console.error('Error in MakePostMutated:', error);
        }
    }

    function closeM(event: any) {
        event?.stopPropagation()
        closeModal(event)
    }

    return (
        <div className="modal-overlay" onClick={closeM}>
            <form  className="replyBox">
                <span className="close" onClick={closeM}>&times;</span>
                <input
                    onClick={(event) => event.stopPropagation()}
                    contentEditable={true}
                    placeholder="Make a Reply"
                    onChange={update}
                    value={ContentData}
                    maxLength={255}
                />
                <div className="">
                    <button onClick={makePost}>Reply</button>
                </div>
            </form>
        </div>
    )
}