'use client';
import '@/styles/alertFollow.css';
import { NotificationFollow } from '@/type/post';
import { useRouter } from 'next/navigation';
import Image from 'next/image'
import { useInView } from 'react-intersection-observer';
import SeeNotification from '@/client/PUT/seeNotification';
import { useEffect } from 'react';


const ulrTest = 'https://img.freepik.com/premium-photo/anime-girl-shark-costume-holding-stuffed-animal-generative-ai_958124-30525.jpg'

export default function AlertFollow({props,}: {props: NotificationFollow}) {
    const router = useRouter()
    const { ref, inView } = useInView()
    const mutationSeen = SeeNotification()

    async function redirectToUser(event:any){
        event?.stopPropagation()
        router.push(`/${props.actor}/posts`)
    }

    async function Seen() {
        await mutationSeen.mutateAsync(props.NotificationId)
    }

    useEffect(() => {
        Seen()
    }, [inView])

    return (
        <div className="AlertObject" onClick={redirectToUser} id={props.Seen ? "" : "NotSeen"}>
            <Image
                src={props.profilepicture ? props.profilepicture : ulrTest}
                alt="Picture of the author"
                width={0}
                height={0}
                sizes="100vw"
                style={{ width: 'auto', height: '100%' }}
                className='profilePostImg'
            />
            <div style={{padding:'0.2em', display:'flex', flexDirection:'row'}}>
                <p id='secondary'>@{props.actor}</p>
                <span id='primary'>Followed you</span>
            </div>
        </div>
    );
}

