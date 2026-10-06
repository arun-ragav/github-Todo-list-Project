// ===============================
// THEME
// ===============================

const themeBtn = document.getElementById("themeBtn");

if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark-mode");
    themeBtn.textContent = "☀️ Light Mode";
}

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


// ===============================
// VARIABLES
// ===============================

let currentFilter = "all";
let currentCategory = "all";
let searchText = "";
let currentSortPriority = "default";

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];


// ===============================
// SAVE TASKS
// ===============================

function saveTasks() {

    localStorage.setItem(
        "tasks",
        JSON.stringify(tasks)
    );
}


// ===============================
// UPDATE COUNTERS
// ===============================

function updateCounters() {

    const total = tasks.length;

    const completed = tasks.filter(
        function (task) {
            return task.completed;
        }
    ).length;

    const active = total - completed;

    document.getElementById("totalCount").textContent = total;

    document.getElementById("activeCount").textContent = active;

    document.getElementById("completedCount").textContent = completed;
}


// ===============================
// ADD TASK
// ===============================

function addTask() {

    const taskInput =
        document.getElementById("taskInput");

    const taskDate =
        document.getElementById("taskDate");

    const taskTime =
        document.getElementById("taskTime");

    const taskPriority =
        document.getElementById("taskPriority");

    const taskCategory =
        document.getElementById("taskCategory");


    const text = taskInput.value.trim();


    if (text === "") {

        alert("Please enter a task!");

        return;
    }


    const newTask = {

        id: Date.now(),

        text: text,

        date: taskDate.value,

        time: taskTime.value,

        priority: taskPriority.value,

        category: taskCategory.value,

        completed: false
    };


    tasks.push(newTask);

    saveTasks();


    // Clear inputs

    taskInput.value = "";

    taskDate.value = "";

    taskTime.value = "";

    taskPriority.value = "medium";

    taskCategory.value = "study";


    renderTasks();
}


// ===============================
// CREATE TASK ELEMENT
// ===============================

function createTaskElement(task) {

    const li = document.createElement("li");

    li.classList.add("task");


    // Priority

    li.classList.add(
        "priority-" + (task.priority || "medium")
    );


    // Completed

    if (task.completed) {

        li.classList.add("completed");
    }


    // ===========================
    // CHECKBOX
    // ===========================

    const checkbox =
        document.createElement("input");

    checkbox.type = "checkbox";

    checkbox.checked = task.completed;


    checkbox.addEventListener(
        "change",
        function () {

            task.completed =
                checkbox.checked;

            saveTasks();

            renderTasks();
        }
    );


    // ===========================
    // CONTENT
    // ===========================

    const content =
        document.createElement("div");

    content.classList.add("task-content");


    // Task text

    const taskText =
        document.createElement("div");

    taskText.classList.add("task-text");

    taskText.textContent = task.text;


    // Information

    const info =
        document.createElement("div");

    info.classList.add("task-info");


    // ===========================
    // DATE
    // ===========================

    if (task.date) {

        const date =
            document.createElement("span");

        date.classList.add("task-date");

        date.textContent =
            "📅 " + task.date;

        info.appendChild(date);
    }


    // ===========================
    // TIME
    // ===========================

    if (task.time) {

        const time =
            document.createElement("span");

        time.classList.add("task-time");

        time.textContent =
            "⏰ " + task.time;

        info.appendChild(time);
    }


    // ===========================
    // PRIORITY
    // ===========================

    const priority =
        document.createElement("span");

    priority.classList.add("task-priority");


    if (task.priority === "high") {

        priority.textContent = "🔴 High";

    } else if (task.priority === "low") {

        priority.textContent = "🟢 Low";

    } else {

        priority.textContent = "🟡 Medium";
    }


    info.appendChild(priority);


    // ===========================
    // CATEGORY
    // ===========================

    const category =
        document.createElement("span");

    category.classList.add("task-category");


    if (task.category === "study") {

        category.textContent = "📚 Study";

    } else if (task.category === "college") {

        category.textContent = "🎓 College";

    } else if (task.category === "project") {

        category.textContent = "💻 Project";

    } else if (task.category === "personal") {

        category.textContent = "🏠 Personal";

    } else {

        category.textContent = "📌 Other";
    }


    info.appendChild(category);


    content.appendChild(taskText);

    content.appendChild(info);


    // ===========================
    // ACTIONS
    // ===========================

    const actions =
        document.createElement("div");

    actions.classList.add("task-actions");


    // ===========================
    // EDIT BUTTON
    // ===========================

    const editBtn =
        document.createElement("button");

    editBtn.classList.add("edit-btn");

    editBtn.textContent = "✏️ Edit";


    editBtn.addEventListener(
        "click",
        function () {

            const newText =
                prompt(
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


    // ===========================
    // DELETE BUTTON
    // ===========================

    const deleteBtn =
        document.createElement("button");

    deleteBtn.classList.add("delete-btn");

    deleteBtn.textContent = "🗑️ Delete";


    deleteBtn.addEventListener(
        "click",
        function () {

            const confirmDelete =
                confirm(
                    "Are you sure you want to delete this task?"
                );


            if (confirmDelete) {

                tasks = tasks.filter(
                    function (item) {

                        return item.id !== task.id;
                    }
                );


                saveTasks();

                renderTasks();
            }
        }
    );


    actions.appendChild(editBtn);

    actions.appendChild(deleteBtn);


    // ===========================
    // ADD EVERYTHING
    // ===========================

    li.appendChild(checkbox);

    li.appendChild(content);

    li.appendChild(actions);


    return li;
}


// ===============================
// RENDER TASKS
// ===============================

function renderTasks() {

    const taskList =
        document.getElementById("taskList");


    taskList.innerHTML = "";


    let filteredTasks = [...tasks];


    // ===========================
    // SEARCH
    // ===========================

    if (searchText !== "") {

        filteredTasks =
            filteredTasks.filter(
                function (task) {

                    return task.text
                        .toLowerCase()
                        .includes(
                            searchText.toLowerCase()
                        );
                }
            );
    }


    // ===========================
    // STATUS FILTER
    // ===========================

    if (currentFilter === "active") {

        filteredTasks =
            filteredTasks.filter(
                function (task) {

                    return !task.completed;
                }
            );

    } else if (
        currentFilter === "completed"
    ) {

        filteredTasks =
            filteredTasks.filter(
                function (task) {

                    return task.completed;
                }
            );
    }


    // ===========================
    // CATEGORY FILTER
    // ===========================

    if (currentCategory !== "all") {

        filteredTasks =
            filteredTasks.filter(
                function (task) {

                    return (
                        task.category ===
                        currentCategory
                    );
                }
            );
    }


    // ===========================
    // PRIORITY SORTING
    // ===========================

    const priorityOrder = {

        high: 1,

        medium: 2,

        low: 3
    };


    if (currentSortPriority === "high") {

        filteredTasks.sort(
            function (a, b) {

                return (
                    priorityOrder[a.priority] -
                    priorityOrder[b.priority]
                );
            }
        );

    } else if (
        currentSortPriority === "low"
    ) {

        filteredTasks.sort(
            function (a, b) {

                return (
                    priorityOrder[b.priority] -
                    priorityOrder[a.priority]
                );
            }
        );
    }


    // ===========================
    // DISPLAY TASKS
    // ===========================

    filteredTasks.forEach(
        function (task) {

            const taskElement =
                createTaskElement(task);

            taskList.appendChild(
                taskElement
            );
        }
    );


    updateCounters();
}


// ===============================
// STATUS FILTER BUTTONS
// ===============================

const filterButtons =
    document.querySelectorAll(
        ".filter-btn"
    );


filterButtons.forEach(
    function (button) {

        button.addEventListener(
            "click",
            function () {

                filterButtons.forEach(
                    function (btn) {

                        btn.classList.remove(
                            "active-filter"
                        );
                    }
                );


                button.classList.add(
                    "active-filter"
                );


                currentFilter =
                    button.dataset.filter;


                renderTasks();
            }
        );
    }
);


// ===============================
// CATEGORY FILTER BUTTONS
// ===============================

const categoryButtons =
    document.querySelectorAll(
        ".category-btn"
    );


categoryButtons.forEach(
    function (button) {

        button.addEventListener(
            "click",
            function () {

                categoryButtons.forEach(
                    function (btn) {

                        btn.classList.remove(
                            "active-category"
                        );
                    }
                );


                button.classList.add(
                    "active-category"
                );


                currentCategory =
                    button.dataset.category;


                renderTasks();
            }
        );
    }
);


// ===============================
// SEARCH
// ===============================

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


// ===============================
// PRIORITY SORT
// ===============================

const sortPrioritySelect =
    document.getElementById(
        "sortPriority"
    );


sortPrioritySelect.addEventListener(
    "change",
    function () {

        currentSortPriority =
            sortPrioritySelect.value;

        renderTasks();
    }
);


// ===============================
// ADD BUTTON
// ===============================

document
    .getElementById("addBtn")
    .addEventListener(
        "click",
        addTask
    );


// ===============================
// ENTER KEY
// ===============================

document
    .getElementById("taskInput")
    .addEventListener(
        "keydown",
        function (event) {

            if (event.key === "Enter") {

                addTask();
            }
        }
    );


// ===============================
// INITIAL DISPLAY
// ===============================

renderTasks();