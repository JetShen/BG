import Follow from "@/component/follow"
import Option from '@/component/option'
import ProfileData from '@/component/profileData'


export default function RootLayout({
  
    children,
  }: {
    
    children: React.ReactNode
  }) {

    return (
        <>
        <div className="homeContainer">
          <div className="navegation">
            <ProfileData />
            <ul className="options">
              <Option username='usuario1' />
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
    );
}