import '@/styles/post.css';
import Image from 'next/image'
import { PostType } from '@/type/post';

const ulrTest = 'https://img.freepik.com/premium-photo/anime-girl-shark-costume-holding-stuffed-animal-generative-ai_958124-30525.jpg'

export default function Post(props: PostType) {
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
                        <p>Comment</p>
                    </button>

                    <button className="button share">
                        <p>Share</p>
                    </button>

                    <button className="button like">
                        <p>Like</p>
                    </button>
                </div>
            </div>
        </div>
    );
}
