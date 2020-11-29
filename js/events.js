
/*
Perform when DOM safely loads
*/
$( document ).ready(function(){

//------------------------------
   /*
   MOMENT.JS
   PURPOSE: Easy date/time conversion and comparison.
   Used for date displays and defining local storage objects.
   */  
//------------------------------

       // Create a display date with moment.js that represents current date.
    var now = moment();
    var nowFormat = now.format("dddd, MMMM Do");


      // Populate attribute "data-date" on on all section elements.  Make sure current
      // date shows at top of screen as well.
    $("section").attr("data-date", nowFormat);
    $("#currentDay").text(nowFormat);
    
    
    // After initial run, populatePastPresent() performs on a timer.
    // More on this function below.
    populatePastPresent();
    setInterval(function(){ populatePastPresent(); }, 60000);

    //------------------------------
   /*
   populatePastPresent();

   PURPOSE: Compares times to current time, and changes the background
   color of each timeblock circle according to past and future.

   PARAMETERS: N/A

   RETURNS: N/A
  
   */  
  //------------------------------ 
      
   function populatePastPresent(){
    var activeDate= moment().format("L")
    // Milliseconds for time comparisons
    var nowMilli = moment().unix();

    $(".time-block").each(function(){
      // there are two programmer-defined data attributes in each section element
      // that are used to judge if the particular .time-block is "current". In more concrete
      // language, each loop run judges if the current time MIGHT fall between, say,
      // "data-time" 1/1/2020 8:00 am and "data-nextSlot" 1/1/2020 9:00 am.  This is
      // how the circles in each time slot are colored to represent wheter the time
      // block is past, present, or future.
      
      var dTime = $(this).attr("data-time");
      var next_hour = $(this).attr("data-nextSlot");
      var fullString = activeDate + " " + dTime;
      var next_timeSlot = activeDate + " " + next_hour;
      let e_factor;
      
      // Compare now to each time slot
      if(nowMilli >= moment(fullString).unix() && nowMilli <= moment(next_timeSlot).unix() ){
        $(this).find("span").css("background-color", "orange");
        $(this).find("span").css("height", "50px");
        $(this).find("span").css("width", "50px");
        e_factor = 1
       }
    
      if(moment(fullString).unix() < nowMilli && e_factor != 1){
        $(this).find("span").css("background-color", "#ff9999");
      }
      else if(moment(fullString).unix() > nowMilli && e_factor != 1){
        $(this).find("span").css("background-color", "#20B2AA");
  }
  })};   
     // ****** End of populatePastPresent() function.

  
/*      
Because this app uses a modal box to collect information, variable global_current_record
is used to hold the id of the time-slot that was originally clicked.
*/ 

let global_current_record = ""; 


//--------------------------------
/*
PURPOSE: Check to see if a local storage object exists for the current date.  If so
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

// find out if <p> element within selected section contains event info
var loadContent = "[data-assignment=" + "\"" + identifyBlock + "\"" + "]"
var insideParagraph = $(loadContent).text();
var stringContent = "";

if($("insideParagraph").is(':empty') || $("insideParagraph") === null || $("insideParagraph") === undefined  ){
   stringContent = "";
}
else{
  stringContent = insideParagraph; // If that time-slot already contains text, gather it.
}

// grabs the string of the selected time.  this is stored is data attribute "data-time."

var identifyTime = targetElement.getAttribute("data-time");
// sets global_current_record to recognize which time block to change when "submit" button
// is pressed.
global_current_record = identifyBlock;
$("#eventModal").modal('show');
$(".modal-title").text(identifyTime);
$("#enter-data").val("");
$("#enter-data").val(stringContent);
})


//------------------------------
   /*
  on-click function to submit event on modal window.

  PURPOSE: When user clicks button on modal to submit an event, this script
  populates the <p> element on each time block with the event.  Before doing so,
  checks to make sure the time-block is empty.  If it isn't, deletes the content that
  was there and populates <p> tags.


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