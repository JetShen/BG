"use client"
import '@/styles/post.css';
import Image from 'next/image'
import { PostType, UserType } from '@/type/post';
import LikeFn from '@/client/POST/likefn';
import { useRouter } from 'next/navigation';
import ModalReply from './ModalReply';
import { useEffect, useState } from 'react';
import SavePost from '@/client/POST/savePost';
import Repost from '@/client/POST/repostfn';
import { ReplyIcon, ShareIcon, LikeIcon, SaveIcon, ShareIconColor} from '@/svg/icons'

const ulrTest = 'https://img.freepik.com/premium-photo/anime-girl-shark-costume-holding-stuffed-animal-generative-ai_958124-30525.jpg'

export default function Post({props, KeyMutation, user}: {props: PostType, KeyMutation: string, user: UserType}) {
    
    const { PostID, urls_images } = props;
    const { UserId } = user;
    const mutationFN = LikeFn({UserId: UserId, OriginalUser: props.UserID , PostID: PostID, Key: KeyMutation})
    const [showModal, setShowModal] = useState(false);
    const [imgs, setImgs] = useState<string[]>([])
    const router = useRouter()
    const savePost = SavePost({key: KeyMutation})
    const repostPost = Repost({OriginalUser: props.UserID, UserId: UserId, PostID, Key: KeyMutation})

    useEffect(() => {
        if (urls_images) {
            const urls = urls_images.split(', ')
            setImgs(urls)
        }
    }, [urls_images])
    
    

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

    async function save(event:any){
        event.stopPropagation()
        await savePost.mutateAsync({userid: UserId, postId: PostID})

    }

    async function repost(event:any){
        event.stopPropagation()
        await repostPost.mutateAsync()
    }

    return (
        <div className="PostObject" onClick={redirectToPost}>
            <div className="PostImage">
                <Image
                    src={props.ProfilePicture ? props.ProfilePicture : ulrTest}
                    alt="Picture of the author"
                    width={0}
                    height={0}
                    sizes="100vw"
                    style={{ width: '100%', height: 'auto' }}
                    className='profilePostImg'
                />
            </div>
            <div className="PostContent">
                <div className="minisection" style={{display:'flex', width:'100%' ,flexDirection:'row', justifyContent:'space-between'}}>
                    <div style={{display:'flex', flexDirection:'column',}}>
                        <div style={{display:'flex', flexDirection:'row'}}>
                            <p id='primary'>{props.Name}</p>
                            <p id='secondary' onClick={redirecToUser}>@{props.Username}</p>
                        </div>
                    </div>
                    {props.RepostBy ? <p className="repost" id='secondary'>{props.RepostBy} <ShareIconColor/></p> : null}
                </div>
                <div className="innerContent" >
                    <p>{props.Content}</p>
                    <div className="images">
                        {urls_images ? imgs.map((url, index) => (
                            <Image
                                key={index}
                                src={url}
                                alt="Media of the post"
                                width={0}
                                height={0}
                                sizes="10vw"
                                style={{ width: 'auto', height: 'auto', border: '1px solid black'}}
                                className={'image'+index}
                            />
                        )): null}
                    </div>
                </div>
                <div className="interactions">
                    <button className="button comment" onClick={openModal}>
                        <ReplyIcon/> {props.cantidad_respuestas}
                    </button>
                    <button className="button share" onClick={repost}>
                        <ShareIcon/> {props.cantidad_share}
                    </button>
                    <button className="button like" onClick={sendlike} >
                        <LikeIcon/> {props.cantidad_likes}
                    </button>
                    <button className="button save" onClick={save}>
                        <SaveIcon/> {props.cantidad_saved}
                    </button>
                </div>
            </div>
            {showModal && <ModalReply closeModal={closeModal} PostId={props.PostID} KeyMutation={KeyMutation} UserId={UserId} OriginalUser={props.UserID}/>} 
        </div>
    );
}
