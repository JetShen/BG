import Image from "next/image"
import '@/styles/selectedPost.css'

export default function PostPage({params}: any){
    return(
    <>
        <div className="BoxPost">
            <div className="BoxIMG"></div>
            <div className="BoxContent">
                <div className="BoxHeader">
                    <strong>Name</strong>
                    <p>@username</p>
                </div>
                <div className="BoxText">
                    <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Sapiente quia odio voluptatem, qui sint dolore, nulla mollitia incidunt accusantium esse magnam, quisquam quos ducimus cum eum quasi voluptates animi velit?</p>
                </div>
                <div className="BoxGalery"></div>
                <div className="BoxOptions">
                    <button>Coment</button>
                    <button>Share</button>
                    <button>Like</button>
                </div>
            </div>
        </div>
        <div className="BoxReply"></div>
    </>
    )
}