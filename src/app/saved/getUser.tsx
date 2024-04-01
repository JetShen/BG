// component to obtain user data != password from the database
import { useEffect, useState } from 'react';
import axios from "axios";
import { UserType } from '@/type/post';

export default function GetUser() {
    const [user, setUser] = useState<UserType>();
    const username = (sessionStorage as Storage).getItem('session-id') || '';

    useEffect(() => {
        console.log(`fetching user data for ${username}...`)
        const fetchUser = async () => {
            try {
                const res = await axios.get(`/api/profile/user?username=${username}`);
                console.log(res.data)
                setUser(res.data);
            } catch (err) {
                console.log(err);
            }
        };

        fetchUser();
    }, []);


    return user;
}