import '@/styles/modaltopic.css';
import TopicFn from '@/client/topicfn';
import { useState } from 'react';

export default function ModalTopic({close}: { close: Function}){
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const mutationTopic = TopicFn({name: name, description: description, Key: 'post'});

    async function AddTopic(event: any){
        event.preventDefault();
        await mutationTopic.mutateAsync();
        close(event);
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