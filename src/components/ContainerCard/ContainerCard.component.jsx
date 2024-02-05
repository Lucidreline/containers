import React from 'react'
import './ContainerCard.styles.scss'

const ContainerCard = () => {
    return (
        <div className="container-card">
            <div className="card-top">
                <h3 className="container-name">Container A</h3>
                <hr />
                <span>Tools and Outdoors</span>
            </div>
            <div className="card-bottom">
                <div className="card-image" style={{ backgroundImage: `url(https://favim.com/pd/p/orig/2019/02/25/shrek-cringe-funny-Favim.com-6942809.jpg)` }}></div>
            </div>

        </div>
    )
}

export default ContainerCard
