import React from 'react'
import './Search.styles.scss'
import SearchBar from '../../components/SearchBar/SearchBar.component'
import ItemSearchResult from '../../components/ItemSearchResult/ItemSearchResult.component'

const Search = () => {
    return (
        <div className='search-section'>
            <div className="search-bar-section-wrapper">
                <SearchBar />
            </div>
            <ItemSearchResult />
        </div>
    )
}

export default Search
