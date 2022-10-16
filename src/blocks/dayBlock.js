import React from 'react'
import './dayBlock.css'

function Arrow(props, type, event)
{
    console.log(props, type, event)
}

function DayBlock(props)
{ 
    let classesDiv = ['dayBlock']
    if (props.selected === true)
    {
        classesDiv.push('selected')
    }
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
    
    let arrowsDivs =[
                    <div onClick={props.onClickCross}className={'close hoverable'}>
                        &#10006;
                    </div>,
                    <div className={'plus hoverable'}>
                        &#43;
                    </div>,
                    <div className={'arrow bottom hoverable'}>
                        &#8595;
                    </div>,
                    <div className='arrow top hoverable'>
                        &#8593;
                    </div>,
                    <div className='arrow left hoverable'>
                        &#8592;
                    </div>,
                    <div className='arrow right hoverable'>
                        &#8594;
                    </div>]
    
    if (props.selected != true)
        arrowsDivs = []

    return  <div className='daySpace'>
                <div onClick={props.onClickDay} className={classesDiv.join(" ")}>
                    <h1 className={classesText.join(" ")}>{props.children}</h1>                    
                </div>
                {arrowsDivs}
            </div> 
}

export default DayBlock