import React from 'react'
import './Homepage.styles.scss'
import Nav from '../../components/Nav/Nav.component'
import Containers from '../../sections/Containers/Containers.section'
import Search from '../../sections/Search/Search.section'
import {
    BrowserRouter as Router,
    Route,
    Routes
} from "react-router-dom";
import Container from '../../sections/Container/Container.section'

const Homepage = () => {
    return (
        <div className="homepage">
            <Router>
                <Nav />
                <div className="section-wrapper">
                    <Routes>
                        <Route path="/Search" element={<Search />}>
                        </Route>
                        <Route path="/" element={<Containers />}>
                        </Route>
                        <Route path="/container/:id" element={<Container />}></Route>
                    </Routes>
                </div>
            </Router>
        </div>
    )
}

export default Homepage
