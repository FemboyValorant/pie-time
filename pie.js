import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import { getDatabase, ref, push, onValue, remove } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";

// Firebase configuration
const appSettings = {
    databaseURL: "https://grocery-helper-653fd-default-rtdb.firebaseio.com/"
};

// Initialize Firebase app and database
const app = initializeApp(appSettings);
const database = getDatabase(app);
const taskListRef = ref(database, "taskList");

// Array to store tasks data for the pie chart
let tasksData = [];

// ID for the interval used to update the chart
let intervalId;
let paused = false; // Flag to track if the countdown is paused
let currentTaskIndex = 0; // Index of the current task

// Function to handle "skip" button click
document.getElementById("skipButton").addEventListener("click", function() {
    // Increment the current task index to move to the next task
    currentTaskIndex = (currentTaskIndex + 1) % tasksData.length; // Use modulo to wrap around if reaching the end
    updatePieChart(); // Update the pie chart with the new task
});

// Function to update the pie chart
function updatePieChart() {
    // Check if the countdown is paused, if so, return without updating the chart
    if (paused) {
        return;
    }

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
                backgroundColor: tasksData.map((_, index) => `hsla(${(index * 30) % 360}, 70%, 50%, ${paused ? '1' : '0.5'})`), // Use dynamic opacity based on pause state
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false
        }
    });

    if (intervalId) {
        clearInterval(intervalId); // Clear the previous interval if it exists
    }

    intervalId = setInterval(function() {
        if (!paused) { // Check if the countdown is not paused
            if (tasksData.length > 0 && tasksData[currentTaskIndex].time > 0) {
                tasksData[currentTaskIndex].time--; // Reduce the time of the current task
            }
            if (tasksData.length > 0 && tasksData[currentTaskIndex].time === 0) {
                // Remove the current task from the database if its time reaches 0
                const taskIdToRemove = tasksData[currentTaskIndex].id; // Assuming each task has an "id" property
                remove(ref(database, `taskList/${taskIdToRemove}`))
                    .then(() => {
                        console.log("Task removed successfully");
                    })
                    .catch(error => {
                        console.error("Error removing task:", error);
                    });
                // Remove the current task from the tasksData array
                tasksData.splice(currentTaskIndex, 1);
            }
        }

        updatePieChart();
    }, 1000); // Update every second
}

// Function to handle "pause" button click
document.getElementById("pauseButton").addEventListener("click", function() {
    paused = !paused; // Toggle the value of paused
    const pauseButton = document.getElementById("pauseButton");
    if (paused) {
        pauseButton.classList.add("paused");
    } else {
        pauseButton.classList.remove("paused");
    }
});

// Function to handle "go back" button click
document.getElementById("goBackButton").addEventListener("click", function() {
    // Remove all data from the "taskList" node in the database
    remove(taskListRef)
        .then(() => {
            console.log("All data removed successfully");
        })
        .catch(error => {
            console.error("Error removing data:", error);
        });
});

// Listener for changes in the task list
onValue(taskListRef, function(snapshot) {
    tasksData = [];

    snapshot.forEach(function(childSnapshot) {
        const task = childSnapshot.val();
        const taskId = childSnapshot.key;
        const taskTime = task.number;

        if (taskTime <= 0) {
            remove(ref(database, `taskList/${taskId}`))
                .then(() => {
                    console.log("Task removed successfully");
                })
                .catch(error => {
                    console.error("Error removing task:", error);
                });
            makeProud(task.name);
        } else {
            tasksData.push({ id: taskId, name: task.name, time: taskTime }); // Include the task ID in the tasksData array
        }
    });

    // Update the pie chart
    updatePieChart();
});

// Function to display a message for the completed task
function makeProud(taskName) {
    console.log(`Good job on "${taskName}"!`);
    // Here you can add code to display the message in your UI
}
