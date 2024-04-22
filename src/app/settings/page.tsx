"use client"
import DeleteAcc from "@/client/DELETE/deletAcc"
import { UserType } from "@/type/post";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import PrivateAcc from "@/client/PUT/privateAcc";
import GetUser from "@/client/GET/getUser";
import { useRouter } from "next/navigation";





const queryClient = new QueryClient()

export default function App(){
    const dataUser = GetUser() as any
    if (!dataUser) {
        return null
    }
    const user = dataUser.user
  return (
    <QueryClientProvider client={queryClient}>
      <Settings user={user}/>
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

function Settings({user}: {user: UserType}){
    const router = useRouter()    
    const mutationDelete = useDeleteAcc()
    const mutationPrivate = usePrivateAcc()
   

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
            window.location.reload();
            } else {
            alert('Error making account private');
        }
    }

    function handlePassword(){
        router.push('/settings/password')
    }

    function handleUsername(){
        router.push('/settings/username')
    }

    function handlePicture(){
        router.push('/settings/picture')
    }


    if (user === undefined) return null;


    return (
        <>
            <h2>Settings</h2>
            <ul className="settingsOptions">
                <li><button>Change Email</button></li>
                <li><button onClick={handlePicture}>Change Profile Picture</button></li>
                <li><button onClick={handlePassword}>Change Password</button></li>
                <li><button onClick={handleUsername}>Change Username</button></li>
                <li><button onClick={handlePrivate}>{user.Private == 0 ? "Make Acc Private" : "Make Acc Public"}</button></li>
                <li><button onClick={handleDeleteAccount}>Delete Acount</button></li>
            </ul>
        </>
    )
}