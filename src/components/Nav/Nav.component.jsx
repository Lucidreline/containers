import React from 'react'
import './Nav.styles.scss'
import { Link } from 'react-router-dom'


const Nav = () => {
    return (
        <div className="nav">
            <ul className="nav-list">
                <Link to='search' className='nav-item' >Browse</Link>
                <Link to='/' className='nav-item' >Containers</Link>
            </ul>
        </div>
    )
}

export default Nav
