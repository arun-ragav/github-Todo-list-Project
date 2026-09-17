// =====================================
// DARK / LIGHT MODE
// =====================================

const themeBtn = document.getElementById("themeBtn");


// Check saved theme

if (localStorage.getItem("theme") === "dark") {

    document.body.classList.add("dark-mode");

    themeBtn.textContent = "☀️ Light Mode";

}


// Theme button

themeBtn.addEventListener("click", function () {

    document.body.classList.toggle("dark-mode");


    if (document.body.classList.contains("dark-mode")) {

        localStorage.setItem("theme", "dark");

        themeBtn.textContent = "☀️ Light Mode";

    } else {

        localStorage.setItem("theme", "light");

        themeBtn.textContent = "🌙 Dark Mode";

    }

});


// =====================================
// TODO LIST
// =====================================

let currentFilter = "all";


// Get saved tasks

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];


// =====================================
// SAVE TASKS
// =====================================

function saveTasks() {

    localStorage.setItem("tasks", JSON.stringify(tasks));

}


// =====================================
// UPDATE COUNTERS
// =====================================

function updateCounters() {

    const total = tasks.length;

    const completed = tasks.filter(
        task => task.completed
    ).length;

    const active = total - completed;


    document.getElementById("totalCount").textContent = total;

    document.getElementById("activeCount").textContent = active;

    document.getElementById("completedCount").textContent = completed;

}


// =====================================
// ADD TASK
// =====================================

function addTask() {

    const taskInput = document.getElementById("taskInput");

    const text = taskInput.value.trim();


    if (text === "") {

        alert("Please enter a task!");

        return;

    }


    const newTask = {

        id: Date.now(),

        text: text,

        completed: false

    };


    tasks.push(newTask);


    saveTasks();

    taskInput.value = "";

    renderTasks();

}


// =====================================
// CREATE TASK ELEMENT
// =====================================

function createTaskElement(task) {

    const li = document.createElement("li");

    li.className = "task";


    if (task.completed) {

        li.classList.add("completed");

    }


    // Checkbox

    const checkbox = document.createElement("input");

    checkbox.type = "checkbox";

    checkbox.className = "task-checkbox";

    checkbox.checked = task.completed;


    checkbox.addEventListener("change", function () {

        task.completed = checkbox.checked;

        saveTasks();

        renderTasks();

    });


    // Task text

    const span = document.createElement("span");

    span.className = "task-text";

    span.textContent = task.text;


    // Edit button

    const editButton = document.createElement("button");

    editButton.textContent = "Edit";

    editButton.className = "edit-btn";


    editButton.addEventListener("click", function () {

        const newText = prompt(
            "Edit your task:",
            task.text
        );


        if (newText !== null && newText.trim() !== "") {

            task.text = newText.trim();

            saveTasks();

            renderTasks();

        }

    });


    // Delete button

    const deleteButton = document.createElement("button");

    deleteButton.textContent = "Delete";

    deleteButton.className = "delete-btn";


    deleteButton.addEventListener("click", function () {

        const confirmDelete = confirm(
            "Are you sure you want to delete this task?"
        );


        if (confirmDelete) {

            tasks = tasks.filter(
                item => item.id !== task.id
            );

            saveTasks();

            renderTasks();

        }

    });


    li.appendChild(checkbox);

    li.appendChild(span);

    li.appendChild(editButton);

    li.appendChild(deleteButton);


    return li;

}


// =====================================
// DISPLAY TASKS
// =====================================

function renderTasks() {

    const taskList = document.getElementById("taskList");

    taskList.innerHTML = "";


    let filteredTasks = tasks;


    // All tasks

    if (currentFilter === "all") {

        filteredTasks = tasks;

    }


    // Active tasks

    else if (currentFilter === "active") {

        filteredTasks = tasks.filter(
            task => !task.completed
        );

    }


    // Completed tasks

    else if (currentFilter === "completed") {

        filteredTasks = tasks.filter(
            task => task.completed
        );

    }


    // Display tasks

    filteredTasks.forEach(function (task) {

        const taskElement = createTaskElement(task);

        taskList.appendChild(taskElement);

    });


    updateCounters();

}


// =====================================
// FILTER BUTTONS
// =====================================

const filterButtons = document.querySelectorAll(
    ".filter-btn"
);


filterButtons.forEach(function (button) {

    button.addEventListener("click", function () {

        currentFilter = button.dataset.filter;


        // Remove active class

        filterButtons.forEach(function (btn) {

            btn.classList.remove("active-filter");

        });


        // Add active class

        button.classList.add("active-filter");


        renderTasks();

    });

});


// =====================================
// ADD BUTTON
// =====================================

document.getElementById("addBtn").addEventListener(
    "click",
    addTask
);


// =====================================
// ENTER KEY
// =====================================

document.getElementById("taskInput").addEventListener(
    "keydown",
    function (event) {

        if (event.key === "Enter") {

            addTask();

        }

    }
);


// =====================================
// INITIAL DISPLAY
// =====================================

renderTasks();