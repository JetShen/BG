"use client"
import { UserType } from "@/type/post";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import GetUser from "@/client/getUser";
import { useRouter } from "next/navigation";
import ChangeUsername from "@/client/changeusername";
import login from '@/client/loginFn';
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

function useChangeUsername(){
    const mutation = ChangeUsername()
    const changeUsername = async (Credential: {UserId:number, Username:string}) => {
        const result = await mutation.mutateAsync(Credential)
        return result
    };
    return changeUsername

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
    const [Username, setUsername] = useState('')
    const [Password, setPassword] = useState('')
    const [ConfirmPassword, setConfirmPassword] = useState('')
    const mutationUsername = useChangeUsername()
    const loginUser = useLogin()
    async function handleSubmit(e: any){
        e.preventDefault()
        const credentials = {
            username: user.Username,
            password: Password
        }
        if(Password !== ConfirmPassword){
            alert('Password does not match')
            return
        }
        const result = await loginUser(credentials)
        const match: boolean = result.data.result.match
        if(match){
            const result = await mutationUsername({UserId: user.UserId, Username})
            if(result.status === 200){
                router.push('/settings')
                alert('Username changed successfully')
            }else{
                alert('Username change failed')
            }                
        }
    }
    return (
        <div>
            <form onSubmit={handleSubmit}>
                <input type="text" value={Username} onChange={(e) => setUsername(e.target.value)} placeholder="Username"/>
                <input type="password" value={Password} onChange={(e) => setPassword(e.target.value)} placeholder="Password"/>
                <input type="password" value={ConfirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Confirm Password"/>
                <button type="submit">Submit</button>
            </form>
        </div>
    )
}
