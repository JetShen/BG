import '@/styles/modalreply.css';
import { useState } from 'react';

export default function ModalTopic({close, topic}: { close: Function, topic: Function}){
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');

    async function AddTopic(event: any){
        event.preventDefault();
        const topicContainer = document.querySelector('.TopicBox');
        if (topicContainer?.querySelector('.Topic')){
            topicContainer?.querySelector('.Topic')?.remove();
        }
        const topicBtn= document.createElement('button');
        topicBtn.className = 'Topic';
        topicBtn.innerHTML = name;
        topicContainer?.appendChild(topicBtn);
        // topic({name: name, description: description});
        close(event)
    }


    return (
        <div className="modal-overlay">
            <form onSubmit={AddTopic} className='replyBox'>
                <span onClick={()=>close(topic)}>&times;</span>
                <input type="text" id='topicName' onChange={(event) => setName(event.target.value) } placeholder="Name of Topic"/>
                <textarea name="Description" id='topicDesc' placeholder='Description' onChange={(event) => setDescription(event.target.value) }></textarea>
                <button type="submit">Add</button>
            </form>
        </div>
    )
}