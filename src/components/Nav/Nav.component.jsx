import React from 'react'
import './Nav.styles.scss'
import { Link } from 'react-router-dom'

const navItems = ['Search', 'Containers']

const Nav = () => {
    return (
        <div className="nav">
            <ul className="nav-list">
                {navItems.map(item => (
                    <Link to={`/${item}`} className='nav-item' key={item}>{item}</Link>
                ))}
            </ul>
        </div>
    )
}

export default Nav
