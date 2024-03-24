import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
import { getDatabase, ref, push, onValue, remove  } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"

const appSettings = {
    databaseURL: "https://project-14711-default-rtdb.firebaseio.com/" // Correct database URL
}

const app = initializeApp(appSettings)
const database = getDatabase(app)
const taskListRef = ref(database, "taskList")

const taskNameInput = document.getElementById("task-name")
const taskNumberInput = document.getElementById("task-number")
const taskColourInput = document.getElementById("task-color")
const addButton = document.getElementById("add-task-button")
let nam = []
let nu = []

addButton.addEventListener("click", function() {
    const taskName = taskNameInput.value
    const taskNumber = parseInt(taskNumberInput.value)
    const taskColour = taskColourInput.value

    if (taskName && !isNaN(taskNumber) && taskNumber > 0) {
        push(taskListRef, { name: taskName, number: taskNumber, color:taskColour})
        clearInputFields(); // Call the function to clear input fields after adding to the database
    }
})

function clearInputFields() {
    taskNameInput.value = ""
    taskNumberInput.value = ""
}
onValue(taskListRef, function(snapshot) {

   snapshot.forEach(function(childSnapshot) {
      const task = childSnapshot.val();
      const name = task.name;
      const number = task.number;
      const color = task.color
    pushValues(name,number,color)
  })     
})



function pushValues(name,number,color){




  
  
}
