import { useState } from 'react';
import { UserType } from '@/type/post';
import Image from 'next/image';
import FollowFn from '@/client/POST/follow';
import '@/styles/personSearch.css';

function useFollow() {
    const followMutation = FollowFn({ key: 'user' });
    const follow = async (FollowData: FormData) => {
        const result = await followMutation.mutateAsync(FollowData);
        return result;
    };
    return follow;
}

export default function PersonSearch({ user, userid }: { user: UserType, userid: number }) {
    const followMutation = useFollow();
    const [isFollowing, setIsFollowing] = useState(user.FollowedBy === userid);

    async function handleFollow() {
        console.log(isFollowing ? 'Unfollow' : 'Follow');
        const FollowData = new FormData();
        FollowData.append('userid', userid.toString());
        FollowData.append('followid', user.UserId.toString());
        const result = await followMutation(FollowData);
        console.log(result);

        // Toggle the follow state based on the result
        if (result.status) {
            setIsFollowing(!isFollowing);
        }
    }
    
    return (
        <li className="personSearch">
            <Image
                src={user.ProfilePicture}
                alt="Picture of the author"
                width={0}
                height={0}
                sizes="12vh"
                style={{ width: 'auto', height: '100%', fill: 'cover'}}
                className="PersonPfp"
            />
            <div className="personSearchInfo">
                <div className="miniPersonInfo">
                    <h4 className="PersonName" id='primary'>{user.Name}</h4>
                    <p className="PersonUsername" id='secondary'>@{user.Username}</p>
                </div>
                <button onClick={handleFollow}>
                    {isFollowing ? 'Unfollow' : 'Follow'}
                </button>
            </div>
        </li>
    );
}
