import React from 'react'
import './ContainerCard.styles.scss'
import { Link } from 'react-router-dom'

const ContainerCard = ({containerId}) => {
    return (
        <Link to={`/container/${containerId}`}>
        <div className="container-card">
            <div className="card-top">
                <h3 className="container-name">Container {containerId}</h3>
                <hr />
                <span className='card-description'>Tools and Outdoors</span>
            </div>
            <div className="card-bottom">
                <div className="card-image" style={{ backgroundImage: `url(https://favim.com/pd/p/orig/2019/02/25/shrek-cringe-funny-Favim.com-6942809.jpg)` }}></div>
            </div>

        </div>
        </Link>
    )
}

export default ContainerCard
