'use client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useRouter } from 'next/navigation'
import GetUser from '@/client/GET/getUser'
import { UserType } from '@/type/post';
import Image from 'next/image'


const queryClient = new QueryClient()

export default function App({params}:any){
  const dataUser = GetUser() as any
  if (!dataUser) {
      return null
  }
  const user = dataUser.user
  return (
    <QueryClientProvider client={queryClient}>
      <Navbar  userClient={user}/>
    </QueryClientProvider>
  )
}

function Navbar({ userClient}: { userClient: UserType}) {
  const router = useRouter()


  if(!userClient){ return null}

  return (
    <div className='pfNav'>
      <div className="Top-Name">
        <div>
          <p>{userClient.Username}</p>
        </div>
      </div>
      <div className="ProfilePic-data">
        <div className="ProfileBackground">
        </div>
        <div className="Profile-data">
          <Image  
            className='ProfilePfp'
            src={userClient.ProfilePicture}
            alt="Picture of the author"
            width={0}
            height={0}
            sizes="100vw"
            style={{ width: '100%', height: 'auto' }}
          ></Image>
          <div className="Profile-Info-Data">
            <div>
              <p id='secondary'>Following</p>
              <p id='primary'>{userClient.Following}</p>
            </div>
            <div>
              <p id='secondary'>Followers</p>
              <p id='primary'>{userClient.Followers}</p>
            </div>
          </div>
        </div>
      </div>
      <div className="Profile-Menu">
      <button type="button" onClick={() => router.replace(`/${userClient.Username}/games`)}>
          Games
        </button>
        <button type="button" onClick={() => router.replace(`/${userClient.Username}/posts`)}>
          Posts
        </button>
        <button type="button" onClick={() => router.replace(`/${userClient.Username}/media`)}>
          Media
        </button>
        <button type="button" onClick={() => router.replace(`/${userClient.Username}/likes`)}>
          Likes
        </button>
      </div>
    </div>
  )
}

