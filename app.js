// Get HTML elements

const taskInput = document.getElementById("taskInput");

const addBtn = document.getElementById("addBtn");

const taskList = document.getElementById("taskList");


// Add Task

addBtn.addEventListener("click", function () {

    const task = taskInput.value.trim();


    // Check empty input

    if (task === "") {

        alert("Please enter a task!");

        return;
    }


    // Create new list item

    const li = document.createElement("li");


    // Create task text

    const taskText = document.createElement("span");

    taskText.textContent = task;


    // Create Delete button

    const deleteBtn = document.createElement("button");

    deleteBtn.textContent = "Delete";


    // Delete task when button is clicked

    deleteBtn.addEventListener("click", function () {

        li.remove();

    });


    // Add task text and button

    li.appendChild(taskText);

    li.appendChild(deleteBtn);


    // Add task to list

    taskList.appendChild(li);


    // Clear input

    taskInput.value = "";

    taskInput.focus();

});


// Add task using Enter key

taskInput.addEventListener("keydown", function (event) {

    if (event.key === "Enter") {

        addBtn.click();

    }

});