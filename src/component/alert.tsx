'use client';
import '@/styles/alertPost.css';
import Image from 'next/image'
import { NotificationPost, UserType } from '@/type/post';
import LikeFn from '@/client/POST/likefn';
import { useRouter } from 'next/navigation';
import ModalReply from './ModalReply';
import { useEffect, useState } from 'react';
import SavePost from '@/client/POST/savePost';
import Repost from '@/client/POST/repostfn';
import { ReplyIcon, ReplyIconColor, ShareIcon, ShareIconColor, LikeIcon, LikeIconColor, SaveIcon } from '@/svg/icons'
import SeeNotification from '@/client/PUT/seeNotification';
import { useInView } from 'react-intersection-observer'

const ulrTest = 'https://img.freepik.com/premium-photo/anime-girl-shark-costume-holding-stuffed-animal-generative-ai_958124-30525.jpg'

export default function AlertPost({ props, KeyMutation, user }: { props: NotificationPost, KeyMutation: string, user: UserType }) {
    const { ref, inView } = useInView()
    const { PostId, urls_images } = props;
    const { UserId } = user;
    const mutationFN = LikeFn({ UserId: UserId, OriginalUser: props.userid, PostId: PostId, Key: KeyMutation })
    const [showModal, setShowModal] = useState(false);
    const [imgs, setImgs] = useState<string[]>([])
    const router = useRouter()
    const savePost = SavePost({ key: KeyMutation })
    const repostPost = Repost({ OriginalUser: props.userid, UserId: UserId, PostId, Key: KeyMutation })
    const mutationSeen = SeeNotification()

    useEffect(() => {
        if (urls_images) {
            const urls = urls_images.split(', ')
            setImgs(urls)
        }
    }, [urls_images])



    async function sendlike(event: any) {
        event?.stopPropagation()
        await mutationFN.mutateAsync()
    }

    function redirectToPost(event: any) {
        event?.stopPropagation()
        router.push(`/${props.username}/${props.PostId}`)
    }

    function redirecToUser(event: any) {
        event?.stopPropagation()
        router.push(`/${props.username}/posts`)
    }

    const openModal = (event: any) => {
        event.stopPropagation()
        setShowModal(true);
    };

    const closeModal = (event: any) => {
        event.stopPropagation()
        setShowModal(false);
    };

    async function save(event: any) {
        event.stopPropagation()
        await savePost.mutateAsync({ userid: UserId, postId: PostId })

    }

    async function repost(event: any) {
        event.stopPropagation()
        await repostPost.mutateAsync()
    }

    async function Seen() {
        await mutationSeen.mutateAsync(props.NotificationId)
    }

    useEffect(() => {
        Seen()
        
    }, [inView])

    return (
        <div className="AlertPostObject" onClick={redirectToPost} id={props.Seen ? "" : "NotSeen"}>
            <div className="PostImage">
                <Image
                    src={props.profilepicture ? props.profilepicture : ulrTest}
                    alt="Picture of the author"
                    width={0}
                    height={0}
                    sizes="100vw"
                    style={{ width: '100%', height: 'auto' }}
                    className='profilePostImg'
                />
            </div>
            <div className="PostContent">
                <div className="minisection-Alert">
                    <div>
                        <div className="UserData">
                            <p id='primary'>{props.Name}</p>
                            <p id='secondary' onClick={redirecToUser}>@{props.username}</p>
                        </div>
                        {props.Type === 'Reply' ? <span id='secondary' style={{ display: 'flex', flexDirection: 'row', padding: '0.3em' }}>@{props.actor} <ReplyIconColor /></span> : null}
                        {props.Type === 'Like' ? <span id='secondary' style={{ display: 'flex', flexDirection: 'row', padding: '0.3em' }}>@{props.actor}  <LikeIconColor /></span> : null}
                        {props.Type === 'Repost' ? <span id='secondary' style={{ display: 'flex', flexDirection: 'row', padding: '0.3em' }}>@{props.actor}  <ShareIconColor /></span> : null}

                    </div>
                    {props.Type === 'Reply' ? <p className='AlertReply'>Replying to @{user.Username}</p> : null}
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
                                style={{ width: 'auto', height: 'auto', border: '1px solid black' }}
                                className={'image' + index}
                            />
                        )) : null}
                    </div>
                </div>
                <div className="interactions">
                    <button className="button comment" onClick={openModal}>
                        <ReplyIcon /> {props.cantidad_respuestas}
                    </button>
                    <button className="button share" onClick={repost}>
                        <ShareIcon /> {props.cantidad_share}
                    </button>
                    <button className="button like" onClick={sendlike} >
                        <LikeIcon /> {props.cantidad_likes}
                    </button>
                    <button className="button save" onClick={save}>
                        <SaveIcon /> {props.cantidad_saved}
                    </button>
                </div>
            </div>
            {showModal && <ModalReply closeModal={closeModal} PostId={props.PostId} KeyMutation={KeyMutation} UserId={UserId} OriginalUser={props.userid} />}
        </div>
    );
}
