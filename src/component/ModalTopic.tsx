import '@/styles/modaltopic.css'

export default function ModalTopic({close}: { close: Function}){
    const AddTopic = (event: any) => {
        event.preventDefault();
        const Toppic = {
            name: event.target[0].value,
            description: event.target[1].value
        }
        console.log('Add Topic');
        console.log(Toppic);
    }


    return (
        <div className="ModalContent">
            <div className="ModalHeader">
                <button onClick={()=>close(event)}>Close</button>
            </div>
            <form onSubmit={AddTopic}>
                <input type="text" placeholder="Name of Topic"/>
                <label htmlFor="Description">
                    <textarea name="Description" cols={30} rows={10}></textarea>
                </label>
                <button type="submit">Add</button>
            </form>
        </div>
    )
}