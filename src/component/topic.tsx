import '@/styles/topic.css'
import { TopicType } from '@/type/post'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

const dsUrl = 'https://myhotposters.com/cdn/shop/products/mL1833_1024x1024.jpg?v=1571445492'
// this component should be a card that displays the topic name and the number of Posts in that topic by the username
export default function Topic({topic, username}: {topic: TopicType, username: string}) {
    const router = useRouter()    

    function goToTopic(event:any) {
        event.stopPropagation();
        router.push(`/${username}/games/${topic.Name}`)
    }
    
    return (
        <div className="TopicCard" onClick={goToTopic}>
            <Image
                src={dsUrl}
                alt="Picture of the author"
                width={0}
                height={0}
                sizes="20vw"
                style={{ width: '100%', height: 'auto' }}
            />
            <div className="TopicDetails">
                <span>Post: {topic.PostCount}</span>
                <h3>Name: {topic.Name}</h3>
                <h2>Details: {topic.Description}</h2>
            </div>
        </div>
    )
}