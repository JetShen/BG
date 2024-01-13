import Image from 'next/image'
const ulrTest = 'https://img.freepik.com/premium-photo/anime-girl-shark-costume-holding-stuffed-animal-generative-ai_958124-30525.jpg'

export default function Person() {
    return (
        <li className="person">
            <Image src={ulrTest}
                alt="Picture of the author"
                width={0}
                height={0}
                sizes="100vw"
                style={{ width: '50%', height: 'auto' }}
                className='profilePostImg' />
            <div className="section">
                <h4 className="name">Name</h4>
                <p className="username">@username</p>
            </div>
        </li>
    )
}