"use client"
import { UserType } from "@/type/post";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import GetUser from "@/client/GET/getUser";
import { useState } from "react";
import ChangePicture from "@/client/PUT/changepicture";
import Image from "next/image";
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
      <Picture user={user}/>
    </QueryClientProvider>
  )
}

function useChangePfp(){
    const pictureMutation = ChangePicture()
    const pictureChange = async (Credential: FormData) => {
        const result = await pictureMutation.mutateAsync(Credential)
        return result
    };
    return pictureChange
}

function Picture({user}: {user: UserType}){
    const [file, setFile] = useState<Blob | null>(null);
    const changePfp = useChangePfp();
    const router = useRouter();


    async function handlePictureChange(){
        if (!file){
            return;
        }
        const data = new FormData();
        data.append('UserId', user.UserId.toString());
        data.append('Picture', file as Blob);
        const result = await changePfp(data);
        if (result.status === 200){
            router.push('/settings');
        }
    }

    function handleFileChange(e: React.ChangeEvent<HTMLInputElement>){
        const file = e.target.files?.[0];
        console.log(file);
        if (!file){
            return;
        }
        setFile(file);
    }

    return (
        <form className="SettingsForm">
            <h1>Change Picture</h1>
            <label htmlFor="">
                <input type="file" onChange={handleFileChange}/>
            </label>
            <button onClick={handlePictureChange}>Change Picture</button>
        </form>
    )
}
