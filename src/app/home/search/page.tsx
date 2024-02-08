import '@/styles/search.css';

export default function Search(){
    return (
        <div className='searchDiv'>
            <input type="text" className="SearchInput"  placeholder="Search..."/>
            <div className="resultPeople"></div>
            <div className="resultPost"></div>
        </div>
    );
}