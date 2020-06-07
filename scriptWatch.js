var stopwatchController = (function(){

	var data = {
		time: {
			estimatedDuration: 10, /*30 minutes in seconds*/
			targetDate: 0,
			dateAtStart: 0,
			timeAtPause: 0,
			timeAtEnd: 0
		},
		button: {
			replacementButtons: "<button class='btn btn-start btn-circle btn-xl' id='start'>Start</button><button class='btn btn-stop btn-circle btn-xl' id='stop'>Stop</button><button class='btn btn-warning btn-circle btn-xl' id='%id%'>%name%</button>",
			paused: 0
		}

	};

	return {
		getData: function() {
			return data;
		},


		getTargetDate: function(estimate) {
			// get current time
			const targetDate = new Date();
			const dateAtStart = new Date();			
			console.log(`starting timer for ${data.time.estimatedDuration} seconds`);
			data.time.dateAtStart = dateAtStart;


			// add to the current time a set time for completion (data.time.estimatedDuration)
			targetDate.setSeconds(targetDate.getSeconds() + estimate);

			// add the resulting time to data storage
			data.time.targetDate = targetDate;
		},




		getDifference: function(target, actionType) {

			const current = new Date();



			// calculate the difference between current time and target time in milliseconds
			const diffTime = Math.abs(target - current);
			const diffSecs = Math.ceil(diffTime / (1000));

			if (actionType === "play") {

				// convert diffSecs into a time to display: ddd:hh:mm:ss	
				stopwatchController.convertTimeFormat(diffSecs);

				// change the color of the timer to red if time goes to negative
				if (diffSecs === 1) {
					setTimeout(UIController.changeToRed, 1000);
				}
			}


			return diffSecs;

		},

		convertTimeFormat: function(time) {
				// 1. Find the number of hours:
				const hours = Math.floor(time / 3600); 

				// 2. Find the number of minutes minus the number of hours
				const minutes = Math.floor((time / 60) - (hours*60));

				// 3. Find the number of seconds minus the number of minutes and hours 
				const seconds = Math.floor(time - ((minutes*60) + (hours*3600)));

				// concatenate the result into a unified string
				// 1. convert all the results into strings
				hoursString = hours.toString();
				minutesString = minutes.toString();
				secondsString = seconds.toString();

				// 2. concatente the result and store into variable
				const convertedDate = `${hoursString} : ${minutesString} : ${secondsString}`;

				// display in the DOM the Time
				UIController.displayTime(convertedDate);
		},


		getPausedDate: function(storageLocation) {
			const pausedDate = new Date();
			if (storageLocation === "pause") {

				console.log(`PAUSED`);
				console.log(`Click on resume to continue your activity or click on stop if you have finished`);
				// store the paused date in the storage of data
				data.time.timeAtPause = pausedDate;

				// // change the status of paused to 1
				// data.button.paused = 1;
				// console.log(`status: ${data.button.paused}`);

				// // change the button pause to resume
				// UIController.changeToResume();


			} else if (storageLocation === "stop") {

				console.log(`STOPPED`);	

				data.time.timeAtEnd = pausedDate;

			}

		},

		addToDate: function(date, durationToAdd) {
			const newTarget = date;

			newTarget.setSeconds(newTarget.getSeconds() + durationToAdd);

			return newTarget;
		},

		getStats: function() {

			// calculate the time overview or underdue
			const diffTime = Math.abs(data.time.targetDate - data.time.timeAtEnd);
			const diffSecs = Math.ceil(diffTime / (1000));

			if (data.time.timeAtEnd > data.time.targetDate) {
				console.log(`you finished ${diffSecs} seconds late loser`);				
			} else {
				console.log(`you finished ${diffSecs} seconds early you are really really awesome`);
			}			

			console.log(`Click on start to start the activity again`);			


		},



	};




}) ();





var UIController = (function(){


	var UIData = stopwatchController.getData();

	var DOMStrings = {
		timerButtons: {
			start: "#start",
			pause: "#pause",
			pause_id: "pause",
			resume: "#resume",
			resume_id: "resume",
			stop: "#stop"
		},
		results: "results",
		change_resume: "change-resume",
		time_on_clock: "time-on-clock"
	};

	return {
		getDOMStrings: function() {
			return DOMStrings;
		},

		hidePlayButton: function() {
			document.getElementById(DOMStrings.timerButtons.pause_id).style.display = "none";
			document.getElementById(DOMStrings.timerButtons.resume_id).style.display = "block";
		},

		showPlayButton: function() {
			document.getElementById(DOMStrings.timerButtons.pause_id).style.display = "block";
			document.getElementById(DOMStrings.timerButtons.pause_id).style.marginLeft = "550px";
			document.getElementById(DOMStrings.timerButtons.resume_id).style.display = "none";			
		},

		displayTime: function(time) {
			document.getElementById(DOMStrings.time_on_clock).innerHTML = time;
		},

		endTimer: function() {
			document.getElementById(DOMStrings.time_on_clock).innerHTML = "finished";			
		},

		changeToRed: function() {
			document.getElementById(DOMStrings.time_on_clock).style.color = "red";
		},

		displayPause: function() {
			document.getElementById(DOMStrings.time_on_clock).innerHTML = "Paused";
		}

	}

}) ();


var globalController = (function(stpwchCtrl, UICtrl){

	var DOM, controllerData;


	DOM = UICtrl.getDOMStrings();
	controllerData = stpwchCtrl.getData();

	const timeCompletion = controllerData.time.estimatedDuration;




	var setUpEventListeners = function() {
		document.querySelector(DOM.timerButtons.start).addEventListener("click", startTimer);
		document.querySelector(DOM.timerButtons.resume).addEventListener("click", resumeTimer);		
	};

	var startTimer = function() {

		// get the target date and save that specific date in storage of a data
		stpwchCtrl.getTargetDate(timeCompletion);

		// start the timer 
		timerControls(controllerData.time.targetDate);

	};


	var resumeTimer = function() {

		// get the time that happened during user pause
		const durationPause = stpwchCtrl.getDifference(controllerData.time.timeAtPause, "resume");

		console.log(`You paused your timer for ${durationPause} seconds. Get back to work!`);

		// set new final date
		const newTargetDate = stpwchCtrl.addToDate(controllerData.time.targetDate, durationPause);

		// start the timer 
		timerControls(newTargetDate);	

		// reverse back the buttons
		UICtrl.showPlayButton(); 

	};


	var timerControls = function(target) {
		if (controllerData.button.paused === 0) {
			document.querySelector(DOM.timerButtons.pause).addEventListener("click", pause);
		}
		// document.querySelector(DOM.timerButtons.pause).addEventListener("click", resumeTimer);
		document.querySelector(DOM.timerButtons.stop).addEventListener("click", stop);

		var timeToDisplay;

		// get the difference between the current date and the target date every second and display the result in the console		
		const countDown = setInterval(function() {timeToDisplay = stpwchCtrl.getDifference(target, "play");}, 1000);


		// trigger the pause of the counter if event has been called
		function pause() {
			pauseFunction(countDown, "pause");
		}


		function stop() {
			// pause the counter and save the time in the storage of data as the completed Date
			pauseFunction(countDown, "stop");

			// change the DOM to finish message
			UICtrl.endTimer();

			// check to see if user finished early or late calculate the time overdue or underdue and save
			stpwchCtrl.getStats();

			console.log(`time at end: ${controllerData.time.timeAtEnd}`);

		}

	};



	var pauseFunction = function(number, actionType) {

		// pause the countdown
		clearInterval(number);

		console.log(`status: ${controllerData.button.paused}`);
		// hide the play button
		UICtrl.hidePlayButton();

		// get the date at which the timer was paused
		stpwchCtrl.getPausedDate(actionType);

		// display "paused"
		UICtrl.displayPause();


	};



	return {
		init: function() {
			console.log("application has started successfully");

			setUpEventListeners();

			stpwchCtrl.convertTimeFormat(controllerData.time.estimatedDuration);

		}
	} 


}) (stopwatchController, UIController);


globalController.init();