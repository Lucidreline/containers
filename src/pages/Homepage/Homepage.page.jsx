import React from 'react'
import './Homepage.styles.scss'
import Nav from '../../components/Nav/Nav.component'
import Containers from '../../sections/Containers/Containers.section'
import Search from '../../sections/Search/Search.section'

const Homepage = () => {
    return (
        <div className="homepage">
            <Nav />
            <div className="section-wrapper">
                <Search />
            </div>
        </div>
    )
}

export default Homepage
