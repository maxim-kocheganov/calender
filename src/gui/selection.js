import React from 'react'
import './selection.css'

function Selection(props)
{ 
    let date = props.date
    let dateEncoded
    if (date != null) // If something selected
    {
    dateEncoded =   String(date.year) + '-' +
             ( date.month < 10 ? ('0' + String(date.month)) : String(date.month)) + '-' +
             ( date.day < 10 ? ('0' + String(date.day)) : String(date.day))
    }
    else
    {
        dateEncoded = ""
        date = {day:"",month:"",year:"",weekday:""}
    }
    
    return  <div className='selection'>
            <div className='selectionControls'>
                <input onInput={props.onDateChange} type="date" value={dateEncoded}/>
                <div>
                    <div classname='selectionRow'>
                        <h5>Day</h5>
                        <div>
                            <input className='inputButton'  type="button" value='-'/>
                            <input className='inputNumber'  type="text" value={date.day}/>
                            <input className='inputButton'  type="button" value='+'/>
                        </div>
                    </div>
                    <div classname='selectionRow'>
                        <h5>Month</h5>
                        <div>
                            <input className='inputButton'  type="button" value='-'/>
                            <input className='inputNumber'  type="text" value={date.month}/>
                            <input className='inputButton'  type="button" value='+'/>
                        </div>
                    </div>
                    <div classname='selectionRow'>
                        <h5>Year</h5>
                        <div>
                            <input className='inputButton'  type="button" value='-'/>
                            <input className='inputNumber'  type="text" value={date.year}/>
                            <input className='inputButton'  type="button" value='+'/>
                        </div>
                    </div>
                    <div classname='selectionRow'>
                        <h5>Weekday</h5>
                        <div>
                            <input className='inputButton'  type="button" value='-'/>
                            <input className='inputNumber'  type="text" value={date.weekday}/>
                            <input className='inputButton'  type="button" value='+'/>
                        </div>
                    </div>
                </div>
                <div>
                    <div>
                    <div classname='selectionRow'>
                        <input type="button" value="Add date" />
                    </div>
                    </div>
                </div>
            </div>
                <input onClick={props.onClickSave} type="button" value="Save" />
                <input onClick={props.onClickDiscard} type="button" value="Discard" />
            </div>
}

export default Selection