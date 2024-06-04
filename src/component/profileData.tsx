'use client'
import '@/styles/ProfileData.css'
import Image from 'next/image'
const ulrTest = 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cc/Anime_Girl_with_cat.svg/1200px-Anime_Girl_with_cat.svg.png'
import { UserType } from '@/type/post'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import GetUser from '@/client/GET/getUser'
import { useRouter } from 'next/navigation'
const queryClient = new QueryClient()



export default function ProfileDataClient(){
    const dataUser = GetUser() as any
    if (!dataUser) {
        return null
    }
    const user = dataUser.user
    return (
        <QueryClientProvider client={queryClient}>
          <ProfileData user={user}/>
        </QueryClientProvider>
    )
}


function ProfileData({user}: {user: UserType}){
    const router = useRouter()


    
    return(
        <div className="ProfileDataBox">
            <div className="ProfileCard">
                <Image src={user.ProfilePicture ? user.ProfilePicture : ulrTest}
                alt="user pfp"
                width={0}
                height={0}
                sizes="100vw"
                style={{ width: '65%', height: 'auto', borderRadius: '10%', objectFit: 'cover', marginRight: '-10px'}}
                className='profilePostImg' />
                <div className="DataCard">
                    <div>
                        <span id='primary'><p>{user.Name}</p></span>
                        <span id='secondary'><p>@{user.Username}</p></span>
                    </div>
                    <div>
                        <span onClick={() => router.replace(`/${user?.Username}/following`)}>
                            <p id='secondary'>Following</p>
                            <p id='primary'>{user.Following}</p>
                        </span>
                        <span onClick={() => router.replace(`/${user?.Username}/followers`)}>
                            <p id='secondary'>Followers</p>
                            <p id='primary'>{user.Followers}</p>
                        </span>
                    </div>
                </div>
            </div>
        </div>
    )
}