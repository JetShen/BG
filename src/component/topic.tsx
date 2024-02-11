import '@/styles/topic.css'
import Image from 'next/image'

const dsUrl = 'https://myhotposters.com/cdn/shop/products/mL1833_1024x1024.jpg?v=1571445492'
// this component should be a card that displays the topic name and the number of Posts in that topic by the username
export default function Topic({topic}: {topic: {name: string, details: string}}){
    return (
        <div className="TopicCard">
            <Image
                src={dsUrl}
                alt="Picture of the author"
                width={0}
                height={0}
                sizes="20vw"
                style={{ width: '100%', height: 'auto' }}
            />
            <div className="TopicDetails">
                <h3>Name: {topic.name}</h3>
                <h2>Details: {topic.details}</h2>
            </div>
        </div>
    )
}