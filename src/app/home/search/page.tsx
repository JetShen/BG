"use client";
import { useState } from 'react';
import '@/styles/search.css';
import App from '@/component/searchBox';
import { useInView } from 'react-intersection-observer';


export default function Search() {
    const [query, setQuery] = useState<string>('');
    const [search, setSearch] = useState<boolean>(false);


  
    function activateSearch(event: any) {
      event.preventDefault();
      const input = event.target.querySelector('.SearchInput');
      setQuery(input.value);
      setSearch(true);
    }
  
    return (
      <div className='searchDiv'>
        <form className="boxSearch" onSubmit={activateSearch}>
          <input type="text" className="SearchInput" placeholder="Search..." />
          <button type='submit'>Search</button>
        </form>

        <div className="resultPeople">
        </div>
        {search && <App query={query} />}
      </div>
    );
  }
