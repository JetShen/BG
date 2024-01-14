'use client'
import Post from '@/component/Post'
import { useState } from 'react';
import { PostType } from '@/type/post';

export default function Home() {
  const [ContentData, setContentData] = useState<string>('');

  async function MakePost(event: any) {
    event.preventDefault();
    const PostObject: PostType = {
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
        <input contentEditable={true} className='PostArea' onChange={update}></input>
        <div className="PostOptions">
          <button type='submit'>Post</button>
        </div>
      </form>
      <Post i={3} />
      <Post i={1} />
      <Post i={5} />
    </>
  )
}