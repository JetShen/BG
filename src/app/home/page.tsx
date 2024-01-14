'use client'
import Post from '@/component/Post'
import { useState, useEffect } from 'react';
import { PostType } from '@/type/post';

export default function Home() {
  const [ContentData, setContentData] = useState<string>('');
  const [Posts, setPosts] = useState<PostType[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const posts = await getPosts();
      setPosts(posts);
      console.log(posts);
    }
    fetchData();
  }, []);

  async function getPosts() {
    try {
      const res = await fetch('/api/searchP');
      const data = await res.json();
      if (data && data.result) {
        return data.result.rows;
      } else {
        console.error("Unexpected response format:", data);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }
  

  async function MakePost(event: any) {
    event.preventDefault();
    const PostObject = {
      content: ContentData,
      userid: 1,
    }

    const res = await fetch('/api/post', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(PostObject)
    });

    if (res.ok) {
      setContentData('');
    } else {
      console.error('Error al realizar la solicitud:', res.statusText);
    }

  }

  function update(event: any) {
    setContentData(event.target.value);
  }

  

  return (
    <>
      <form onSubmit={MakePost} className="makePost">
        <input contentEditable={true} className='PostArea' placeholder='Make a Post' onChange={update}></input>
        <div className="PostOptions">
          <button type='submit'>Post</button>
        </div>
      </form>
      {Posts.map((post: PostType) => {
        return (
          <Post
            key={post.postid}
            name={post.name}
            username={post.username}
            content={post.content}
            postid={post.postid}
            userid={post.userid}
          />
        )
        })
      }
    </>
  )
}