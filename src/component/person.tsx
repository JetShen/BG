import Image from 'next/image'

export default function Person(){
    return (
        <li className="person">
            <Image src="" alt="cat.jpg" className="profileImg" />
            <div className="section">
            <h4 className="name">Name</h4>
            <p className="username">@username</p>
            </div>
        </li>
    )
}