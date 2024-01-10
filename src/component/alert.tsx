import Image from 'next/image'

export default function Alert(){
    return(
        <div className="event">
            <div className="eventIcon">
                <Image src="/assets/icons/notifications/like.svg" alt="like" />
            </div>
            <div className="eventText">
                <h4>John Doe </h4>
                <span>liked your post</span>
            </div>
        </div>
    )
}