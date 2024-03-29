'use client';
import { useQuery, useMutation, QueryClientProvider, QueryClient, useQueryClient} from '@tanstack/react-query';
import { useState } from 'react';
import Post from '@/component/Post';
import { PostType } from '@/type/post';


const queryClient = new QueryClient()

export default function App(){
  return (
    <QueryClientProvider client={queryClient}>
      <Home />
    </QueryClientProvider>
  )
}


function Home() {
  const [ContentData, setContentData] = useState<string>('');
  const queryClient = useQueryClient()

  
  async function fetchPosts() {
    console.log("fetching posts")
    const res = await fetch('/api/searchP',{
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
    });
    const data = await res.json();
    if (data && data.result) {
      console.log(data.result.rows)
      return data.result.rows;
    } else {
      throw new Error("Unexpected response format");
    }
  }

  const query = useQuery({ queryKey: ['post'], queryFn: fetchPosts })

  async function MakePostMutated(event: any) {
    const PostObject = {
      content: ContentData,
      userid: 1,
    }
    console.log(PostObject);

    const res = await fetch('/api/post', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(PostObject)
    });
    
  }

  const mutation = useMutation({
    mutationFn: MakePostMutated,
    onSuccess: () => {
      queryClient.refetchQueries({ queryKey: ['posts'], type: 'active' })
      setContentData('')
    },
  })

  function makePost(event: any) {
    event.preventDefault();
    mutation.mutate({ content: ContentData, userid: 1 });
  }

  function update(event: any) {
    setContentData(event.target.value);
  }

  return (
    <>
      <form onSubmit={makePost} className="makePost">
        <input
          contentEditable={true}
          className="PostArea"
          placeholder="Make a Post"
          onChange={update}
          value={ContentData}
        />
        <div className="PostOptions">
          <button type="submit">Post</button>
        </div>
      </form>
      {query.data?.map((post: PostType) => (
        <Post
          key={post.postid}
          name={post.name}
          username={post.username}
          content={post.content}
          postid={post.postid}
          userid={post.userid}
        />
      ))}
    </>
  );
}
