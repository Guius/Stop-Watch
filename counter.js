var BASE_URL = "http://37.148.211.111:1337/";

var taskid = localStorage.getItem('taskid');
var taskDetails = {};
console.log(taskid);

var countDownDate;
var allocatedTime;

function getTask(){
    $.get( BASE_URL + "tasks/"+taskid, function( data ) {
        console.log(data);
        
        }).success (function (data2){
            console.log(data2);
            taskDetails = data2;

            $('#client').text(taskDetails.client.name);
            $('#project').text(taskDetails.project.name);
            $('#name').text(taskDetails.name);
            $('#due').text(taskDetails.finalDate);
            $('#allocated').text(timeConvert(taskDetails.allocatedTime));
            allocatedTime = taskDetails.allocatedTime;
            startTimer();

        }).error (function (data){
            console.log("Error on task call:"+data)
        });
}


function timeConvert(n) {
    var num = n;
    var hours = (num / 60);
    var rhours = Math.floor(hours);
    var minutes = (hours - rhours) * 60;
    var rminutes = Math.round(minutes);
    return rhours + " hour(s) " + rminutes + " minute(s)";
    }
    function timeConvert2(n) {
        var num = n;
        var hours = (num / 60);
        var rhours = Math.floor(hours);
        var minutes = (hours - rhours) * 60;
        var rminutes = Math.round(minutes);
        return rhours + " : " + rminutes + " : ";
        }


function startTimer(){
    var i = 60;
    var x = setInterval(function() {
        document.getElementById("time-on-clock").innerHTML = timeConvert2(allocatedTime)+i;
        i--;
        if(i==0) {
            i=60;
            allocatedTime -=1;
        }
      }, 1000);
}

getTask();