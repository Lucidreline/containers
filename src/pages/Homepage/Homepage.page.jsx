import React, { useState } from 'react'
import './Homepage.styles.scss'
import Nav from '../../components/Nav/Nav.component'
import Containers from '../../sections/Containers/Containers.section'
import Search from '../../sections/Search/Search.section'

const Homepage = () => {
    const [currentSection, setCurrentSection] = useState('search')

    let section = <Containers/>
    switch (currentSection) {
        case 'containers':
            section = <Containers/>
            break;

        case 'search':
            section = <Search/>
            break;

        default:
            section = <Containers/>
            break;
    }

    return (
        <div className="homepage">
            <Nav />
            <div className="section-wrapper">
                {section}
            </div>
        </div>
    )
}

export default Homepage
