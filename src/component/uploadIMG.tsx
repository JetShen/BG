


export default function MiniIMG(props:{index: number, deleteIMG: Function, file: File}){

    return (
        <div className="IMG-box">
        <span className="Bttn-rm" onClick={() => props.deleteIMG(props.index)}>x</span>
        <img className={'GaleryImg-'+(props.index+1)} key={props.index} src={URL.createObjectURL(props.file)} alt={props.file.name}/>
        </div>
    )
}