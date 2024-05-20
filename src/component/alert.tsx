'use client';
import Image from 'next/image'
import { NotificationType } from '@/type/post';
import { useRouter } from 'next/navigation';

export default function Alert({props, userid}:{props: NotificationType, userid: number}){
    const router = useRouter()
    
    return(
        <div className='event' id={props.Seen ? "seen" : "notseen"}>
            <div className="eventIcon">
                <Image src={props.ProfilePicture} alt="pfp of the user" 
                width={0}
                height={0}
                sizes="100vw"
                style={{ width: '100%', height: 'auto' }}
                className='profilePostImg'
                />
            </div>
            <div className="eventText">
                <h4>{props.Username}</h4>
                {props.PostId ? 
                    <span onClick={() =>router.replace(`/${props.Username}`) }> {props.Type} your Post</span> 
                        : 
                    <span onClick={() =>router.replace(`/${props.Username}/${props.PostId}`) }> Now {props.Type} you</span>}
            </div>
        </div>
    )
}