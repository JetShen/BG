'use client';
import '@/styles/notifications.css'
import  { Fragment, useEffect } from 'react';
import { QueryClient, QueryClientProvider,} from '@tanstack/react-query';
import { NotificationFollow, NotificationPost, NotificationType, UserType } from '@/type/post';
import { useInView } from 'react-intersection-observer'
import FetchNotification from '@/client/GET/fetchNotificationFn';
import GetUser from '@/client/GET/getUser';
import { useRouter } from 'next/navigation';
import { SettingsIcon } from '@/svg/icons';
import AlertPost from '@/component/alert';
import AlertFollow from '@/component/alertFollow';

const queryClient = new QueryClient()

export default function App({params}:any){
  const { username } = params;
  const dataUser = GetUser() as any
  if (!dataUser) {
      return null
  }
  const user = dataUser.user
  return (
    <QueryClientProvider client={queryClient}>
      <Home username={username} userClient={user}/>
    </QueryClientProvider>
  )
}


function Home({username, userClient}: {username: string, userClient:UserType} ) {
  const { ref, inView } = useInView()
  const { data, fetchNextPage, fetchPreviousPage } = FetchNotification(userClient.UserId);
  const router = useRouter()

  const trackScrolling = () => {
    const wrappedElement = document.getElementsByClassName('main')[0]
    if (wrappedElement === null) {
      return;
    }

    if (wrappedElement.scrollTop === 0) {
      fetchPreviousPage();
  }

    if (wrappedElement.scrollHeight - wrappedElement.scrollTop === wrappedElement.clientHeight) {
      fetchNextPage();
    }
  };

  useEffect(() => {
    const scrollElement = document.getElementsByClassName('main')[0]
    scrollElement?.addEventListener('scroll', trackScrolling);
    
    return () => {
      scrollElement?.removeEventListener('scroll', trackScrolling);
    };
  }, []);


  useEffect(() => {
    if (inView) {
      fetchNextPage()

    }
  }, [fetchNextPage, inView])

  if(userClient === undefined) return (<div>Loading...</div>)

  return (
    <>
      <div className="Header">
        <p>Notifications</p>
        <button><SettingsIcon/></button>
      </div>
      <div className='NotificationMain'>
      {data?.pages.map((page, index) => (
        <Fragment key={index}>
          {page.notifications.map((notification: NotificationType | NotificationFollow) => {
            if (notification.Type === 'Follow') {
              return <AlertFollow key={notification.NotificationId} props={notification as NotificationFollow}/>
            } else {
              return <AlertPost key={notification.NotificationId} props={notification as NotificationPost} KeyMutation={"NotificationList"} user={userClient}/>
            }
          })}
        </Fragment>
      ))}
      </div>
    </>
  );
}
