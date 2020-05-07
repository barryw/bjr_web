/*

Give us page-specific Javascript so that we can tailor functionality for the page we're on.

*/

$(document).ready(function(){
  Paloma.start();
});

Paloma.controller('Home', {
  new: function() {
    initHomeNew();
  }
});

Paloma.controller('Jobs', {
  index: function() {
    console.log('jobs#index');
  }
});
