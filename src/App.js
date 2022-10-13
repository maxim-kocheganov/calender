import React, { Component} from 'react'
import './App.css';
import DayBlock  from './blocks/dayBlock'
import WeekBlock  from './blocks/weekBlock';

class App extends Component {
  state = {currMounth:[],months:[]}

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
  weekday = (year, month, day) =>
    {
      if (month < 3)
      {
        year -= 1;
        month += 10;
      }
      else
        month -= 2
      return ((day + parseInt(31 * month / 12) + year + parseInt(year / 4) - parseInt(year / 100) + parseInt(year / 400)) % 7)
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
    this.state.months = this.constructMonthes(2021,2023)
    /*    
    this.calender();
    let mounth = [];
    let day = 1;
    let year = 2022;
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
    */

  }

  // Return json of the month 
  // Format: {month:month, day:dayCurr, weekday:weekday}
  generateJsonOfMounth(monthGiven,yearGiven)
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
      throw 'YearTable out of bounds'
    let daysCountInPrevMonth = yearTable[monthGiven - 1].days;
    let daysCountInThisMonth = yearTable[monthGiven].days;
    let dayCountInNextMounth = yearTable[monthGiven + 1].days;
    /* 
    console.log('daysCountInPrevMonth', daysCountInPrevMonth)
    console.log('daysCountInThisMonth', daysCountInThisMonth)
    console.log('dayCountInNextMounth', dayCountInNextMounth)
    */
    let res = [];
    let weekday = 0;
    let month = 0;
    for (let day_i = -7; day_i < 31 + 7; day_i++)
    {      
      let dayCurr = day_i;
      // Generate prev, curr, next week numbers
      if (dayCurr <= 0)
      {
        dayCurr += daysCountInPrevMonth
        weekday = this.weekday(yearGiven,monthGiven - 1,dayCurr)
        month = monthGiven - 1
      }
      else if (dayCurr >= 1 && dayCurr <= daysCountInThisMonth)
      {
        weekday = this.weekday(yearGiven,monthGiven,dayCurr)
        month = monthGiven
      }
      else if (dayCurr > daysCountInThisMonth)
      {
        dayCurr = dayCurr - daysCountInThisMonth
        weekday = this.weekday(yearGiven,monthGiven + 1,dayCurr)
        month = monthGiven + 1
      }
      res.push({month:month, day:dayCurr, weekday:weekday})
      //console.log('monthGiven',month,'dayCurr',dayCurr,'weekday',weekday)      
    }
    
    return res
  }
  // Filter out the unseen days of the month calender
  // It takes json with surplus days (usually +- 7 days on endge)
  filterJsonOfMounth(jsonMonth, month)
  {
    let resFiltred = [] // Filter out unseenable days
    let skipp = false;
    jsonMonth.forEach( (elem, index, arr) => {   
      if (skipp == false)   
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
  // Paint day off & shift weekday (so week starts from monday)
  paintJsonMonth(jsonMonth, month)
  {
    let res = []    
    jsonMonth.forEach( (elem) => {
      let dayOff = false
      if ((elem.weekday === 6) || (elem.weekday === 0))
      {
        dayOff = true
      }
      let currentMonth = false;
      if (elem.month === month)
        currentMonth = true
      let alterWeekday = 0
      alterWeekday = (elem.weekday + 6) % 7
      //res.push({ ...elem, currentMonth: currentMonth, dayOff:dayOff})
      res.push({ ...elem, currentMonth: currentMonth, dayOff:dayOff, alterWeekday:alterWeekday})
    })
    //console.log(res)
    return res
  }
  // Construct given month HTML
  constructHTMLMounth (monthGiven, yearGiven)
  {
    let content = []
    let jsonMonth = this.filterJsonOfMounth(
      this.generateJsonOfMounth(monthGiven, yearGiven),
      monthGiven)
    jsonMonth = this.paintJsonMonth(jsonMonth, monthGiven)
    jsonMonth.forEach( (elem, index, arr) => {
      let localContent = []
      if (elem.weekday === 0)
      {
        for(let dayOfWeek = 0; dayOfWeek < 7; dayOfWeek++)
        {
          let weekdayElem = arr[index + dayOfWeek];
          localContent.push(<DayBlock key={Math.random()} currentMonth={weekdayElem.currentMonth} dayOff={weekdayElem.dayOff}>{weekdayElem.day}</DayBlock>)
        }
      }
      content.push(<WeekBlock key={Math.random()}>{localContent}</WeekBlock>)
    } )
    return content
  }
 
  render()
  {
    return (
      <div className="App">
        {this.constructHTMLMounth(10,2022)}        
      </div>
    );
  } 
}

export default App;
