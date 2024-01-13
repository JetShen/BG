import '@/styles/post.css';
import Image from 'next/image'

const ulrTest = 'https://img.freepik.com/premium-photo/anime-girl-shark-costume-holding-stuffed-animal-generative-ai_958124-30525.jpg'

export default function Post({i}:{i:number}) {

    return(
        <div className="PostObject">
            <div className="PostImage">
                <Image src={ulrTest} 
                  alt="Picture of the author"
                  width={0}
                  height={0}
                  sizes="100vw"
                  style={{ width: '100%', height: 'auto' }}   
                  className='profilePostImg' />
            </div>
            <div className="PostContent">
                <div className="minisection">
                  <strong className="username">UserName</strong>
                  <p className="userid">@username</p>
                </div>
                <div className="innerContent">
                {Array.from({ length: i }).map((_, j) => (              
                  <p key={j} >Lorem ipsum dolor sit amet consectetur adipisicing elit. Maiores nulla ipsum ipsam voluptatibus harum architecto voluptate nihil similique. Cumque fugit quos, autem ab sed atque. Laboriosam repudiandae nisi fugit qui?</p>
                ))}
                </div>
            </div>
        </div>
    );
}