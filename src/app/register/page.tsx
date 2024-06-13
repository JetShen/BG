"use client";
import '@/styles/login.css';
import Image from 'next/image';
const googleLogo = 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/2048px-Google_%22G%22_logo.svg.png';
import Register from '@/client/POST/registerFn';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import bcrypt from "bcryptjs";
import { useRouter } from 'next/navigation';


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
    const registerUser = async (fileData: FormData) => {
        const status = await registerMutation.mutateAsync(fileData);
        return status;
    };
    return registerUser;
}


function RegisterPage(){
    const registerUser = useRegister();
    const router = useRouter();


    const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    function isValidEmailFormat(email: string): boolean {
        return emailRegex.test(email);
    }

    async function regisUser(e: any) {
        e.preventDefault();
        console.log( "register object")
        const name = e.target[0].value;
        const pfp = e.target[1].files[0];
        const username = e.target[2].value;
        const email = e.target[3].value;
        const password = e.target[4].value;
        const confirmPassword = e.target[5].value;
        if(!password === confirmPassword){
            console.warn("Passwords do not match");
            return;
        }
        if(!isValidEmailFormat(email)){
            console.warn("Invalid email format");
            return;
        }
        if(!pfp){
            console.warn("No profile picture");
            return;
        }
        
        
        const hashedPassword = await bcrypt.hash(password, 10);

        const credentials = new FormData();
        credentials.append('name', name);
        credentials.append('username', username);
        credentials.append('email', email);
        credentials.append('password', hashedPassword);
        credentials.append('pfp', pfp as Blob);
        const status = await registerUser(credentials);
        if(status.status === 200){
            console.log("Registered successfully");
            router.push('/login');
        } else {
            console.log("Failed to register");
        }
    }

    return (
        <div className="logincard">
            <h1>Register</h1>
            <form className='LoginForm' onSubmit={regisUser}>
                <input type="text" placeholder="Name" />
                <input type="file" placeholder='pfp' />
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