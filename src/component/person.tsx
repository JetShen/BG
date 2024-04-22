import { UserType } from '@/type/post'
import Image from 'next/image'
import FollowFn from '@/client/follow'


function useFollow(){
    const followMutation = FollowFn({key: 'user'})
    const follow = async (FollowData: FormData) => {
        const result = await followMutation.mutateAsync(FollowData)
        return result
    }
    return follow
}

export default function Person({user, userid}: {user: UserType, userid: number}) {
    const followMutation = useFollow()
    
    async function HandleFollow() {
        console.log('Follow')
        const FollowData = new FormData()
        FollowData.append('userid', userid.toString())
        FollowData.append('followid', user.UserId.toString())
        const result = await followMutation(FollowData)
        console.log(result)
        
    }
    
    return (
        <li className="person">
            <Image src={user.ProfilePicture}
                alt="Picture of the author"
                width={0}
                height={0}
                sizes="100vw"
                style={{ width: '50%', height: 'auto' }}
                className='profilePostImg' />
            <div className="section">
                <h4 className="name">{user.Name}</h4>
                <p className="username">@{user.Username}</p>
                <button onClick={HandleFollow}>Follow</button>
            </div>
        </li>
    )
}