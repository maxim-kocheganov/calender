import React from 'react'
import './dayBlock.css'

function DayBlock(props)
{ 
    let arrowsDivs =[
        <div onClick={props.onClickCross}className={'close hoverable'}>
            &#10006;
        </div>,
        <div className={'plus hoverable'}>
            &#43;
        </div>,
        <div onClick={props.onClickArrow_down} className={'arrow bottom hoverable'}>
            &#8595;
        </div>,
        <div onClick={props.onClickArrow_up} className='arrow top hoverable'>
            &#8593;
        </div>,
        <div onClick={props.onClickArrow_left} className='arrow left hoverable'>
            &#8592;
        </div>,
        <div onClick={props.onClickArrow_right} className='arrow right hoverable'>
            &#8594;
        </div>]
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
        {
            classesDiv.push('hidden')
            arrowsDivs = []
        }
    }
    
    //if (props.hiLight === )
    let classesText = ['day']
    
    if (props.selected !== true)
        arrowsDivs = []        

    return  <div className='daySpace'>
                <div onClick={props.onClickDay} className={classesDiv.join(" ")}>
                    <h1 className={classesText.join(" ")}>{props.children}</h1>                    
                </div>
                {arrowsDivs}
            </div> 
}

export default DayBlock