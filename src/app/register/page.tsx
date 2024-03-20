"use client";
import '@/styles/login.css';
import Image from 'next/image';
const googleLogo = 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/2048px-Google_%22G%22_logo.svg.png';
import Register from '@/client/registerFn';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';


const queryClient = new QueryClient()

export default function App(){
    return (
      <QueryClientProvider client={queryClient}>
        <RegisterPage />
      </QueryClientProvider>
    )
  }

function useRegister(){
    const registerMutation = Register();
    const registerUser = async (credentials: {name: string, username: string, email: string, password: string}) => {
        const status = await registerMutation.mutateAsync(credentials);
        return status;
    };
    return registerUser;
}

function RegisterPage(){
    const registerUser = useRegister();

    async function regisUser(e: any) {
        e.preventDefault();
        const name = e.target[0].value;
        const username = e.target[1].value;
        const email = e.target[2].value;
        const password = e.target[3].value;
        const confirmPassword = e.target[4].value;
        if(!password === confirmPassword){
            console.warn("Passwords do not match");
        }

        const credentials = {
            name: name,
            username: username,
            email: email,
            password: password
        }

        const status = await registerUser(credentials);
        if(status.status === 200){
            console.log("Registered");
        } else {
            console.log("Failed to register");
        }
    }

    return (
        <div className="logincard">
            <h1>Register</h1>
            <form className='LoginForm' onSubmit={regisUser}>
                <input type="text" placeholder="Name" />
                <input type="text" placeholder="Username" />
                <input type="email" placeholder="Email" />
                <input type="password" placeholder="Password" />
                <input type="password" placeholder="Password" />
                <button type="submit">Register</button>
            </form>
            <div className="loginOptions">
            <div className='loginOp'>
                <a href="/login">Login</a>
            </div>
                <Image src={googleLogo} alt="Google Logo" width={50} height={50} />
            </div>
        </div>
    )
}