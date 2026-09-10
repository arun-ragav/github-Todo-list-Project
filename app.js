// =====================================
// GET HTML ELEMENTS
// =====================================

const taskInput =
    document.getElementById("taskInput");

const addBtn =
    document.getElementById("addBtn");

const taskList =
    document.getElementById("taskList");

const filterButtons =
    document.querySelectorAll(".filter-btn");

const totalCount =
    document.getElementById("totalCount");

const activeCount =
    document.getElementById("activeCount");

const completedCount =
    document.getElementById("completedCount");


// =====================================
// VARIABLES
// =====================================

let currentFilter = "all";


// =====================================
// LOAD TASKS
// =====================================

let tasks =
    JSON.parse(
        localStorage.getItem("tasks")
    ) || [];


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

    const completed =
        tasks.filter(
            function (task) {

                return task.completed;

            }
        ).length;


    const active =
        total - completed;


    totalCount.textContent =
        total;

    activeCount.textContent =
        active;

    completedCount.textContent =
        completed;

}


// =====================================
// ADD TASK
// =====================================

function addTask() {

    const text =
        taskInput.value.trim();


    if (text === "") {

        alert(
            "Please enter a task!"
        );

        taskInput.focus();

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

    taskInput.focus();


    renderTasks();

}


// =====================================
// CREATE TASK ELEMENT
// =====================================

function createTaskElement(task) {

    const li =
        document.createElement("li");


    // =================================
    // TASK CONTENT
    // =================================

    const taskContent =
        document.createElement("div");

    taskContent.className =
        "task-content";


    // =================================
    // CHECKBOX
    // =================================

    const checkbox =
        document.createElement("input");

    checkbox.type = "checkbox";

    checkbox.checked =
        task.completed;


    // =================================
    // TASK TEXT
    // =================================

    const taskText =
        document.createElement("span");

    taskText.textContent =
        task.text;


    if (task.completed) {

        taskText.classList.add(
            "completed"
        );

    }


    // =================================
    // CHECKBOX EVENT
    // =================================

    checkbox.addEventListener(
        "change",
        function () {

            task.completed =
                checkbox.checked;


            saveTasks();

            renderTasks();

        }
    );


    // =================================
    // BUTTON GROUP
    // =================================

    const taskButtons =
        document.createElement("div");

    taskButtons.className =
        "task-buttons";


    // =================================
    // EDIT BUTTON
    // =================================

    const editBtn =
        document.createElement("button");

    editBtn.textContent = "Edit";

    editBtn.className =
        "edit-btn";


    editBtn.addEventListener(
        "click",
        function () {

            const newText =
                prompt(
                    "Edit your task:",
                    task.text
                );


            if (newText === null) {

                return;

            }


            if (newText.trim() === "") {

                alert(
                    "Task cannot be empty!"
                );

                return;

            }


            task.text =
                newText.trim();


            saveTasks();

            renderTasks();

        }
    );


    // =================================
    // DELETE BUTTON
    // =================================

    const deleteBtn =
        document.createElement("button");

    deleteBtn.textContent =
        "Delete";

    deleteBtn.className =
        "delete-btn";


    deleteBtn.addEventListener(
        "click",
        function () {

            tasks =
                tasks.filter(
                    function (item) {

                        return item.id !== task.id;

                    }
                );


            saveTasks();

            renderTasks();

        }
    );


    // =================================
    // APPEND ELEMENTS
    // =================================

    taskContent.appendChild(
        checkbox
    );

    taskContent.appendChild(
        taskText
    );


    taskButtons.appendChild(
        editBtn
    );

    taskButtons.appendChild(
        deleteBtn
    );


    li.appendChild(
        taskContent
    );

    li.appendChild(
        taskButtons
    );


    taskList.appendChild(li);

}


// =====================================
// RENDER TASKS
// =====================================

function renderTasks() {

    taskList.innerHTML = "";


    const filteredTasks =
        tasks.filter(
            function (task) {

                if (
                    currentFilter ===
                    "active"
                ) {

                    return !task.completed;

                }


                if (
                    currentFilter ===
                    "completed"
                ) {

                    return task.completed;

                }


                return true;

            }
        );


    // =================================
    // EMPTY MESSAGE
    // =================================

    if (filteredTasks.length === 0) {

        const message =
            document.createElement("li");

        message.className =
            "empty-message";


        if (currentFilter === "all") {

            message.textContent =
                "📋 No tasks yet. Add a task!";

        }

        else if (
            currentFilter === "active"
        ) {

            message.textContent =
                "🎉 No active tasks!";

        }

        else {

            message.textContent =
                "📋 No completed tasks yet.";

        }


        taskList.appendChild(
            message
        );

    }


    // =================================
    // DISPLAY TASKS
    // =================================

    filteredTasks.forEach(
        function (task) {

            createTaskElement(task);

        }
    );


    // Update counters

    updateCounters();

}


// =====================================
// FILTER BUTTONS
// =====================================

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


// =====================================
// ADD BUTTON
// =====================================

addBtn.addEventListener(
    "click",
    addTask
);


// =====================================
// ENTER KEY
// =====================================

taskInput.addEventListener(
    "keydown",
    function (event) {

        if (event.key === "Enter") {

            addTask();

        }

    }
);


// =====================================
// INITIAL LOAD
// =====================================

renderTasks();