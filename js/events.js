/*
GIVEN I am using a daily planner to create a schedule
WHEN I open the planner
THEN the current day is displayed at the top of the calendar
WHEN I scroll down
THEN I am presented with time blocks for standard business hours
WHEN I view the time blocks for that day
THEN each time block is color-coded to indicate whether it is in the past, present, or future
WHEN I click into a time block
THEN I can enter an event
WHEN I click the save button for that time block
THEN the text for that event is saved in local storage
WHEN I refresh the page
THEN the saved events persist
*/


$( document ).ready(function(){

//------------------------------
   /*
   MOMENT.JS
   Purpose: Easy date conversion.
   Used for date displays and defining local storage objects.
   */  
  //------------------------------
       // Current Date
    var now = moment();
    var nowFormat = now.format("dddd, MMMM Do");
    var nowMilli = moment().unix();


    $("section").attr("data-date", nowFormat);
    $("#currentDay").text(nowFormat);
    

    populatePastPresent();

     
   function populatePastPresent(){
    
    var activeDate= moment().format("L")

    $(".time-block").each(function(){
      var dTime = $(this).attr("data-time");
      var fullString = activeDate + " " + dTime;
      
      if(moment(fullString).unix() < nowMilli){
        $(this).find("span").css("background-color", "red");
      }
      else{
        $(this).find("span").css("background-color", "green");
      }
      
      

  });
    

    }



 /*      
Because this app uses a modal box to collect information, variable global_current_record
is used to hold the id of the time-slot that was originally clicked.
*/ 

let global_current_record = ""; 

//--------------------------------
/*
Check to see if a local storage object exists for the current date.  If so
run function to populate previously-created events from storage.  Basically
just a function that evaluates and points to another function.
*/
//---------------------------------

if(localStorage.getItem(nowFormat) != undefined && localStorage.getItem(nowFormat) != null && localStorage.getItem(nowFormat) != "" ){
   import_localStorage_events();
 }

//------------------------------
   /*
   import_localStorage_events()
   PURPOSE: Bringing in events created for a certain day that are held
            in the device's local storage.

   PARAMETERS: N/A

   RETURNS: N/A
   */  
  //------------------------------


function import_localStorage_events(){


  var grabLocal = localStorage.getItem(nowFormat);
  var eventMap = JSON.parse(grabLocal);
  
  
  for (var i = 0; i<eventMap.length; i++){
    workingObj = eventMap[i];
   
    workingId ="#" + workingObj.id;
    workingText=workingObj.eventText;
    var dataAssignment_label = "[data-assignment=" + "\"" + workingObj.id + "\"" + "]"
    $(dataAssignment_label).text(workingText);
  
  }
}
  
//------------------------------
   /*
   Modal window on-click function
   PURPOSE: When user clicks on a time-block, bring up a modal 
   to enter event information.  Populates variable global_current_record.

   PARAMETERS: N/A

   RETURNS: N/A
   */  
  //------------------------------
 

$(".time-block").on("click", function(event){
event.stopImmediatePropagation();
targetElement = event.target.closest("section");
//var targetElement = event.target;
var identifyBlock = targetElement.id;


var identifyTime = targetElement.getAttribute("data-time");
global_current_record = identifyBlock;
$("#eventModal").modal('show');
$(".modal-title").text(identifyTime);
var test;
})

//------------------------------
   /*
  on-click function to submit event on modal window.

  PURPOSE: When user clicks button on modal to submit an event, this script
  populates the <p> element on each time block with the event.  Before doing so,
  checks to make sure the time-block is empty.


   PARAMETERS: N/A

   RETURNS: N/A
   */  
  //------------------------------

$("#insertEvent").on("click", function(event){
    event.preventDefault();
    var idString = "#" + global_current_record;
    var eventInput = $("#enter-data").val();
    // Evaluate to make sure the text-area is not an empty string.
    var trimmedInput = eventInput.trim();

     
    if($(idString).find("p") === "" || $(idString).find("p") === null || $(idString).find("p") === undefined ){
      $(idString).find("p").text(trimmedInput);  
    }
    else{
        $(idString).find("p").empty();
        $(idString).find("p").text(trimmedInput);    
    }

    global_current_record = "";
    $("#eventModal").modal('hide');
    alter_localStorageObject();
    })

//------------------------------
   /*
   alter_localStorageObject()

   PURPOSE: Each time a new event is submitted, creates an array filled with
   JSON objects pertaining to all daily events, and tucks it into local storage
   for that day.

   PARAMETERS: N/A

   RETURNS: N/A
   */  
  //------------------------------

function alter_localStorageObject(){
   let event_array = [];
   $("section").each( function(){
   //var current_section = $(this);
        if( $(this)[0].children[0].childNodes[3].children[0].innerHTML != null && $(this)[0].children[0].childNodes[3].children[0].innerHTML != undefined && $(this)[0].children[0].childNodes[3].children[0].innerHTML != null  && $(this)[0].children[0].childNodes[3].children[0].innerHTML != "" ){
                        var currentLine = {
                                            "id" :  $(this)[0].id  , 
                                            "eventText" : $(this)[0].children[0].childNodes[3].children[0].innerHTML, 
                                          };
                        event_array.push(currentLine);
                       }
                      
    var objString = JSON.stringify(event_array);
    localStorage.setItem(nowFormat, objString);
    

                      })}





})                    