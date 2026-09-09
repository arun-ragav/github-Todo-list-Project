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


// =====================================
// VARIABLES
// =====================================

let currentFilter = "all";


// =====================================
// LOAD TASKS FROM LOCAL STORAGE
// =====================================

let tasks =
    JSON.parse(localStorage.getItem("tasks")) || [];


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
// CREATE TASK
// =====================================

function createTask(task) {

    const li =
        document.createElement("li");


    // Add completed class

    if (task.completed) {

        li.classList.add("task-completed");

    }


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


            if (checkbox.checked) {

                taskText.classList.add(
                    "completed"
                );

            } else {

                taskText.classList.remove(
                    "completed"
                );

            }


            saveTasks();

            applyFilter();

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

            const newTask =
                prompt(
                    "Edit your task:",
                    task.text
                );


            if (newTask === null) {

                return;

            }


            if (newTask.trim() === "") {

                alert(
                    "Task cannot be empty!"
                );

                return;

            }


            task.text =
                newTask.trim();


            taskText.textContent =
                task.text;


            saveTasks();

        }
    );


    // =================================
    // DELETE BUTTON
    // =================================

    const deleteBtn =
        document.createElement("button");

    deleteBtn.textContent = "Delete";

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
    // ADD ELEMENTS
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


    return li;

}


// =====================================
// RENDER TASKS
// =====================================

function renderTasks() {

    taskList.innerHTML = "";


    tasks.forEach(
        function (task) {

            const taskElement =
                createTask(task);

            taskList.appendChild(
                taskElement
            );

        }
    );


    applyFilter();

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
// FILTER TASKS
// =====================================

function applyFilter() {

    const taskElements =
        taskList.querySelectorAll(
            "li"
        );


    let visibleTasks = 0;


    taskElements.forEach(
        function (taskElement, index) {

            const task =
                tasks[index];


            if (!task) {

                return;

            }


            if (currentFilter === "all") {

                taskElement.style.display =
                    "flex";

                visibleTasks++;

            }


            else if (
                currentFilter === "active"
            ) {

                if (task.completed) {

                    taskElement.style.display =
                        "none";

                } else {

                    taskElement.style.display =
                        "flex";

                    visibleTasks++;

                }

            }


            else if (
                currentFilter === "completed"
            ) {

                if (task.completed) {

                    taskElement.style.display =
                        "flex";

                    visibleTasks++;

                } else {

                    taskElement.style.display =
                        "none";

                }

            }

        }
    );


    // Remove old message

    const oldMessage =
        document.querySelector(
            ".empty-message"
        );


    if (oldMessage) {

        oldMessage.remove();

    }


    // Show message

    if (visibleTasks === 0) {

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


                applyFilter();

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
// LOAD SAVED TASKS
// =====================================

renderTasks();