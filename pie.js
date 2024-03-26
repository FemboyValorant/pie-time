import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import { getDatabase, ref, push, onValue, remove,update } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";

// Firebase configuration
const appSettings = {
    databaseURL: "https://nice-words-7dde7-default-rtdb.firebaseio.com/"
};

// Initialize Firebase app and database
const app = initializeApp(appSettings);
const database = getDatabase(app);
const taskListRef = ref(database, "taskList");
const h1 = document.getElementById("class")
const pause  = document.getElementById("pauseButton");
// Array to store tasks data for the pie chart
let tasksData = [];

// ID for the interval used to update the chart
let intervalId;
let paused = false; // Flag to track if the countdown is paused
let currentTaskIndex = 0; // Index of the current task

pause.addEventListener('click', function(){

paused = !paused
h1.textContent = "paused"


})



// Function to handle "skip" button click
document.getElementById("skipButton").addEventListener("click", function() {
    // Increment the current task index to move to the next task
    currentTaskIndex = (currentTaskIndex + 1) % tasksData.length; // Use modulo to wrap around if reaching the end
    updatePieChart(); // Update the pie chart with the new task
});

// Function to update the pie chart
function updatePieChart() {
    const ctx = document.getElementById('taskPieChart').getContext('2d');

    if (window.myPieChart) {
        window.myPieChart.destroy();
    }

    window.myPieChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: tasksData.map(task => task.name),
            datasets: [{
                label: 'Tasks and Total Time',
                data: tasksData.map(task => task.time),
                backgroundColor: tasksData.map((_, index) => `hsla(${(index * 30) % 360}, 70%, 50%, ${paused ? '1' : '0.5'})`),
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false
        }
    });
}

// Listener for changes in the task list
onValue(taskListRef, function(snapshot) {
  if (snapshot.exists()) {
      tasksData = []; // Clear tasksData before updating it

      snapshot.forEach(function(childSnapshot) {
          const task = childSnapshot.val();
          const taskId = childSnapshot.key;
          const taskTime = task.number;

          tasksData.push({ id: taskId, name: task.name, time: taskTime });
      });

      updatePieChart(); // Update the pie chart after updating tasksData
      startInterval(); // Start the interval to update task time
  } else {
      clearInterval(intervalId);
      h1.innerText = `All done ` 
      if (window.myPieChart) {
          window.myPieChart.destroy();
      }
  }
});
// Interval to update task time
// Function to start the interval
// Function to start the interval
function startInterval() {
  intervalId = setInterval(function() {
      if (!paused && tasksData.length > 0) {
          const currentTask = tasksData[currentTaskIndex];
          if (currentTask) {
              if (currentTask.time > 0) {
                  currentTask.time--; // Reduce the time of the current task
                  // Update task time in the database
                  h1.innerText = `your current task is ${currentTask.name} `;
                  ref(database, `taskList/${currentTask.id}`).update({ number: currentTask.time });
                  updatePieChart(); // Update the pie chart after updating task time
              } else {
                  // Remove the current task from the tasksData array
                  tasksData.shift();
                  // Remove the task from the database
                  remove(ref(database, `taskList/${currentTask.id}`))
                      .then(() => {
                          console.log("Task removed successfully from the database");
                      })
                      .catch(error => {
                          console.error("Error removing task from the database:", error);
                      });
                  updatePieChart(); // Update the pie chart after removing task
                  // If there are no tasks, clear the interval and stop further updates
                  if (tasksData.length === 0) {
                      clearInterval(intervalId);
                      if (window.myPieChart) {
                          window.myPieChart.destroy();
                      }
                  }
              }
          } else {
              // If currentTask is undefined, reset the currentTaskIndex to 0
              currentTaskIndex = 0;
              // Update the h1 element to indicate no current task
              h1.innerText = "No task currently";
          }
      }
  }, 1000); // Update every second
}
