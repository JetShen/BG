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
    if (data && data.posts) {
      console.log(data.posts)
      return data.posts;
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
  
    try {
      const res = await fetch('/api/post', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(PostObject)
      });
  
      if (res.ok) {
        queryClient.invalidateQueries({ queryKey: ['post']});
      } else {
        throw new Error("Error in post request");
      }
    } catch (error) {
      console.error('Error in MakePostMutated:', error);
    }
  }

  const mutation = useMutation({
    mutationFn: MakePostMutated,
    onSuccess: () => {
      setContentData('');
    }
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
          placeholder="Make a Post"
          onChange={update}
          value={ContentData}
        />
        <div className="PostOptions">
          <button type="submit">Post</button>
        </div>
      </form>
      <div className="testbox">
      {query.data?.map((post: PostType) => (
        <Post
          key={post.postId}
          Name={post.Name}
          Username={post.Username}
          Content={post.Content}
          postId={post.postId}
          UserId={post.UserId}
        />
      ))}
      </div>
    </>
  );
}
