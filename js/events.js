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


    var now = moment();
    var nowFormat = now.format("dddd, MMMM Do");
    $("#currentDay").text(nowFormat);

/*    
Because this app uses a modal box to collect information, variable global_current_record
is used to hold the id of the time-slot that was originally clicked.
*/ 

let global_current_record = "";

/*    
On clicking time-block, bring up a modal to enter event information.
*/ 

$(".time-block").on("click", function(event){
event.stopImmediatePropagation();
targetElement = event.target.closest("section");
//var targetElement = event.target;
var identifyBlock = targetElement.id;


// *******************
//alert(currentContent);
// *******************

var identifyTime = targetElement.getAttribute("data-time");
global_current_record = identifyBlock;
$("#eventModal").modal('show');
$(".modal-title").text(identifyTime);
var test;
})

/*    
After user clicks button to submit event......
*/ 

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


  


function alter_localStorageObject(){
   let event_array = [];
  
       
 $("section").each( function(){
   //var current_section = $(this);
  
   
   
    if( $(this)[0].children[0].childNodes[3].children[0].innerHTML != null && $(this)[0].children[0].childNodes[3].children[0].innerHTML != undefined && $(this)[0].children[0].childNodes[3].children[0].innerHTML != null ){
                        var currentLine ="{id :" + $(this)[0].id + " , " + "eventText : " + $(this)[0].children[0].childNodes[3].children[0].innerHTML + "}";
                        event_array.push(currentLine);
                       }
                      
    
    var objString =  JSON.stringify(event_array);
    localStorage.setItem(nowFormat, objString);
    

                      })
}
})                    