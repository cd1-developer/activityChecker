function getTrialPeriodDate(dateString:string){
    const inputDate = new Date(dateString);
   
    const year = inputDate.getFullYear();
    const month = inputDate.getMonth();
    let  date = inputDate.getDate();
    let adjustedDate = date + 5;
    let daysInThisMonth = daysInCurrentMonth(month,year);
    let firstDateOfNextMonth  = new Date(year, month + 2, 1);
    
    if(adjustedDate > daysInThisMonth){
      let leftOverDays = adjustedDate - daysInThisMonth;
      let daysAfterIncerement = firstDateOfNextMonth.getDate() + leftOverDays -1
      return new Date(year,month+1,daysAfterIncerement);
      
    }else return new Date(year,month,adjustedDate)
    
}
// Return number of days in a given month and year
function daysInCurrentMonth(month:number, year:number) {
    return new Date(year, month + 1, 0).getDate();
  }

  export default getTrialPeriodDate