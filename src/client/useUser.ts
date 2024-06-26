import GetUser from '@/client/GET/fetchUser'

export default function useUser() {
    const userMutation = GetUser()
    const userData = async (username: string) => {
        const result = await userMutation.mutateAsync(username)
        return result
    };
    return userData
}