/*
Navigate back to the login page
*/
function redirectHomeOnError()
{
  window.location.href = '/dashboard';
}

/*
Perform common tasks on DOM load
*/
$(document).ready(function(){
  getHelpStatus();
  setupHelpIconClickHandler();
});

/*
Handle click of the help icon
*/
function setupHelpIconClickHandler()
{
  $( "#help-icon" ).click(function() {
    setHelpStatus();
  });
}

/*
Retrieve the status of context-sensitive help and update the help icon
*/
function getHelpStatus()
{
  Rails.ajax({
    type: "GET",
    url: "/help",
    success: function(response) {
      console.log(response);
      if(response['enabled'] == true) {
        $('#help-icon-status').attr('class', 'card-widget__icon');
        $('#help-icon').attr('data-original-title', response['text']);
      } else {
        $('#help-icon-status').attr('class', 'card-widget__icon_disabled');
        $('#help-icon').attr('data-original-title', response['text']);
      }
    },
    error: function(response) {
      console.log('Failed to get help status');
    }
  });
}

/*
Manage the enabling/disabling of context-sensitive help
*/
function setHelpStatus()
{
  var clazz = $('#help-icon-status').attr('class');
  var enabled = clazz === 'card-widget__icon';

  Rails.ajax({
    type: "POST",
    url: "/help",
    data: "enabled=" + !enabled,
    success: function(response) {
      console.log(response);
      getHelpStatus();
    },
    error: function(response) {
      console.log('Failed to update help status');
    }
  });
}
