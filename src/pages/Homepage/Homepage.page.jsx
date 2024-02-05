import React from 'react'
import './Homepage.styles.scss'
import Nav from '../../components/Nav/Nav.component'
import Containers from '../Containers/Containers.page'

const Homepage = () => {
    return (
        <div className="homepage">
            <Nav />
            <div className="section-wrapper">
                <Containers />

            </div>
        </div>
    )
}

export default Homepage
