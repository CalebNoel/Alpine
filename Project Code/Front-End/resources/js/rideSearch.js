/*
$(document).ready(function(){
 $('#start_date').datepicker();
 $('#end_date').datepicker();
});
*/

function submitRideSearch() {
  let start = new Date(document.getElementById('start_date').value);
  let end = new Date(document.getElementById('end_date').value);
  if( start <= end) {
    //Proceed with search
  }
  else if (!isNaN(start.getDate()) && !isNaN(end.getDate())) {
    alert('Start date cannot follow end date.');
  }
}
