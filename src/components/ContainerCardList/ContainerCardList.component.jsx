import React from 'react'
import './ContainerCardList.styles.scss'
import ContainerCard from '../ContainerCard/ContainerCard.component'

// Change this!!
const containerIds = ["A", "B", "C"]

const ContainerCardList = () => {
    return (
        <div className="container-card-list">
            {containerIds.map(id => (
                <ContainerCard containerId={id} key={id}/>
            ))}
     
        </div>
    )
}

export default ContainerCardList
