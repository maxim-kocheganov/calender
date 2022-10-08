import React from 'react'
import './dayBlock.css'
function DayBlock(props)
{ 
    let classes = ['dayBlock']
    if (props.dayOff == true)
        classes.push('dayOff')
    return  <div className={classes.join(" ")}>
                <h1 className='day'>{props.children}</h1>
            </div>  
}

export default DayBlock