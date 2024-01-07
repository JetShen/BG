'use client'
import { useRouter } from "next/navigation"
import '@/styles/main.css'
import Follow from "@/component/follow"


export default function RootLayout({
    children,
  }: {
    children: React.ReactNode
  }) {
    const router = useRouter()

    return (
      <>
        <div className="homeContainer">
        <div className="navegation">
            <div className="miniN">
            <img src="" alt="cat.jpg" className="profileImg" />
            <div className='section'>
                <h4 className="name">Name</h4>
                <p className="username">@username</p>
            </div>
            </div>
            <ul className="options">
                <li>Post</li>  {/* this should open a modal */} 
                <li className="option" onClick={() => router.replace('/home')}>Home</li>
                <li className="option" onClick={() => router.replace('/home/notifications')}>Notification</li>
                <li className="option" onClick={() => router.replace('/home/search')}>Search</li>
                <li className="option" onClick={() => router.replace('/profile')}>Profile</li>
                <li className="option" onClick={() => router.replace('/settings')}>Settings</li>
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
  