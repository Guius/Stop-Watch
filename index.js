var BASE_URL = "http://37.148.211.111:1337/";
var taskList = {};

function getTasks(){
    $.get( BASE_URL + "tasks", function( data ) {
        console.log(data);
        
        }).success (function (data2){
            console.log(data2);
            taskList = data2;

            $.each( taskList, function( key, value ) {
                console.log(value)
                var elem ='<div class="row my-3 main_row '+ getColor(value.status)+' filter '+ value.status+'">'
                +'<div class="col-2 my-auto">' 
                +value.client.name
                +'</div>'
                +'<div class="col-2 my-auto">'+ value.project.name+'</div>'
                +'<div class="col-2 my-auto">'+ value.name+'</div>'
                +'<div class="col-2 my-auto text-center">'+ value.finalDate+'</div>'
                +'<div class="col-2 my-auto text-center">'+ timeConvert(value.allocatedTime)+'</div>'
                +'<div class="col-2 px-0 mx-0 ml-3 row my-auto ml-auto  text-center">'
                +getStatus(value.status)
                +'<a href="counter.html" onclick="passData('+ value.id+')" class="col-5 todo todo_go d-flex align-self-center align-items-center "> Go to details <img src="icons8-chevron-right-30.png" alt=""></a></div></div>'
                ;
                
                $("#taskSection").append(elem);
              });

        }).error (function (data){
            console.log("Error on task call:"+data)
        });
}

function getDuration(final,start){
    const dateOne = final;
    const dateTwo = start;
    const dateOneObj = new Date(dateOne);
    const dateTwoObj = new Date(dateTwo);
    const milliseconds = Math.abs(dateTwoObj - dateOneObj);
    const hours = milliseconds / 36e5;
    
    return hours;
}

function getStatus(status){
    if(status==0) return '<div class="col-5 todo  d-flex align-self-center align-items-center m-2"> To do</div>';
    if(status==1) return '<div class="col-5 todo todo_green d-flex align-self-center align-items-center m-2"> In Progress</div>';
    if(status==2) return '<div class="col-5 todo todo_red d-flex align-self-center align-items-center m-2"> Completed</div>';
}

function getColor(status){
    if(status==0) return '';
    if(status==1) return 'main_row_red';
    if(status==2) return 'main_row_green';
}

function newTask(){
    HoldOn.open({
        theme:"sk-cube-grid"
   });
    var allocatedTimeMinutes = ($( "#timeDays" ).val()*24*6)+($( "#timeHours" ).val()*6)+($( "#timeMinutes" ).val());
    console.log(allocatedTimeMinutes);

    var task = {
        "name": $( "#inputTask" ).val(),
		"finalDate": $( "#inputDue" ).val(),
        "status": 0,
        "allocatedTime": allocatedTimeMinutes,
		"project": $( "#inputProject" ).val(),
		"client": $( "#inputClient" ).val()
    }
    console.log(task);

    $.post( BASE_URL + "tasks", task).success (function (data2){
            console.log(data2);
            taskList = data2;
            setTimeout(
                function() 
                {
            location.reload();
                }, 2000);

        }).error (function (data){
            console.log("Error on task call:"+data)
            setTimeout(
                function() 
                {
            location.reload();
                }, 2000);
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

    function passData (id) {
        localStorage.setItem('taskid', id);
    }


getTasks();



