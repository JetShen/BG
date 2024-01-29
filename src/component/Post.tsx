"use client"
import '@/styles/post.css';
import Image from 'next/image'
import { PostType } from '@/type/post';
import LikeFn from '@/client/likefn';
import { useRouter } from 'next/navigation';
import ModalReply from './ModalReply';
import { useState } from 'react';

const ulrTest = 'https://img.freepik.com/premium-photo/anime-girl-shark-costume-holding-stuffed-animal-generative-ai_958124-30525.jpg'

export default function Post({props, KeyMutation}: {props: PostType, KeyMutation: string}) {
    const { UserID, PostID } = props;
    const mutationFN = LikeFn({UserID, PostID, Key: KeyMutation})
    const [showModal, setShowModal] = useState(false);
    const router = useRouter()

    async function sendlike(event:any) {
        event?.stopPropagation()
        await mutationFN.mutateAsync()
    }

    function redirectToPost(event:any){
        event?.stopPropagation()
        router.push(`/${props.Username}/${props.PostID}`)
    }

    function redirecToUser(event:any){
        event?.stopPropagation()
        router.push(`/${props.Username}/posts`)
    }

    const openModal = (event:any) => {
        event.stopPropagation()
        setShowModal(true);
    };
    
    const closeModal = (event:any) => {
        event.stopPropagation()
        setShowModal(false);
    };

    return (
        <div className="PostObject" onClick={redirectToPost}>
            <div className="PostImage">
                <Image
                    src={ulrTest}
                    alt="Picture of the author"
                    width={0}
                    height={0}
                    sizes="100vw"
                    style={{ width: '100%', height: 'auto' }}
                    className='profilePostImg'
                />
            </div>
            <div className="PostContent">
                <div className="minisection">
                    <strong className="username" onClick={redirecToUser}>{props.Name}</strong>
                    <p className="userid">{props.Username}</p>
                </div>
                <div className="innerContent" >
                    <p>{props.Content}</p>
                </div>
                <div className="interactions">
                    <button className="button comment" onClick={openModal}>
                        {props.cantidad_respuestas} - Reply
                    </button>
                    <button className="button share">
                        Share
                    </button>
                    <button className="button like" onClick={sendlike} >
                        {props.cantidad_likes} - Like
                    </button>
                </div>
            </div>
            {showModal && <ModalReply closeModal={closeModal} PostId={props.PostID} KeyMutation={KeyMutation} />} 
        </div>
    );
}
