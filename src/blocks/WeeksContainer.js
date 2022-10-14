import React from 'react'
import './WeeksContainer.css'

function WeeksContainer(props)
{ 
    return  <div className='weeksContainer'>
                {props.children}
            </div>  
}

export default WeeksContainer