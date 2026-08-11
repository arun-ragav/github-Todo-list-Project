// Get HTML elements

const taskInput = document.getElementById("taskInput");

const addBtn = document.getElementById("addBtn");

const taskList = document.getElementById("taskList");


// Add Task

addBtn.addEventListener("click", function () {

    // Get input value

    const task = taskInput.value.trim();


    // Check empty input

    if (task === "") {

        alert("Please enter a task!");

        return;
    }


    // Create new list item

    const li = document.createElement("li");


    // Add task text

    li.textContent = task;


    // Add task to the list

    taskList.appendChild(li);


    // Clear input box

    taskInput.value = "";


    // Put cursor back in input

    taskInput.focus();

});


// Add task using Enter key

taskInput.addEventListener("keydown", function (event) {

    if (event.key === "Enter") {

        addBtn.click();

    }

});