/*

Give us page-specific Javascript so that we can tailor functionality for the page we're on.

*/

$(document).ready(function(){
  Paloma.start();
});

/*
Javascript for Home controller actions
*/
Paloma.controller('Home', {
  new: function() {
    initHomeNew();
  }
});
