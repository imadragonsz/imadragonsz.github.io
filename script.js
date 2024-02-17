class Shift {
  constructor(name, startTimes, endTimes) {
    this.name = name;
    this.startTimes = startTimes;
	this.endTimes = endTimes;
    this.timers = [];
    this.containerId = `${name.toLowerCase()}Timers`;
  }

  calculateShiftTimes() {
    const currentDay = new Date().getDay();

    if (currentDay === 5) { //check if it's friday since then there are different break times
      if (this.name === "Morning") {
        return ["09:00:00", "11:15:00","13:30:00"];
      } else if (this.name === "Afternoon") {
        return ["15:15:00", "17:45:00","20:00:00"];
      }
    }

    return this.startTimes.concat(this.endTimes);
  }

  updateTimers() {
    const shiftTimes = this.calculateShiftTimes();
    const timersContainer = document.getElementById(this.containerId);
    timersContainer.innerHTML = "";

    const currentTime = new Date();

    for (let i = 0; i < shiftTimes.length; i++) {
      const [hours, minutes, seconds] = shiftTimes[i].split(':');
      const timerTime = new Date();
      timerTime.setHours(hours, minutes, seconds);
      this.timers.push(timerTime);

      const timeDifference = timerTime - currentTime;
      const timerElement = document.createElement('div');
      timerElement.classList.add('timer');
	  
	  //calculate the hours,minutes and seconds remaining till timers
      const hoursRemaining = Math.floor(timeDifference / (1000 * 60 * 60));
      const minutesRemaining = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
      const secondsRemaining = Math.floor((timeDifference % (1000 * 60)) / 1000);
	  
      let labelElement = document.createElement('div');
      labelElement.classList.add('timer-label');
	  
      if (i === shiftTimes.length - 1) {
        // If it's the last shift time, display a different label
        labelElement.innerHTML = `Time till shift ends`;
      } else {
        labelElement.innerHTML = `Break ${i + 1}`;
      }
	  
      timerElement.appendChild(labelElement);

      if (timeDifference > 0) { //create timer based on the remaining time till set timers
        const timeRemainingElement = document.createElement('p');
        timeRemainingElement.innerHTML = `${hoursRemaining}h ${minutesRemaining}m ${secondsRemaining}s remaining`;
        timerElement.appendChild(timeRemainingElement);
      } else { //checks if it's the last timer, if it is this means it's the end of the shift and it needs a different label.
			if (i === shiftTimes.length - 1) {
				timerElement.innerHTML = `<p>Shift has passed</p>`;
			} else {
				timerElement.innerHTML = `<p>Break has passed!</p>`;
			}
      }
      timersContainer.appendChild(timerElement);
    }
  }
}

//creating const used for the Shift constructor
const morningShift = new Shift("Morning", ["09:00:00", "11:15:00", "13:15:00"],["15:30:00"]);
const afternoonShift = new Shift("Afternoon", ["17:30:00", "20:15:00", "22:15:00"],["23:59:59"]);

function updateShifts() {
  morningShift.updateTimers();
  afternoonShift.updateTimers();
}

// Update the shifts and timers every second
updateShifts();
setInterval(updateShifts, 1000);
