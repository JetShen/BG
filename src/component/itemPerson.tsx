import { useState } from 'react';
import { UserType } from '@/type/post';
import Image from 'next/image';
import FollowFn from '@/client/POST/follow';
import { UserIcon } from '@/svg/icons';
import '@/styles/itemPerson.css';

function useFollow() {
    const followMutation = FollowFn({ key: 'user' });
    const follow = async (FollowData: FormData) => {
        const result = await followMutation.mutateAsync(FollowData);
        return result;
    };
    return follow;
}

export default function ItemPerson({ user, userid }: { user: UserType, userid: number }) {
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
        <div className="ItemPerson">
            <div className="PfpContainer">
                <Image
                    src={user.ProfilePicture}
                    alt="Picture of the author"
                    width={0}
                    height={0}
                    sizes="100vh"
                    style={{ width: '80%', height: 'auto' }}
                />
            </div>
            <div className="personData">
                <p className="name" id='primary'>{user.Name}</p>
                <p className="username" id='secondary'>@{user.Username}</p>
            </div>
            <div className="BtnPerson">
                <button onClick={handleFollow}>
                    <UserIcon/> {isFollowing ? 'Unfollow' : 'Follow'}
                </button>
            </div>
        </div>
    );
}
