import '@/styles/profile.css'
import Navbar from '@/component/Navbar'


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
          <img src="" alt="cat.jpg" className="profileImg" />
          <span >@Jetshen</span>
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
      <div className="followContainer"></div>
    </div>
    </>
  )
}
