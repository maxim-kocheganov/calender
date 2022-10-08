import React, { Component} from 'react'
import './App.css';
import DayBlock  from './blocks/dayBlock'
import WeekBlock  from './blocks/weekBlock';
/*
 state = {
    day : [ {day_id:1, day:1, mounth:1, year:1}],
    week : [{week_id: 1}],
    mount : [{mount_id:1,mounth:1, year:1}],
    year : [{year_id:1, year:1}],
    current : {day:1, mount: 1, year: 1}
  }
*/
/**
currMounth:[
    {dayOfWeek:}
    {day:1, working:true},
    {day:2, working:true},
    {day:3, working:true}],
          currMounthType: {name:"Juan"}
 */
class App extends Component {
  state = {currMounth:[]}
  constructor(props) {
    super(props)
    let mounth = [];
    let day = 1;
    // j - week number
    for(let j = 1; j <= 4; j++)
    {
      let week = [];
      // i - week day number
      for(let i = 1; i <= 7; i++)
      {
        let _dayOff = false;
        if (i >= 6) // if day off
          _dayOff = true;
        week.push({day:day,dayOff:_dayOff});
        day++;
      }
      mounth.push(week)
    }
    this.state.currMounth = mounth;
  }
  constructMounth (days)
  {
    let content = [];
    days.forEach((week) => {
      let weekElem = [];
      week.forEach((day) => {
        weekElem.push(<DayBlock dayOff={day.dayOff}> {day.day} </DayBlock>)
      })
      content.push(<WeekBlock> {weekElem} </WeekBlock>)
    })
    return content
  }
 
  render()
  {
    let days = this.state.currMounth;
    return (
      <div className="App">
        {this.constructMounth(days)}        
      </div>
    );
  } 
}

export default App;
