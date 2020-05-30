var stopwatchController = (function(){

	var data = {
		time: {
			estimatedDuration: 20, /*30 minutes in seconds*/
			targetDate: 0,
			dateAtStart: 0,
			timeAtPause: 0,
			timeAtEnd: 0
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


		getDifference: function(target) {

			const current = new Date();


			// calculate the difference between current time and target time in milliseconds
			const diffTime = Math.abs(target - current);
			const diffSecs = Math.ceil(diffTime / (1000));

			console.log(`${diffSecs}`);

			return diffSecs;

		},


		getPausedDate: function(storageLocation) {
			const pausedDate = new Date();
			if (storageLocation === "pause") {

				console.log(`PAUSED`);
				console.log(`Click on resume to continue your activity or click on stop if you have finished`);

				data.time.timeAtPause = pausedDate;

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
				const text = `you finished ${diffSecs} seconds late loser`;				
			} else {
				console.log(`you finished ${diffSecs} seconds early you are really really awesome`);
			}			

			console.log(`Click on start to start the activity again`);			
			

		}



	};




}) ();





var UIController = (function(){


	var UIData = stopwatchController.getData();

	var DOMStrings = {
		timerButtons: {
			start: "#start",
			pause: "#pause",
			resume: "#resume",
			stop: "#stop"
		},
		results: "results"
	};

	return {
		getDOMStrings: function() {
			return DOMStrings;
		},

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
		const durationPause = stpwchCtrl.getDifference(controllerData.time.timeAtPause);

		console.log(`You paused your timer for ${durationPause} seconds. Get back to work!`);

		// set new final date
		const newTargetDate = stpwchCtrl.addToDate(controllerData.time.targetDate, durationPause);

		// start the timer 
		timerControls(newTargetDate);		

	};


	var timerControls = function(target) {
		document.querySelector(DOM.timerButtons.pause).addEventListener("click", pause);
		document.querySelector(DOM.timerButtons.stop).addEventListener("click", stop);

		// get the difference between the current date and the target date every second and display the result in the console		
		const countDown = setInterval(function() {stpwchCtrl.getDifference(target);}, 1000);


		// trigger the pause of the counter if event has been called
		function pause() {
			pauseFunction(countDown, "pause");
		}


		function stop() {
			// pause the counter and save the time in the storage of data as the completed Date
			pauseFunction(countDown, "stop");

			// check to see if user finished early or late calculate the time overdue or underdue and save
			stpwchCtrl.getStats();

		}

	};



	var pauseFunction = function(number, actionType) {

		// pause the countdown
		clearInterval(number);

		// get the date at which the timer was paused
		stpwchCtrl.getPausedDate(actionType);


	};



	return {
		init: function() {
			console.log("application has started successfully");

			setUpEventListeners();


		}
	} 


}) (stopwatchController, UIController);


globalController.init();