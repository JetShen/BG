'use client'
import "@/styles/follow.css"
import { useRouter } from 'next/navigation'
import '@/styles/follow.css'
import Person from './person'
import { UserType } from '@/type/post'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import GetUser from '@/client/GET/getUser'
import GetUsers from '@/client/GET/getUsers'
import { useEffect, useState } from 'react'


const queryClient = new QueryClient()

export default function ProfileDataClient() {
  const dataUser = GetUser() as any
  if (!dataUser) {
    return null
  }
  const user = dataUser.user
  return (
    <QueryClientProvider client={queryClient}>
      <MiniFollow user={user} />
    </QueryClientProvider>
  )
}

function useUsers() {
  const ussMutation = GetUsers()
  const ussList = async (userid: number) => {
    const result = await ussMutation.mutateAsync(userid)
    return result
  };
  return ussList
}



function MiniFollow({ user }: { user: UserType }) {
  const router = useRouter()
  const mutationUsers = useUsers()
  const [list, setList] = useState<UserType[]>([])

  async function handleGetUsers() {
    const result = await mutationUsers(user.UserId)
    setList(result.data.users)
  }

  useEffect(() => {
    handleGetUsers()
  }, [])

  

  return (
    <div className="follow">
      <div className="logoSection">
        <button type="button" onClick={() => router.replace('/home')}>
          Home
        </button>

      </div>
      <div className="people">
        <div className="PeopleBox">
          {list && list.map((person) => (
            <Person key={person.UserId} user={person} userid={user.UserId} />
          ))}
        </div>
      </div>  
    </div>
  )
}