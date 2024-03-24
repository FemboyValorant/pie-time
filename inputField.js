import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
import { getDatabase, ref, push, onValue, remove  } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"

const appSettings = {
    databaseURL: "https://grocery-helper-653fd-default-rtdb.firebaseio.com/" // Correct database URL
}

const app = initializeApp(appSettings);
const database = getDatabase(app);
const taskListRef = ref(database, "taskList");

const taskNameInput = document.getElementById("task-name");
const taskNumberInput = document.getElementById("task-number");
const addButton = document.getElementById("add-task-button");

let totalTasks = 0; // Variable to keep track of the total number of tasks
let totalMinutes = 0; // Variable to keep track of the total number of minutes

addButton.addEventListener("click", function() {
    const taskName = taskNameInput.value;
    const taskNumber = parseInt(taskNumberInput.value);

    if (taskName && !isNaN(taskNumber) && taskNumber > 0) {
        push(taskListRef, { name: taskName, number: taskNumber });
        totalTasks++; // Increment totalTasks
        totalMinutes += taskNumber; // Add the minutes of the new task
        clearInputFields(); // Call the function to clear input fields after adding to the database
    }
});

function clearInputFields() {
    taskNameInput.value = "";
    taskNumberInput.value = "";
}

onValue(taskListRef, function(snapshot) {
    // Reset totalTasks and totalMinutes before recalculating
    totalTasks = 0;
    totalMinutes = 0;

    snapshot.forEach(function(childSnapshot) {
        const task = childSnapshot.val();
        const number = task.number;
        totalTasks++; // Increment totalTasks
        totalMinutes += number; // Add the minutes of the task
    });

    console.log("Total Tasks:", totalTasks);
    console.log("Total Minutes:", totalMinutes);
}); 