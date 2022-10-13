import React from 'react'
import './dayBlock.css'
function DayBlock(props)
{ 
    let classesDiv = ['dayBlock']
    if (props.dayOff === true)
        classesDiv.push('dayOff')
    if (props.currentMonth === false)
    {
        classesDiv.push('notCurrentMonth')
        if (props.hideGray)
        classesDiv.push('hidden')
    }
    //if (props.hiLight === )
    let classesText = ['day']
    return  <div onClick={props.onClick} className={classesDiv.join(" ")}>
                <h1 className={classesText.join(" ")}>{props.children}</h1>
            </div>  
}

export default DayBlock