'use client';
import { useEffect, Fragment } from 'react';
import { QueryClient, QueryClientProvider} from '@tanstack/react-query';
import { useState } from 'react';
import Post from '@/component/Post';
import { PostType, UserType } from '@/type/post';
import { useInView } from 'react-intersection-observer'
import ModalTopic from '@/component/ModalTopic';
import FetchPostFn from '@/client/fetchpostfn';
import MakePostFn from '@/client/makepostfn';
import TopicFn from '@/client/topicfn';
import Image from 'next/image'
import MiniIMG from '@/component/uploadIMG';
import MakeImg from '@/client/makeImg';
import ProtectedRoute from '@/client/protectedRoute';
import useUser from '@/client/useUser';

const queryClient = new QueryClient()

export default function App(){
  return (
    <QueryClientProvider client={queryClient}>
      <Home />
    </QueryClientProvider>
  )
}

const mediaType = ['image/jpeg', 'image/png', 'image/gif', 'image/jpg', 'image/webp', 'image/svg+xml', 'image/bmp', 'image/tiff', 'image/x-icon' ];
const mp4Type = ['video/mp4', 'video/quicktime', 'video/webm', 'video/x-msvideo', 'video/x-flv', 'video/3gpp', 'video/x-matroska', 'video/avi', 'video/mpeg', 'video/ogg'];
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

function useMakePost(WaitImg:boolean) {
  const mutationPost = MakePostFn({ key: 'post', WaitImg});
  const makePost = async (postData: { userid: number, content: string, topicId?: number }) => {
    const status = await mutationPost.mutateAsync(postData);
    return status;
  };
  return makePost;
}

function useMakeImg(key: string) {
  const mutationImg = MakeImg({ key });
  const makeImg = async (fileData: FormData) => {
    const status = await mutationImg.mutateAsync(fileData);
    return status;
  };
  return makeImg;

}


// Todo: Add postState to the Home component this will be used to store the post data and make the code more readable. 
// idk what i want to say with the above comment
function Home() {
  const { ref, inView } = useInView()
  const [ContentData, setContentData] = useState<string>('');
  const [topicModal, setTopicModal] = useState<boolean>(false);
  const [topic, setTopic] = useState({name: '', description: '', id: 0});
  const [WaitImg, setWaitImg] = useState(false);
  const makeTopic = useMakeTopic(topic); // this hook is used to make a topic and return the topicId
  const makePost = useMakePost(WaitImg); // this hook is used to make a post
  const makeImg = useMakeImg('post'); // this hook is used to upload images
  const [files, setFiles] = useState<File[] | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [username, setUsername] = useState('')
  const [user, setUser] = useState<UserType>()
  const getUser = useUser()

  //uploading images
  const [uploading, setUploading] = useState(false);
  const [uploadErrors, setUploadErrors] = useState<string[]>([]);

  useEffect(() => {
    files?.length ?? 0 > 0 ? setWaitImg(true) : setWaitImg(false);
  }
  , [files]);
  async function checkUser(username: string) {
    const result = await getUser(username)
    setUser(result.data.user)
  }

  async function getuser(){
    return user;
  }

  useEffect(() => {
    setUsername(sessionStorage.getItem('session-id') || '')
  }, [])

  useEffect(() => {
    if (username === '') return
    checkUser(username)
  }, [username])


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

  useEffect(() => {
    const handleDragStart = () => setIsDragging(true);
    const handleDragEnd = () => setIsDragging(false);
  
    window.addEventListener("dragstart", handleDragStart);
    window.addEventListener("dragend", handleDragEnd);
  
    return () => {
      window.removeEventListener("dragstart", handleDragStart);
      window.removeEventListener("dragend", handleDragEnd);
    };
  }, []);

  const handleDragOver = (e: React.DragEvent<HTMLTextAreaElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const element = document.querySelector('.contentInput') as HTMLTextAreaElement;

  
    element.style.borderColor = "blue";
    element.style.borderStyle = "dashed";
    element.style.borderWidth = "2px";
  };


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
    const dummyUser = await getuser();
    const userId = dummyUser?.UserId;
    console.log(dummyUser, userId);
    if (dummyUser === undefined || userId === undefined) return alert(`please login user: ${dummyUser} userId: ${userId}`);
  
    const inputElement = document.querySelector('.contentInput') as HTMLInputElement;
    const topicId = topic.name !== '' ? await makeTopic() : 0;
    const postData = { userid: userId, content: ContentData, topicId };
    const status = await makePost(postData);
    const id = status.data.id.insertId;
    if (status.status === 200) {
      setContentData('');
      inputElement.value = '';
      setTopic({ name: '', description: '', id: 0 });
      if(files?.length ?? 0 > 0){
        handleUpload(event, id);
        setFiles(null);
      }
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

  // img function section
  const handleDrop = (event: any) => {
    event.preventDefault();
    const droppedFiles = Array.from(event.dataTransfer.files) as File[];
    const MAX_IMAGES = 4; 
    // Check if the number of images is greater than the maximum allowed if so remove the first images to make space for the new ones
    // [1,2,3,4] + 2 IMG = [3,4,5,6]
    const currentImageCount = files ? files.length : 0;
    const imagesToRemove = Math.max(0, currentImageCount + droppedFiles.length - MAX_IMAGES);
    const newFiles = files ? files.slice(imagesToRemove) : [];
    const finalFiles = [...newFiles, ...droppedFiles];

    for (const file of finalFiles) {
      if (!mediaType.includes(file.type) && !mp4Type.includes(file.type)){
        setUploadErrors([...uploadErrors, `${file.name} is not an image.`]);
        finalFiles.splice(finalFiles.indexOf(file), 1);
        continue;
      }
      if (file.size > 2 * 1024 * 1024) {
        setUploadErrors([...uploadErrors, `${file.name} is too large.`]);
        finalFiles.splice(finalFiles.indexOf(file), 1);
        continue;
      }
      if (file.size === 0) {
        setUploadErrors([...uploadErrors, `${file.name} is empty.`]);
        finalFiles.splice(finalFiles.indexOf(file), 1);
        continue;
      }
    }
  
    setFiles(finalFiles);
    const element = document.querySelector('.contentInput') as HTMLTextAreaElement;
    element.style.border = "none";
  };

  const handleUpload = async (event: any, id: number) => {
    event.preventDefault();

    setUploading(true);

    if (!files) {
      setUploadErrors(['Please select at least one image.']);
      setUploading(false);
      return;
    }

    for (const file of Array.from(files)){
      try {
        const formData = new FormData();
        formData.append("file", file as Blob)
        formData.append("id", id.toString());

        const status = await makeImg(formData);
        if (status.status !== 200) {
          setUploadErrors([...uploadErrors, `Error uploading ${file.name}: ${status.data.error}`]);
        }

      } catch (error: any) {
        setUploadErrors([...uploadErrors, `Error uploading ${file.name}: ${error.message}`]);
      }
    }
    setUploading(false);
  };
  

  const deleteIMG = (index: number) => {
    const newFiles = files ? files.filter((_, i) => i !== index) : [];
    setFiles(newFiles);
  }

  if ( user === undefined) return <div>Loading...</div>;
  return (
    <ProtectedRoute>
      <div className="makePost">
        <span>Topic:{topic.name}</span>
        <textarea
          typeof='testbox'
          className='contentInput'
          contentEditable={true}
          placeholder='What is on your mind?'
          onChange={(event) => setContentData(event.target.value)}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          value={ContentData}
          maxLength={255}
        >
        </textarea>
        {files?.length ?? 0 > 0 ? <div className="Galery">
          {files &&  Array.from(files).map((file, index) => (
            <MiniIMG key={index} index={index} deleteIMG={deleteIMG} file={file} />
          ))}
        </div>: null}
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
            user={user}
          />
          ))}
        </Fragment>
      ))}
      </div>
      <div>
        {isFetching && !isFetchingNextPage ? 'Background Updating...' : null}
      </div>
      {topicModal && <ModalTopic close={closeTopicModal} topic={setTopic} />}
    </ProtectedRoute>
  );
}
