//import moment from 'moment';

// filter by time
export function filterLastMonth(purchases) {
  var end = new Date();
  var start = new Date();
  start.setMonth(start.getMonth()-1);
  var results = purchases.filter(purch => {
    let date = purch.createdAt.toDate();
    return date >= start && date <= end;
  });
  return results;
}
export function filterLastThreeMonths(purchases) {
  var end = new Date();
  var start = new Date();
  start.setMonth(start.getMonth()-3);
  var results = purchases.filter(purch => {
    let date = purch.createdAt.toDate();
    return date >= start && date <= end;
  });
  return results;
}
export function filterLastYear(purchases) {
  var end = new Date();
  var start = new Date();
  start.setFullYear(start.getFullYear() - 1);
  var results = purchases.filter(purch => {
    let date = purch.createdAt.toDate();
    return date >= start && date <= end;
  });
  return results;
}

// these returns HashMap
// export function getPurchasesByDay(purchases, start, end) {
//   // var end = new Date();
//   // var start = this.purchasesFiltered[this.purchasesFiltered.length-1].createdAt.toDate();
//   var daysArray = enumerateDaysBetweenDates(start, end);

//   var purchMap = new Map();
//   daysArray.forEach(day => {
//     purchMap.set(day, 0);
//   });
//   purchases.forEach(purch => {
//     var purchDate = purch.createdAt.toDate();
//     purchDate = purchDate.toDateString();
//     purchMap.set(purchDate, Math.round(100*(purchMap.get(purchDate) + purch.purchaseAmount))/100);
//   })
//   console.log(end);
//   console.log(start);
//   console.log(Array.from(purchMap.keys()));

//   return purchMap;
// }
export function getPurchasesByCategory(purchases, categories) {
  var categoriesArray = [];
  categories.forEach(item => categoriesArray.push(item.category));
  var categoriesMap = new Map();

  categoriesArray.forEach(cat => {
    categoriesMap.set(cat, 0);
  });

  purchases.forEach(purch => {
    var purchCat = purch.purchaseCategory;
    categoriesMap.set(purchCat, Math.round(100*(categoriesMap.get(purchCat) + purch.purchaseAmount))/100);
  })
  return categoriesMap;
}

// helper functions
// function enumerateDaysBetweenDates(startDate, endDate) {
//   //https://stackoverflow.com/questions/23795522/how-to-enumerate-dates-between-two-dates-in-moment
//   var dates = [];
//   var currDate = moment(startDate).startOf('day');
//   var lastDate = moment(endDate).startOf('day');

//   dates.push(currDate.clone().toDate().toDateString());
//   while (currDate.add(1, 'days').diff(lastDate) < 0) {
//     var temp = currDate.clone().toDate();
//     dates.push(temp.toDateString());
//   }
//   var today = new Date();
//   today = today.toDateString();
//   dates.push(today);
//   return dates;
// }