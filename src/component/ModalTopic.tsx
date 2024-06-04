import '@/styles/modaltopic.css';
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
        <div className="ModalContent">
            <div className="ModalHeader">
                <button onClick={()=>close(event)}>Close</button>
            </div>
            <form onSubmit={AddTopic}>
                <input type="text" onChange={(event) => setName(event.target.value) } placeholder="Name of Topic"/>
                <label htmlFor="Description">
                    <textarea name="Description" onChange={(event) => setDescription(event.target.value) } cols={30} rows={10}></textarea>
                </label>
                <button type="submit">Add</button>
            </form>
        </div>
    )
}