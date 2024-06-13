"use client"
import { UserType } from "@/type/post";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import GetUser from "@/client/GET/getUser";
import ChangeEmail from '@/client/PUT/changeemail';
import { useRouter } from "next/navigation";
import login from '@/client/GET/loginFn';
import { useState } from "react";


const queryClient = new QueryClient()

export default function App(){
    const dataUser = GetUser() as any
    if (!dataUser) {
        return null
    }
    const user = dataUser.user
  return (
    <QueryClientProvider client={queryClient}>
      <Username user={user}/>
    </QueryClientProvider>
  )
}

function useChangeEmail(){
    const mutation = ChangeEmail()
    const changeEmail = async (Credential: {UserId:number, Email:string}) => {
        const result = await mutation.mutateAsync(Credential)
        return result
    };
    return changeEmail

}

function useLogin(){
    const loginMutation = login();
    const loginUser = async (credentials: {username: string, password: string}) => {
        const result = await loginMutation.mutateAsync(credentials);
        return result;
    };
    return loginUser;
}

function Username({user}: {user: UserType}){
    const router = useRouter()
    const [Password, setPassword] = useState('')
    const [newEmail, setEmail] = useState('')
    const mutationEmail = useChangeEmail()
    const loginUser = useLogin()
    async function handleSubmit(e: any){
        e.preventDefault()
        const credentials = {
            username: user.Username,
            password: Password
        }
        
        const result = await loginUser(credentials)
        const match: boolean = result.data.result.match
        if(match){
            const result = await mutationEmail({UserId: user.UserId, Email: newEmail})
            if(result.status === 200){
                router.push('/settings')
                alert('Email changed successfully')
            }else{
                alert('Email change failed')
            }                
        }
    }
    return (
        <form onSubmit={handleSubmit} className="SettingsForm">
            <label >
                Email
                <input type="email" placeholder="New Email" value={newEmail} onChange={(e) => setEmail(e.target.value)}/>
            </label>
            <label>
                Password
                <input type="password" value={Password} onChange={(e) => setPassword(e.target.value)}/>
            </label>
            <button type="submit">Change Email</button>
        </form>
    )
}
