import Post from '@/component/Post'

export default function Home(){
    return (
        <>
        <div className="makePost">
          <textarea name="" id="" cols={30} rows={10}></textarea>
        </div>
        <Post />
        <Post />
        </>
    )
}