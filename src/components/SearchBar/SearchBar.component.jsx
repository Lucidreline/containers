import React from 'react'
import './SearchBar.styles.scss'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'

const SearchBar = () => {
    return (
        <div className='search-bar-wrapper'>
            <input type="search" name="" id="search-bar" />
            <div className="search-icon-wrapper">
                <FontAwesomeIcon className='awesome-icon' icon={faMagnifyingGlass} />

            </div>
        </div>
    )
}

export default SearchBar
