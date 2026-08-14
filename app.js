// =====================================
// GET HTML ELEMENTS
// =====================================

const taskInput =
    document.getElementById("taskInput");

const addBtn =
    document.getElementById("addBtn");

const taskList =
    document.getElementById("taskList");


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
            "📋 No tasks yet. Add a task!";

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


    // =================================
    // EDIT TASK
    // =================================

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


            // Cancel button pressed

            if (newTask === null) {

                return;

            }


            // Empty input

            if (newTask.trim() === "") {

                alert(
                    "Task cannot be empty!"
                );

                return;

            }


            // Update task

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


    // =================================
    // DELETE TASK
    // =================================

    deleteBtn.addEventListener(
        "click",
        function () {

            li.remove();

            showEmptyMessage();

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

}


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
// INITIAL MESSAGE
// =====================================

showEmptyMessage();