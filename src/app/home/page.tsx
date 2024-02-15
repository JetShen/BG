'use client';
import { useEffect, Fragment } from 'react';
import { QueryClient, QueryClientProvider} from '@tanstack/react-query';
import { useState } from 'react';
import Post from '@/component/Post';
import { PostType } from '@/type/post';
import { useInView } from 'react-intersection-observer'
import ModalTopic from '@/component/ModalTopic';
import FetchPostFn from '@/client/fetchpostfn';
import MakePostFn from '@/client/makepostfn';
import TopicFn from '@/client/topicfn';

const queryClient = new QueryClient()

export default function App(){
  return (
    <QueryClientProvider client={queryClient}>
      <Home />
    </QueryClientProvider>
  )
}


//idk if this is the best way to do this but it works
function useMakeTopic(topic: {name: string, description: string}) {
  const mutationTopic = TopicFn({name: topic.name, description: topic.description, Key: 'post'});
  const makeTopic = async () => {
    const status = await mutationTopic.mutateAsync();
    if (status.status === 200) {
      return status.data.topicId;
    }
    return 0;
  };
  
  return makeTopic;
}

function useMakePost() {
  const mutationPost = MakePostFn({ key: 'post'});
  const makePost = async (postData: { userid: number, content: string, topicId?: number }) => {
    const status = await mutationPost.mutateAsync(postData);
    return status;
  };
  return makePost;
}


// Todo: Add postState to the Home component this will be used to store the post data and make the code more readable. 
// idk what i want to say with the above comment
function Home() {
  const { ref, inView } = useInView()
  const [ContentData, setContentData] = useState<string>('');
  const [topicModal, setTopicModal] = useState<boolean>(false);
  const [topic, setTopic] = useState({name: '', description: '', id: 0});
  const makeTopic = useMakeTopic(topic); // this hook is used to make a topic and return the topicId
  const makePost = useMakePost(); // this hook is used to make a post
  
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

  async function ResolveMake(event: any) {
    event.stopPropagation();
    const inpuutElement = document.querySelector('.makePost input') as HTMLInputElement;
    makeTopic().then(async (topicId) => {
      const postData = { userid: 1, content: ContentData, topicId: topicId };
      const status = await makePost(postData);
      if (status.status === 200) {
        setContentData('');
        inpuutElement.value = '';
        setTopic({name: '', description: '', id: 0});
      }
    });
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
        <span>Topic:{topic.name}</span>
        <input
          contentEditable={true}
          placeholder="Make a Post"
          onChange={(event) => { setContentData(event.target.value) }}
          maxLength={255}
        />
        <div className="PostOptions">
          <button onClick={openTopicModal}>Add Topic</button>
          <button onClick={ResolveMake}>Post</button>
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
