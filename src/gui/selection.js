import React from 'react'
import './selection.css'

function Selection(props)
{ 
    let date = props.date
    if (date != null) // If something selected
    {
    date =   String(date.year) + '-' +
             ( date.month < 10 ? ('0' + String(date.month)) : String(date.month)) + '-' +
             ( date.day < 10 ? ('0' + String(date.day)) : String(date.day))
    }
    else
    {
        date = ""
    }
    
    return  <div className='selection'>
            <div className='selectionControls'>
                <input onInput={props.onDateChange} type="date" value={date}/>
            </div>
                <input onClick={props.onClickSave} type="button" value="Save" />
                <input onClick={props.onClickDiscard} type="button" value="Discard" />
            </div>
}

export default Selection