"use client";
import { useRouter } from 'next/navigation';
import login from '@/client/loginFn';
import '@/styles/login.css';
import Image from 'next/image';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { cookies } from "next/headers";

const googleLogo = 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/2048px-Google_%22G%22_logo.svg.png';
const queryClient = new QueryClient()

export default function App(){
    return (
      <QueryClientProvider client={queryClient}>
        <LoginPage />
      </QueryClientProvider>
    )
} 

function useLogin(){
    const loginMutation = login();
    const loginUser = async (credentials: {username: string, password: string}) => {
        const status = await loginMutation.mutateAsync(credentials);
        return status;
    };
    return loginUser;
}

function LoginPage(){
    const router = useRouter();
    const loginUser = useLogin();

    async function checkCredentials(e: any)  {
        e.preventDefault();
        const username = e.target[0].value;
        const password = e.target[1].value;

        const credentials = {
            username: username,
            password: password
        };

        const status = await loginUser(credentials);
        if(status.status === 200){

            router.push('/home')
        } else {
            console.log("Failed to login");
        }
    }

    return(
        <div className="logincard">
            <h1>Login</h1>
            <form className='LoginForm' onSubmit={checkCredentials}>
                <input type="text" placeholder="Username" />
                <input type="password" placeholder="Password" />
                <button type="submit">Login</button>
            </form>
            <div className="loginOptions">
            <div className='loginOp'>
                <a href="#">Forgot Password?</a>
                <a href="/register">Sign Up</a>
            </div>
                <Image src={googleLogo} alt="Google Logo" width={50} height={50} />
            </div>
        </div>
    )
}