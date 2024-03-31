"use client"
import DeleteAcc from "@/client/deletAcc"
import useUser from "@/client/useUser";
import { UserType } from "@/type/post";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import PrivateAcc from "@/client/privateAcc";




const queryClient = new QueryClient()

export default function App(){
  return (
    <QueryClientProvider client={queryClient}>
      <Settings />
    </QueryClientProvider>
  )
}

function useDeleteAcc(){
    const accMutation = DeleteAcc()
    const accDelete = async (Username: string) => {
        const result = await accMutation.mutateAsync(Username)
        return result
    };
    return accDelete
}

function usePrivateAcc(){
    const accMutation = PrivateAcc()
    const accPrivate = async (Username: string) => {
        const result = await accMutation.mutateAsync(Username)
        return result
    };
    return accPrivate
}

function Settings(){
    const [username, setUsername] = useState('')
    const [user, setUser] = useState<UserType>()
    const getUser = useUser()
    const mutationDelete = useDeleteAcc()
    const mutationPrivate = usePrivateAcc()
   

    async function checkUser(username: string) {
        const result = await getUser(username)
        setUser(result.data.user)
    }

    useEffect(() => {
        setUsername(sessionStorage.getItem('session-id') || '')
    }, [])

    useEffect(() => {
        if (username === '') return
        checkUser(username)
    }, [username])

    async function handleDeleteAccount(){
        const status = await mutationDelete(user?.Username || '')
        if ( status.status === 200 ){
            sessionStorage.removeItem('session-id');
            window.location.href = '/login';
        }else{
            alert('Error deleting account');
        }
    }

    async function handlePrivate(){
        const status = await mutationPrivate(user?.Username || '')
        if ( status.status === 200 ){
            setUser((prevUser) => {
                if (prevUser) {
                    return {...prevUser, Private: prevUser.Private === 0 ? 1 : 0};
                }
                return prevUser;
            });
        } else {
            alert('Error making account private');
        }
    }

    if (user === undefined) return null;


    return (
        <>
            <h2>Settings</h2>
            <ul className="settingsOptions">
                <li><button onClick={handleDeleteAccount}>Delete Acount</button></li>
                <li><button>Change Password</button></li>
                <li><button>Change Email</button></li>
                <li><button>Change Username</button></li>
                <li><button onClick={handlePrivate}>{user.Private == 0 ? "Make Acc Private" : "Make Acc Public"}</button></li>
            </ul>
        </>
    )
}