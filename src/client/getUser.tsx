// component to obtain user data != password from the database
import { useEffect, useState } from 'react';
import axios from "axios";
import { UserType } from '@/type/post';

export default function GetUser() {
    const [user, setUser] = useState<UserType>();

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await axios.get(`/api/profile/user?username=${sessionStorage.getItem('session-id') || ''}`);
                setUser(res.data);
            } catch (err) {
                console.log(err);
            }
        };

        fetchUser();
    }, []);


    return user;
}