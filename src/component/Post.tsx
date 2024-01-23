import '@/styles/post.css';
import Image from 'next/image'
import { PostType } from '@/type/post';
import { useMutation, useMutationState, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

const ulrTest = 'https://img.freepik.com/premium-photo/anime-girl-shark-costume-holding-stuffed-animal-generative-ai_958124-30525.jpg'

export default function Post(props: PostType) {
    const queryClient = useQueryClient()

    const mutation = useMutation({
        mutationKey: ['likePost'],
        mutationFn: async () =>  await axios.post('/api/post/like', { UserID: props.UserId, PostID: props.postId}),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['post'], refetchType: 'active', });
        },
        onError: (error) => {
            console.log(error)
        },
    });

    // const like = useMutationState({
    //     filters: { mutationKey: ['likePost']},
    //     select: (mutation) => mutation.state.data,
    //   })
    const sendlike = async () => {
        await mutation.mutateAsync()
    }

    return (
        <div className="PostObject">
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
                <div className="innerContent">
                    <p>{props.Content}</p>
                </div>
                <div className="interactions">
                    <button className="button comment">
                        Reply
                    </button>
                    <button className="button share">
                        Share
                    </button>
                    <button className="button like" onClick={sendlike}>
                        Like
                    </button>
                </div>
            </div>
        </div>
    );
}
