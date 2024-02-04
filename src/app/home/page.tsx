'use client';
import { useEffect, Fragment } from 'react';
import { QueryClient, QueryClientProvider,} from '@tanstack/react-query';
import { useState } from 'react';
import Post from '@/component/Post';
import { PostType } from '@/type/post';
import { useInView } from 'react-intersection-observer'
import ModalTopic from '@/component/ModalTopic';
import FetchPostFn from '@/client/fetchpostfn';
import MakePostFn from '@/client/makepostfn';

const queryClient = new QueryClient()

export default function App(){
  return (
    <QueryClientProvider client={queryClient}>
      <Home />
    </QueryClientProvider>
  )
}
// Todo: Add postState to the Home component this will be used to store the post data and make the code more readable
function Home() {
  const { ref, inView } = useInView()
  const [ContentData, setContentData] = useState<string>('');
  const [topicModal, setTopicModal] = useState<boolean>(false);
  const [topic, setTopic] = useState<string>('');

  

  const handleScroll = () => {
    const mainElement = document.querySelector('.main');
    if (!mainElement) return;
  
    const { scrollTop, scrollHeight, clientHeight } = mainElement;
    if (scrollTop === 0) { // top of the page 
      fetchPreviousPage();
    }
  
    if (scrollHeight - scrollTop === clientHeight) { // bottom of the page
      fetchNextPage();
    }
  };

  useEffect(() => {
    const mainElement = document.querySelector('.main') as HTMLElement;
    if (!mainElement) return;

    mainElement.addEventListener('scroll', handleScroll);

    return () => {
      mainElement.removeEventListener('scroll', handleScroll);
    };
  }, []);


  const {
    data,
    isFetching,
    isFetchingNextPage,
    fetchNextPage,
    fetchPreviousPage,
  } = FetchPostFn();

  useEffect(() => {
    if (inView) {
      fetchNextPage()
    }
  }, [fetchNextPage, inView])

  const mutationPost = MakePostFn({key: 'post', Post: {content: ContentData, userid: 1}});

  async function makePost(event: any) {
    console.log('makePost');
    event.preventDefault();
    const inpuutElement = document.querySelector('.makePost input') as HTMLInputElement;
    const status = await mutationPost.mutateAsync();
    if (status.status === 200) {
      setContentData('');
      inpuutElement.value = '';
    }
  }

  const openTopicModal = (event: any ) => {
    event.stopPropagation();
    setTopicModal(true);
  };
  

  const closeTopicModal = (event:any) => {
    event.stopPropagation()
    setTopicModal(false);
  };

  return (
    <>
      <div className="makePost">
        <span>Topic:{topic}</span>
        <input
          contentEditable={true}
          placeholder="Make a Post"
          onChange={(event) => { setContentData(event.target.value) }}
          maxLength={255}
        />
        <div className="PostOptions">
          <button onClick={openTopicModal}>Add Topic</button>
          <button onClick={makePost}>Post</button>
        </div>
      </div>
      <div className="testbox">
      {data?.pages.map((page, index) => (
        <Fragment key={index}>
          {page.posts.map((post: PostType) => (
            <Post
            key={post.PostID}
            props={post}
            KeyMutation="post"
          />
          ))}
        </Fragment>
      ))}
      </div>
      <div>
        {isFetching && !isFetchingNextPage ? 'Background Updating...' : null}
      </div>
      {topicModal && <ModalTopic close={closeTopicModal} topic={setTopic} />}
    </>
  );
}
