import React from 'react'
import { useParams } from 'react-router-dom'


const Container = () => {
    const {id} = useParams()
  return (
    <div>Container {id}</div>
  )
}

export default Container
