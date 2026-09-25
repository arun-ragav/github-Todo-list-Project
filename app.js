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

let searchText = "";


// Get saved tasks
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];


// =====================================
// SAVE TASKS
// =====================================

function saveTasks() {

    localStorage.setItem(
        "tasks",
        JSON.stringify(tasks)
    );

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


    document.getElementById("totalCount").textContent =
        total;

    document.getElementById("activeCount").textContent =
        active;

    document.getElementById("completedCount").textContent =
        completed;

}


// =====================================
// ADD TASK
// =====================================

function addTask() {

    const taskInput =
        document.getElementById("taskInput");

    const taskDate =
        document.getElementById("taskDate");

    const taskTime =
        document.getElementById("taskTime");


    const text = taskInput.value.trim();


    // Check empty task
    if (text === "") {

        alert("Please enter a task!");

        return;

    }


    // Create new task
    const newTask = {

        id: Date.now(),

        text: text,

        date: taskDate.value,

        time: taskTime.value,

        completed: false

    };


    // Add task
    tasks.push(newTask);


    // Save task
    saveTasks();


    // Clear inputs
    taskInput.value = "";

    taskDate.value = "";

    taskTime.value = "";


    // Display tasks
    renderTasks();

}


// =====================================
// CREATE TASK ELEMENT
// =====================================

function createTaskElement(task) {

    const li = document.createElement("li");

    li.className = "task";


    // Add completed class
    if (task.completed) {

        li.classList.add("completed");

    }


    // =================================
    // CHECKBOX
    // =================================

    const checkbox =
        document.createElement("input");

    checkbox.type = "checkbox";

    checkbox.className = "task-checkbox";

    checkbox.checked = task.completed;


    checkbox.addEventListener(
        "change",
        function () {

            task.completed = checkbox.checked;

            saveTasks();

            renderTasks();

        }
    );


    // =================================
    // TASK CONTENT
    // =================================

    const content =
        document.createElement("div");

    content.className = "task-content";


    // =================================
    // TASK TEXT
    // =================================

    const span =
        document.createElement("span");

    span.className = "task-text";

    span.textContent = task.text;


    // =================================
    // DATE AND TIME
    // =================================

    const dateInfo =
        document.createElement("small");

    dateInfo.className = "task-date";


    if (task.date || task.time) {

        let dateText = "";


        if (task.date) {

            dateText += "📅 " + task.date;

        }


        if (task.time) {

            dateText += "  ⏰ " + task.time;

        }


        dateInfo.textContent = dateText;

    } else {

        dateInfo.textContent =
            "No due date";

    }


    // Add content
    content.appendChild(span);

    content.appendChild(dateInfo);


    // =================================
    // EDIT BUTTON
    // =================================

    const editButton =
        document.createElement("button");

    editButton.textContent = "Edit";

    editButton.className = "edit-btn";


    editButton.addEventListener(
        "click",
        function () {

            const newText = prompt(
                "Edit your task:",
                task.text
            );


            if (
                newText !== null &&
                newText.trim() !== ""
            ) {

                task.text =
                    newText.trim();

                saveTasks();

                renderTasks();

            }

        }
    );


    // =================================
    // DELETE BUTTON
    // =================================

    const deleteButton =
        document.createElement("button");

    deleteButton.textContent = "Delete";

    deleteButton.className =
        "delete-btn";


    deleteButton.addEventListener(
        "click",
        function () {

            const confirmDelete =
                confirm(
                    "Are you sure you want to delete this task?"
                );


            if (confirmDelete) {

                tasks = tasks.filter(
                    item => item.id !== task.id
                );


                saveTasks();

                renderTasks();

            }

        }
    );


    // =================================
    // ADD EVERYTHING TO TASK
    // =================================

    li.appendChild(checkbox);

    li.appendChild(content);

    li.appendChild(editButton);

    li.appendChild(deleteButton);


    return li;

}


// =====================================
// DISPLAY TASKS
// =====================================

function renderTasks() {

    const taskList =
        document.getElementById("taskList");


    // Clear current list
    taskList.innerHTML = "";


    // =================================
    // SEARCH FILTER
    // =================================

    let filteredTasks = tasks.filter(
        function (task) {

            return task.text
                .toLowerCase()
                .includes(
                    searchText.toLowerCase()
                );

        }
    );


    // =================================
    // ACTIVE FILTER
    // =================================

    if (currentFilter === "active") {

        filteredTasks =
            filteredTasks.filter(
                function (task) {

                    return !task.completed;

                }
            );

    }


    // =================================
    // COMPLETED FILTER
    // =================================

    if (currentFilter === "completed") {

        filteredTasks =
            filteredTasks.filter(
                function (task) {

                    return task.completed;

                }
            );

    }


    // =================================
    // DISPLAY TASKS
    // =================================

    filteredTasks.forEach(
        function (task) {

            const taskElement =
                createTaskElement(task);

            taskList.appendChild(
                taskElement
            );

        }
    );


    // Update counters
    updateCounters();

}


// =====================================
// FILTER BUTTONS
// =====================================

const filterButtons =
    document.querySelectorAll(
        ".filter-btn"
    );


filterButtons.forEach(
    function (button) {

        button.addEventListener(
            "click",
            function () {

                // Get selected filter
                currentFilter =
                    button.dataset.filter;


                // Remove active class
                filterButtons.forEach(
                    function (btn) {

                        btn.classList.remove(
                            "active-filter"
                        );

                    }
                );


                // Add active class
                button.classList.add(
                    "active-filter"
                );


                // Display tasks
                renderTasks();

            }
        );

    }
);


// =====================================
// SEARCH TASKS
// =====================================

const searchInput =
    document.getElementById(
        "searchInput"
    );


searchInput.addEventListener(
    "input",
    function () {

        searchText =
            searchInput.value.trim();


        renderTasks();

    }
);


// =====================================
// ADD BUTTON
// =====================================

document.getElementById("addBtn")
    .addEventListener(
        "click",
        addTask
    );


// =====================================
// ENTER KEY
// =====================================

document.getElementById("taskInput")
    .addEventListener(
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