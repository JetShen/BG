import { useState } from "react";
import '@/styles/modalreply.css'
import ReplyFn from "@/client/replyfn";



export default function ModalReply({ closeModal, PostId, KeyMutation, UserId }: { closeModal: any, PostId: number, KeyMutation: string, UserId: number}){
    const [ContentData, setContentData] = useState<string>('');
    const MakePostMutated = ReplyFn({content: ContentData, PostID: PostId, UserID: UserId, Key: KeyMutation})

    const update = (event: any) => {
        setContentData(event.target.value);
    };

    
    async function makePost(event: any) {
        event.preventDefault();
        event.stopPropagation()
        console.log('makePost')
        await MakePostMutated.mutateAsync()
        if(MakePostMutated.isSuccess){
            console.log('success')
            setContentData('');
            closeModal(event)
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