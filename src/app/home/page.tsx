import Post from '@/component/Post'

export default function Home(){
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