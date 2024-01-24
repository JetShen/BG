import Image from 'next/image'
import '@/styles/main.css'
import Follow from "@/component/follow"
import Option from '@/component/option'
const ulrTest = 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cc/Anime_Girl_with_cat.svg/1200px-Anime_Girl_with_cat.svg.png'

export default function RootLayout({
    children,
  }: {
    children: React.ReactNode
  }) {

    return (
      <>
        <div className="homeContainer">
        <div className="navegation">
            <div className="miniN">
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
            <ul className="options">
                <Option />
            </ul>
        </div>
        <div className="main">
            {children}
        </div>
        <div className="follow">
        </div>
        </div>
      </>
    )
  }
  