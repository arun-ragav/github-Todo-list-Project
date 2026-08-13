// =====================================
// GET HTML ELEMENTS
// =====================================

const taskInput = document.getElementById("taskInput");

const addBtn = document.getElementById("addBtn");

const taskList = document.getElementById("taskList");


// =====================================
// SHOW EMPTY MESSAGE
// =====================================

function showEmptyMessage() {

    if (taskList.children.length === 0) {

        const message = document.createElement("li");

        message.className = "empty-message";

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
// ADD TASK FUNCTION
// =====================================

function addTask() {

    // Get task text

    const task = taskInput.value.trim();


    // Check if input is empty

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

    const li = document.createElement("li");


    // =================================
    // CREATE TASK CONTENT
    // =================================

    const taskContent =
        document.createElement("div");

    taskContent.className = "task-content";


    // =================================
    // CREATE CHECKBOX
    // =================================

    const checkbox =
        document.createElement("input");

    checkbox.type = "checkbox";


    // =================================
    // CREATE TASK TEXT
    // =================================

    const taskText =
        document.createElement("span");

    taskText.textContent = task;


    // =================================
    // COMPLETE / UNCOMPLETE TASK
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
    // CREATE DELETE BUTTON
    // =================================

    const deleteBtn =
        document.createElement("button");

    deleteBtn.textContent = "Delete";

    deleteBtn.className = "delete-btn";


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
    // ADD ELEMENTS TO TASK CONTENT
    // =================================

    taskContent.appendChild(checkbox);

    taskContent.appendChild(taskText);


    // =================================
    // ADD CONTENT TO LIST ITEM
    // =================================

    li.appendChild(taskContent);

    li.appendChild(deleteBtn);


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
// ADD BUTTON CLICK
// =====================================

addBtn.addEventListener(
    "click",
    addTask
);


// =====================================
// ENTER KEY SUPPORT
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