import React, { Component} from 'react'
import './App.css';
import DayBlock  from './blocks/dayBlock'
import WeekBlock  from './blocks/weekBlock'
import WeeksContainer from './blocks/WeeksContainer'
import Selection from './gui/selection'

class App extends Component {
  state = {selected : null,
           months:[]}

  /////
  ///// CALCULATION FUNCTIONS
  /////

  // Return true is year is leap
  returnLeapYear = (year) =>
    {
      let leapYear = false;
      if ((year % 400) === 0)
      {
        leapYear = true;
      }
      else if ((year % 100) === 0)
      {
        leapYear = true;
      }
      else if ((year % 4) === 0)
      {
        leapYear = true;
      }
      return leapYear
  }

  // Return number of week day
  weekday = (year, month, day, rusStyleWeekday = true) =>
    {
      if (month < 3)
      {
        year -= 1;
        month += 10;
      }
      else
        month -= 2
      let weekday = ((day + parseInt(31 * month / 12) + year + parseInt(year / 4) - parseInt(year / 100) + parseInt(year / 400)) % 7)
      if (rusStyleWeekday)
        weekday = (weekday + 6) % 7
      return weekday
    }

  // Return day count in given month
  returnMonthCount = (isLeap, month) =>
    {
      let monthAtArray = month - 1;
      const lookUpMonthTable = [31,28,31,
                     30,31,30,
                     31,31,30,
                    31,30,31];
      if (isLeap === true && month === 2)
        return 29
      else 
        return lookUpMonthTable[monthAtArray]

  }
  
  // Construct calender and return
  constructMonthes(yearStart, yearEnd)
  {
    let res = []
    for(let yearCur = yearStart; yearCur <= yearEnd; yearCur++)
    {
      for(let monthCur = 1; monthCur <= 12; monthCur++)
      {
        let daysCount = this.returnMonthCount(this.returnLeapYear(yearCur),monthCur)
        res.push({year:yearCur, month:monthCur,days:daysCount})
      }      
    }
    return res;
  }

  constructor(props) {
    super(props)
    this.state.months = this.constructMonthes(1990,2030)
  }

  /////
  ///// GENERATING CALENDAR VIEW
  /////

  // Return json of the month (raw)
  // Format: {month:month, day:dayCurr, weekday:weekday}
  // Last argument - russian or USA style dates
  // 1st call
  generateJsonOfMounth(monthGiven,yearGiven, rusStyleWeekday = true)
  {
    // year table - ordered by month and year
    // {year, month, days (28-31)}
    let yearTable = []
    this.state.months.forEach(element => {
        if (element.year === yearGiven)
          yearTable.push(element)
        if (element.year === (yearGiven - 1) && element.month === 12)
          yearTable.push(element)
        if (element.year === (yearGiven + 1) && element.month === 1)
          yearTable.push(element)
    });
    // console.log(yearTable)
    // [0] - prev year last month
    // [1-12] - curr year mounthes
    // [13] - next year first mont
    if (yearTable.length !== 14)
      throw Error('YearTable out of bounds')
    let daysCountInPrevMonth = yearTable[monthGiven - 1].days;
    let daysCountInThisMonth = yearTable[monthGiven].days;
    //let dayCountInNextMounth = yearTable[monthGiven + 1].days;

    /* 
    console.log('daysCountInPrevMonth', daysCountInPrevMonth)
    console.log('daysCountInThisMonth', daysCountInThisMonth)
    console.log('dayCountInNextMounth', dayCountInNextMounth)
    */
    let res = [];
    let weekday = 0;
    let month = 0;
    for (let day_i = -8; day_i < 31 + 8; day_i++)
    {      
      let dayCurr = day_i;
      // Generate prev, curr, next week numbers
      if (dayCurr <= 0) // prev month
      {
        dayCurr += daysCountInPrevMonth
        weekday = this.weekday(yearGiven,monthGiven - 1,dayCurr)
        let prevMount = monthGiven - 1;
        if (prevMount === 0)
          prevMount = 12
        month = prevMount
      }
      else if (dayCurr >= 1 && dayCurr <= daysCountInThisMonth) // current month
      {
        weekday = this.weekday(yearGiven,monthGiven,dayCurr)
        month = monthGiven
      }
      else if (dayCurr > daysCountInThisMonth) // next month
      {        
        dayCurr = dayCurr - daysCountInThisMonth        
        let nextMonth = monthGiven + 1
        if (nextMonth === 13)
          nextMonth = 1
        month = nextMonth
        weekday = this.weekday(yearGiven,nextMonth,dayCurr)
        //console.log('month', month, 'dayCurr', dayCurr, 'weekday', weekday)
      }

      if (rusStyleWeekday)
        weekday = (weekday + 6) % 7
      res.push({ day:dayCurr, month:month, year:yearGiven, weekday:weekday})
      //console.log('monthGiven',month,'dayCurr',dayCurr,'weekday',weekday)      
    }
    //console.log("raw",res)
    return res
  }

  // Filter out the unseen days of the month calender
  // It takes json with surplus days (usually +- 7 days on endge)
  // 2nd call
  filterJsonOfMounth(jsonMonth, month)
  {
    let resFiltred = [] // Filter out unseenable days
    let skipp = false;
    jsonMonth.forEach( (elem, index, arr) => {   
      if (skipp === false)   
      {
        let prevMonth = month - 1;
        if (prevMonth === 0)
          prevMonth = 12
        let nextMonth = month + 1;
        if (nextMonth === 13)
          nextMonth = 1
        if (elem.month === prevMonth) // add prev month days
        {
          let nextElem = index;
          if (index + 1 < arr.length)
            nextElem = arr[index + 1]
          if (nextElem.month === month)
          {       
            for(let indexLocal = index - elem.weekday; indexLocal <= index; indexLocal++)
            {
              resFiltred.push(arr[indexLocal])
            }
          }
        }      
        else if (elem.month === month) // add current month items
        {
          resFiltred.push(elem)
        }
        else if (elem.month === nextMonth) // add next days items
        {
          for(let day = index; day < 7 - elem.weekday + index; day++)
          {
            resFiltred.push(arr[day])
            skipp = true
          }
        }
      }
    } )
    return resFiltred
  }

  // Paint day off
  // Last argument - russian or USA style dates
  // 3rd call
  paintJsonMonth(jsonMonth, month, rusStyleWeekday = true)
  {
    let res = []    
    jsonMonth.forEach( (elem) => {
      // Decide which days are off
      let dayOff = false
      if (rusStyleWeekday)
      {
        if ((elem.weekday === 5) || (elem.weekday === 6))
        {
          dayOff = true
        }
      }
      else
      {
        if ((elem.weekday === 6) || (elem.weekday === 0))
        {
          dayOff = true
        }
      }
      
      let currentMonth = false;
      if (elem.month === month)
        currentMonth = true
      //let alterWeekday = 0
      //alterWeekday = (elem.weekday + 6) % 7
      //res.push({ ...elem, currentMonth: currentMonth, dayOff:dayOff})
      
      let isSelected = false
      if (this.state.selected != null &&
          this.state.selected.day === elem.day &&
          this.state.selected.month === elem.month &&
          this.state.selected.year === elem.year &&
          this.state.selected.weekday === elem.weekday)
          {
            isSelected = true
          }
      res.push({ ...elem, currentMonth: currentMonth, dayOff:dayOff, selected:isSelected})
    })
    //console.log(res)
    return res
  }

  // Construct given month HTML
  // hideNonRelated hide gray days
  constructHTMLMounth (monthGiven, yearGiven, hideNonRelated)
  {
    let content = []
    let jsonMonth= this.generateJsonOfMounth(monthGiven, yearGiven)
    jsonMonth = this.filterJsonOfMounth(jsonMonth,monthGiven)
    jsonMonth = this.paintJsonMonth(jsonMonth, monthGiven)
    jsonMonth.forEach( (elem, index, arr) => {
      let localContent = []
      if (elem.weekday === 0)
      {
        for(let dayOfWeek = 0; dayOfWeek < 7; dayOfWeek++)
        {
          let weekdayElem = arr[index + dayOfWeek];
          localContent.push(<DayBlock 
            onClick={this.clickDay.bind(this, 
              {day:weekdayElem.day, month:weekdayElem.month,
              year:weekdayElem.year, weekday:weekdayElem.weekday}                                        )} 
            hideGray={hideNonRelated} key={String(Math.random()) + elem.day}
            selected={weekdayElem.selected} 
            currentMonth={weekdayElem.currentMonth} 
            dayOff={weekdayElem.dayOff}>{weekdayElem.day}</DayBlock>)
        }
        content.push(<WeekBlock key={String(Math.random()) + elem.day}>{localContent}</WeekBlock>)
      }      
    } )
    return content
  }

  /////
  ///// GENERATING VIEW
  /////

  /////
  ///// CALLBACKS
  /////

  clickDay(packedDay, event)
  {
    console.log(packedDay)
    this.setState((state, props) => {      
      return {selected : {day:packedDay.day,
                             month:packedDay.month,
                             year:packedDay.year,
                             weekday:packedDay.weekday}}
    })
  }

  clickSave(event)
  {
    //console.log(event)
    console.log('save')
    debugger
  }

  clickDiscard(event)
  {
    console.log('disc')
    this.setState({selected : null})
  }

  onDateChange(event)
  {
    let value = event.target.value
    value = String(value).split('-')
    value = { day:parseInt(value[2]),
      month:parseInt(value[1]),
      year:parseInt(value[0])
    }
    value = {...value, weekday : this.weekday(value.year,value.month,value.day)} // TODO: fix weekday calculation
    console.log(value)
    this.setState( { selected :  value})
  }

  render()
  {
    let calender = []
    for(let month = 1; month <= 12; month++)
    {
      calender.push(this.constructHTMLMounth(month,2022, true))
    }
    
    return (
      <div className="App">
        <WeeksContainer>
          {calender}
        </WeeksContainer>
        <Selection 
          date={this.state.selected} 
          onClickSave={this.clickSave.bind(this)} onClickDiscard={this.clickDiscard.bind(this)}
          onDateChange={this.onDateChange.bind(this)}
        ></Selection>
                
      </div>
    );    
  } 
}

export default App;
