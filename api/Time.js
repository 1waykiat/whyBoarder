// get today in yyyy-mm-dd
export const today = () => {
  const temp = (new Date(Date.now())).toLocaleDateString().split('/');
  const temp1 = new Date(Date.now()).toLocaleString().split(" ");
  return temp1[temp1.length - 1]+"-"+temp[0].padStart(2, "0")+"-"+temp[1].padStart(2, "0");
};

// take time in number format and return in number format e.g (0930) not ("09:30")
export const stringToNumberTime = (timeString) => {
  return parseInt(timeString.substring(0, 2) + timeString.substring(3, 5));
};

// reverse of the above
export  const numberToStringTime = (timeNumber) => {
  const temp = timeNumber.toString().padStart(4,"0");
  return temp.substring(0, 2) + ":" + temp.substring(2, 4);
}

// take a time in number format and a duration in minutes to return the new time
export const addTime = (time, duration) => {
  const cTime = typeof time == "string" ? stringToNumberTime(time) : time;
  const mins = (duration % 60 + cTime % 100) % 60;
  const hours = Math.floor(duration / 60) + Math.floor((duration % 60 + cTime % 100) / 60)
  return (Math.floor(cTime / 100) + hours) * 100 + mins;
};

// take a date (e.g "2021-06-16") and an interger number of days to get the date after that number of days
export const addDate = (dateString, numberOfDays) => {
  let nextDate = new Date(dateString)
  nextDate.setDate(nextDate.getDate() + numberOfDays);
  return nextDate.toISOString().split('T')[0];
}

// take an agenda object with startTime and endTime to calculate the duration in minutes
export const agendaDuration = (task) => {
  const startTime = stringToNumberTime(task.startTime);
  const endTime = stringToNumberTime(task.endTime);
  return (Math.floor(endTime / 100) - Math.floor(startTime / 100)) * 60 + endTime % 100 - startTime % 100;
}

// takes an object with startDate and endDate to calculate the difference in number of days.
export const dateDifference = (task) => {
  return new Date(task.endDate) - new Date(task.endDate); 
}

// compare two task by time
export const timeComparator = (x, y) => {
  return parseInt(x.startTime.substring(0, 2) + x.startTime.substring(3, 5)) -
    parseInt(y.startTime.substring(0, 2) + y.startTime.substring(3, 5));
};

  // compare two task by date
export const dateComparator = (x, y) => {
  return new Date(x.startDate) - new Date(y.startDate);
};