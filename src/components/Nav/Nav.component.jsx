import React from 'react'
import './Nav.styles.scss'

const navItems = ['Search', 'Browse']

const Nav = () => {
    return (
        <div className="nav">
            <ul className="nav-list">
                {navItems.map(item => (
                    <li key={item} className="nav-item">{item}</li>
                ))}
            </ul>
        </div>
    )
}

export default Nav
