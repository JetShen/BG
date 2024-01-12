'use client'
import Post from '@/component/Post'

export default function Home(){

  async function test(){
    const res = await fetch('/api/pets',{
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
    });
    console.log(res);
  }

  async function test2(){
    const res = await fetch('/api/insert',{
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
    });
    console.log(res);
  }
  
  return (
      <>
      <div className="makePost">
        <textarea name="" id="" cols={30} rows={10}></textarea>
      </div>
      <Post i={3} />
      <Post i={1} />
      <Post i={2} />
      </>
  )
}