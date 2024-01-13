import '@/styles/profile.css'
import Navbar from '@/component/Navbar'
import Follow from '@/component/follow'
import Image from 'next/image'
const ulrTest = 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cc/Anime_Girl_with_cat.svg/1200px-Anime_Girl_with_cat.svg.png'


export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <div className="PfContainer">
        <div className="infoContainer">
          <div className="miniInfo">
            <Image src={ulrTest}
              alt="Picture of the author"
              width={0}
              height={0}
              sizes="100vw"
              style={{ width: '50%', height: 'auto' }}
              className='profilePostImg' />
            <strong>Username</strong>
            <p>@username</p>
          </div>
        </div>
        <div className="postContainer">
          <div className="pfNav">
            <Navbar />
          </div>
          <div className="MainContainer">
            {children}
          </div>
        </div>
        <div className="followContainer">
          <Follow />
        </div>
      </div>
    </>
  )
}
