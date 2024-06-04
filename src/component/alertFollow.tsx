'use client';
import '@/styles/alertFollow.css';
import { NotificationFollow,  UserType } from '@/type/post';
import { useRouter } from 'next/navigation';
import Image from 'next/image'


const ulrTest = 'https://img.freepik.com/premium-photo/anime-girl-shark-costume-holding-stuffed-animal-generative-ai_958124-30525.jpg'

export default function AlertFollow({props,}: {props: NotificationFollow}) {
    const router = useRouter()

    async function redirectToUser(event:any){
        event?.stopPropagation()
        router.push(`/${props.Actor}/posts`)
    }


    return (
        <div className="AlertObject" onClick={redirectToUser} id={props.Seen ? "" : "NotSeen"}>
            <Image
                src={props.ProfilePicture ? props.ProfilePicture : ulrTest}
                alt="Picture of the author"
                width={0}
                height={0}
                sizes="100vw"
                style={{ width: 'auto', height: '100%' }}
                className='profilePostImg'
            />
            <div style={{padding:'0.2em', display:'flex', flexDirection:'row'}}>
                <p id='secondary'>@{props.Actor}</p>
                <span id='primary'>Followed you</span>
            </div>
        </div>
    );
}
