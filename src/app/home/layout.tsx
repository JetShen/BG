import Image from 'next/image'
import '@/styles/main.css'
import Follow from "@/component/follow"
import Option from '@/component/option'

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
            <Image src="" alt="cat.jpg" className="profileImg" />
            <div className='section'>
                <h4 className="name">Name</h4>
                <p className="username">@username</p>
            </div>
            </div>
            <ul className="options">
                <Option />
            </ul>
        </div>
        <div className="main">
            {children}
        </div>
        <div className="follow">
          <Follow />
        </div>
        </div>
      </>
    )
  }
  