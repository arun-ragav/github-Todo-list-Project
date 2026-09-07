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
// CURRENT FILTER
// =====================================

let currentFilter = "all";


// =====================================
// SHOW EMPTY MESSAGE
// =====================================

function showEmptyMessage() {

    if (taskList.children.length === 0) {

        const message =
            document.createElement("li");

        message.className =
            "empty-message";

        message.textContent =
            "📋 No tasks to display.";

        taskList.appendChild(message);

    }

}


// =====================================
// REMOVE EMPTY MESSAGE
// =====================================

function removeEmptyMessage() {

    const message =
        document.querySelector(".empty-message");

    if (message) {

        message.remove();

    }

}


// =====================================
// ADD TASK
// =====================================

function addTask() {

    const task =
        taskInput.value.trim();


    // Check empty input

    if (task === "") {

        alert("Please enter a task!");

        taskInput.focus();

        return;

    }


    // Remove empty message

    removeEmptyMessage();


    // =================================
    // CREATE LIST ITEM
    // =================================

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


    // =================================
    // TASK TEXT
    // =================================

    const taskText =
        document.createElement("span");

    taskText.textContent = task;


    // =================================
    // COMPLETE TASK
    // =================================

    checkbox.addEventListener(
        "change",
        function () {

            if (checkbox.checked) {

                taskText.classList.add(
                    "completed"
                );

            } else {

                taskText.classList.remove(
                    "completed"
                );

            }

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

    editBtn.className = "edit-btn";


    editBtn.addEventListener(
        "click",
        function () {

            const currentTask =
                taskText.textContent;

            const newTask =
                prompt(
                    "Edit your task:",
                    currentTask
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


            taskText.textContent =
                newTask.trim();

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

            li.remove();

            applyFilter();

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


    // =================================
    // ADD TASK TO LIST
    // =================================

    taskList.appendChild(li);


    // =================================
    // CLEAR INPUT
    // =================================

    taskInput.value = "";

    taskInput.focus();


    // Apply current filter

    applyFilter();

}


// =====================================
// APPLY FILTER
// =====================================

function applyFilter() {

    const tasks =
        taskList.querySelectorAll(
            "li:not(.empty-message)"
        );


    let visibleTasks = 0;


    tasks.forEach(function (task) {

        const checkbox =
            task.querySelector(
                'input[type="checkbox"]'
            );


        const completed =
            checkbox.checked;


        if (currentFilter === "all") {

            task.style.display = "flex";

            visibleTasks++;

        }


        else if (
            currentFilter === "active"
        ) {

            if (completed) {

                task.style.display = "none";

            } else {

                task.style.display = "flex";

                visibleTasks++;

            }

        }


        else if (
            currentFilter === "completed"
        ) {

            if (completed) {

                task.style.display = "flex";

                visibleTasks++;

            } else {

                task.style.display = "none";

            }

        }

    });


    // Remove old empty message

    const oldMessage =
        document.querySelector(
            ".empty-message"
        );


    if (oldMessage) {

        oldMessage.remove();

    }


    // Show message if no tasks match

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


        taskList.appendChild(message);

    }

}


// =====================================
// FILTER BUTTONS
// =====================================

filterButtons.forEach(function (button) {

    button.addEventListener(
        "click",
        function () {

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


            // Get selected filter

            currentFilter =
                button.dataset.filter;


            // Apply filter

            applyFilter();

        }
    );

});


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
// INITIAL DISPLAY
// =====================================

applyFilter();