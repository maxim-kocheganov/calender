import React from 'react'
import './weekBlock.css'
function WeekBlock(props)
{ 
    return  <div className='weekBlock'>
                {props.children}
            </div>  
}

export default WeekBlock