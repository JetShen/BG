"use client"
import '@/styles/post.css';
import Image from 'next/image'
import { PostType } from '@/type/post';
import LikeFn from '@/client/likefn';
import { useRouter } from 'next/navigation';

const ulrTest = 'https://img.freepik.com/premium-photo/anime-girl-shark-costume-holding-stuffed-animal-generative-ai_958124-30525.jpg'

export default function Post(props: PostType) {
    const { UserID, PostID } = props;
    const mutationFN = LikeFn({UserID, PostID, Key: 'post'})
    const router = useRouter()

    const sendlike = async () => {
        await mutationFN.mutateAsync()
    }

    function redirectToPost(){
        router.replace(`/${props.Username}/${props.PostID}`)
    }

    return (
        <div className="PostObject" >
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
                    <strong className="username">{props.Name}</strong>
                    <p className="userid">{props.Username}</p>
                </div>
                <div className="innerContent" onClick={redirectToPost}>
                    <p>{props.Content}</p>
                </div>
                <div className="interactions">
                    <button className="button comment">
                        Reply
                    </button>
                    <button className="button share">
                        Share
                    </button>
                    <button className="button like" onClick={sendlike} >
                        {props.cantidad_likes} - Like
                    </button>
                </div>
            </div>
        </div>
    );
}
