import '@/styles/post.css';
import Image from 'next/image'

export default function Post({i}:{i:number}) {

    return(
        <div className="PostObject">
          <div className="miniSection">
            <Image src="" alt="cat.jpg" className="profileImg" />
            <div className='section'>
              <h5 className="name">Name</h5>
              <p className="username">@username</p>
            </div>
          </div>
          <div className="innerContent">
            {Array.from({ length: i }).map((_, j) => (              
              <p key={j} >Lorem ipsum dolor sit amet consectetur adipisicing elit. Maiores nulla ipsum ipsam voluptatibus harum architecto voluptate nihil similique. Cumque fugit quos, autem ab sed atque. Laboriosam repudiandae nisi fugit qui?</p>
            ))}
          </div>
        </div>
    );
}