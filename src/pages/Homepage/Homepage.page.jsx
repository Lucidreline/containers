import React, { useState } from 'react'
import './Homepage.styles.scss'
import Nav from '../../components/Nav/Nav.component'
import Containers from '../../sections/Containers/Containers.section'
import Search from '../../sections/Search/Search.section'
import {
    BrowserRouter as Router,
    Route,
    Routes
  } from "react-router-dom";

const Homepage = () => {
    const [currentSection, setCurrentSection] = useState('search ')

    let section = <Containers />
    switch (currentSection) {
        case 'containers':
            section = <Containers />
            break;

        case 'search':
            section = <Search />
            break;

        default:
            section = <Containers />
            break;
    }

    return (
        <div className="homepage">
            <Router>
                <Nav />
                <div className="section-wrapper">
                    <Routes>
                        <Route path="/Search" element={<Search/>}>
                        </Route>
                        <Route path="/Containers" element={<Containers/>}>
                        </Route>
                    </Routes>
                </div>

            </Router>
        </div>
    )
}

export default Homepage
