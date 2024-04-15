"use client"
import { UserType } from "@/type/post";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import GetUser from "@/client/getUser";
import { useState } from "react";
import ChangePassword from "@/client/changepassword";
import login from '@/client/loginFn';
import bcrypt from "bcryptjs";


const queryClient = new QueryClient()

export default function App(){
    const dataUser = GetUser() as any
    if (!dataUser) {
        return null
    }
    const user = dataUser.user
  return (
    <QueryClientProvider client={queryClient}>
      <Password user={user}/>
    </QueryClientProvider>
  )
}

function useChangePss(){
    const passwordMutation = ChangePassword()
    const passwordChange = async (Credential: {UserId:number, Password:string}) => {
        const result = await passwordMutation.mutateAsync(Credential)
        return result
    };
    return passwordChange
}

function useLogin(){
    const loginMutation = login();
    const loginUser = async (credentials: {username: string, password: string}) => {
        const result = await loginMutation.mutateAsync(credentials);
        return result;
    };
    return loginUser;
}

function Password({user}: {user: UserType}){
    const loginUser = useLogin();
    const mutationPassword = useChangePss()
    const [OldPassword, setOldPassword] = useState('')
    const [NewPassword, setNewPassword] = useState('')
    const [ConfirmPassword, setConfirmPassword] = useState('')

    
    async function handleSubmit(e: any){
        e.preventDefault()
        const credentials = {
            username: user.Username,
            password: OldPassword
        };
        if(OldPassword === NewPassword){
            alert('New password is the same as the old password');
            return
        }
        if(NewPassword !== ConfirmPassword){
            alert('Password does not match');
            return
        }

        const result = await loginUser(credentials);
        const match: boolean = result.data.result.match;
        if(match){
            const hashedPassword = await bcrypt.hash(NewPassword, 10);
            const status = await mutationPassword({UserId: user.UserId, Password: hashedPassword})
            if ( status.status === 200 ){
                alert('Password changed successfully');
            }else{
                alert('Error changing password');
            }
        }else{
            alert('Invalid (Old) password');
        }
    }
    

    return (
        <div>
            <h1>Change Password</h1>
            <form onSubmit={handleSubmit}>
                <label>
                    Old Password:
                    <input type="password" value={OldPassword} onChange={(e) => setOldPassword(e.target.value)}/>
                </label>
                <label>
                    New Password:
                    <input type="password" value={NewPassword} onChange={(e) => setNewPassword(e.target.value)}/>
                </label>
                <label>
                    Confirm Password:
                    <input type="password" value={ConfirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}/>
                </label>
                <button type="submit">Submit</button>
            </form>
        </div>
    )
}
