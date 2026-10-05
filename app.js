// =====================================
// DARK / LIGHT MODE
// =====================================

const themeBtn =
    document.getElementById("themeBtn");


if (
    localStorage.getItem("theme") === "dark"
) {

    document.body.classList.add(
        "dark-mode"
    );

    themeBtn.textContent =
        "☀️ Light Mode";

}


themeBtn.addEventListener(
    "click",
    function () {

        document.body.classList.toggle(
            "dark-mode"
        );


        if (
            document.body.classList.contains(
                "dark-mode"
            )
        ) {

            localStorage.setItem(
                "theme",
                "dark"
            );

            themeBtn.textContent =
                "☀️ Light Mode";

        }

        else {

            localStorage.setItem(
                "theme",
                "light"
            );

            themeBtn.textContent =
                "🌙 Dark Mode";

        }

    }
);



// =====================================
// TODO LIST
// =====================================

let currentFilter = "all";

let searchText = "";

let sortPriority = "default";


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

    const total =
        tasks.length;


    const completed =
        tasks.filter(
            task => task.completed
        ).length;


    const active =
        total - completed;


    document.getElementById(
        "totalCount"
    ).textContent = total;


    document.getElementById(
        "activeCount"
    ).textContent = active;


    document.getElementById(
        "completedCount"
    ).textContent = completed;

}



// =====================================
// ADD TASK
// =====================================

function addTask() {

    const taskInput =
        document.getElementById(
            "taskInput"
        );


    const taskDate =
        document.getElementById(
            "taskDate"
        );


    const taskTime =
        document.getElementById(
            "taskTime"
        );


    const taskPriority =
        document.getElementById(
            "taskPriority"
        );


    const taskCategory =
        document.getElementById(
            "taskCategory"
        );


    const text =
        taskInput.value.trim();


    if (text === "") {

        alert(
            "Please enter a task!"
        );

        return;

    }


    // Create task

    const newTask = {

        id: Date.now(),

        text: text,

        date: taskDate.value,

        time: taskTime.value,

        priority:
            taskPriority.value,

        category:
            taskCategory.value,

        completed: false

    };


    tasks.push(newTask);


    saveTasks();


    // Clear inputs

    taskInput.value = "";

    taskDate.value = "";

    taskTime.value = "";

    taskPriority.value =
        "medium";

    taskCategory.value =
        "study";


    renderTasks();

}



// =====================================
// CREATE TASK ELEMENT
// =====================================

function createTaskElement(task) {

    const li =
        document.createElement("li");


    li.className = "task";


    // =================================
    // COMPLETED CLASS
    // =================================

    if (task.completed) {

        li.classList.add(
            "completed"
        );

    }


    // =================================
    // PRIORITY CLASS
    // =================================

    if (task.priority === "high") {

        li.classList.add(
            "priority-high"
        );

    }

    else if (
        task.priority === "medium"
    ) {

        li.classList.add(
            "priority-medium"
        );

    }

    else {

        li.classList.add(
            "priority-low"
        );

    }



    // =================================
    // CHECKBOX
    // =================================

    const checkbox =
        document.createElement(
            "input"
        );


    checkbox.type =
        "checkbox";


    checkbox.className =
        "task-checkbox";


    checkbox.checked =
        task.completed;


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
    // TASK CONTENT
    // =================================

    const content =
        document.createElement(
            "div"
        );


    content.className =
        "task-content";



    // =================================
    // TASK TEXT
    // =================================

    const span =
        document.createElement(
            "span"
        );


    span.className =
        "task-text";


    span.textContent =
        task.text;



    // =================================
    // DATE AND TIME
    // =================================

    const dateInfo =
        document.createElement(
            "small"
        );


    dateInfo.className =
        "task-date";


    if (
        task.date ||
        task.time
    ) {

        let dateText = "";


        if (task.date) {

            dateText +=
                "📅 " + task.date;

        }


        if (task.time) {

            dateText +=
                "  ⏰ " + task.time;

        }


        dateInfo.textContent =
            dateText;

    }

    else {

        dateInfo.textContent =
            "No due date";

    }



    // =================================
    // PRIORITY
    // =================================

    const priorityInfo =
        document.createElement(
            "small"
        );


    priorityInfo.className =
        "task-priority";


    if (
        task.priority === "high"
    ) {

        priorityInfo.textContent =
            "🔴 High Priority";

    }

    else if (
        task.priority === "low"
    ) {

        priorityInfo.textContent =
            "🟢 Low Priority";

    }

    else {

        priorityInfo.textContent =
            "🟡 Medium Priority";

    }



    // =================================
    // CATEGORY
    // =================================

    const categoryInfo =
        document.createElement(
            "small"
        );


    categoryInfo.className =
        "task-category";


    if (
        task.category === "study"
    ) {

        categoryInfo.textContent =
            "📚 Study";

    }

    else if (
        task.category === "college"
    ) {

        categoryInfo.textContent =
            "🎓 College";

    }

    else if (
        task.category === "project"
    ) {

        categoryInfo.textContent =
            "💻 Project";

    }

    else if (
        task.category === "personal"
    ) {

        categoryInfo.textContent =
            "🏠 Personal";

    }

    else {

        categoryInfo.textContent =
            "📌 Other";

    }



    // =================================
    // ADD CONTENT
    // =================================

    content.appendChild(
        span
    );


    content.appendChild(
        dateInfo
    );


    content.appendChild(
        priorityInfo
    );


    content.appendChild(
        categoryInfo
    );



    // =================================
    // EDIT BUTTON
    // =================================

    const editButton =
        document.createElement(
            "button"
        );


    editButton.textContent =
        "Edit";


    editButton.className =
        "edit-btn";


    editButton.addEventListener(
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



    // =================================
    // DELETE BUTTON
    // =================================

    const deleteButton =
        document.createElement(
            "button"
        );


    deleteButton.textContent =
        "Delete";


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

                tasks =
                    tasks.filter(
                        item =>
                            item.id !==
                            task.id
                    );


                saveTasks();

                renderTasks();

            }

        }
    );



    // =================================
    // ADD EVERYTHING
    // =================================

    li.appendChild(
        checkbox
    );


    li.appendChild(
        content
    );


    li.appendChild(
        editButton
    );


    li.appendChild(
        deleteButton
    );


    return li;

}



// =====================================
// DISPLAY TASKS
// =====================================

function renderTasks() {

    const taskList =
        document.getElementById(
            "taskList"
        );


    taskList.innerHTML = "";



    // =================================
    // SEARCH
    // =================================

    let filteredTasks =
        tasks.filter(
            function (task) {

                return task.text
                    .toLowerCase()
                    .includes(
                        searchText
                            .toLowerCase()
                    );

            }
        );



    // =================================
    // ACTIVE FILTER
    // =================================

    if (
        currentFilter === "active"
    ) {

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

    if (
        currentFilter === "completed"
    ) {

        filteredTasks =
            filteredTasks.filter(
                function (task) {

                    return task.completed;

                }
            );

    }



    // =================================
    // PRIORITY SORT
    // =================================

    if (
        sortPriority === "high"
    ) {

        const priorityOrder = {

            high: 1,

            medium: 2,

            low: 3

        };


        filteredTasks.sort(
            function (a, b) {

                return (
                    priorityOrder[a.priority] -
                    priorityOrder[b.priority]
                );

            }
        );

    }


    if (
        sortPriority === "low"
    ) {

        const priorityOrder = {

            high: 3,

            medium: 2,

            low: 1

        };


        filteredTasks.sort(
            function (a, b) {

                return (
                    priorityOrder[a.priority] -
                    priorityOrder[b.priority]
                );

            }
        );

    }



    // =================================
    // DISPLAY TASKS
    // =================================

    filteredTasks.forEach(
        function (task) {

            const taskElement =
                createTaskElement(
                    task
                );


            taskList.appendChild(
                taskElement
            );

        }
    );


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

                currentFilter =
                    button.dataset.filter;


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


                renderTasks();

            }
        );

    }
);



// =====================================
// SEARCH
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
// PRIORITY SORT
// =====================================

const sortPrioritySelect =
    document.getElementById(
        "sortPriority"
    );


sortPrioritySelect.addEventListener(
    "change",
    function () {

        sortPriority =
            sortPrioritySelect.value;


        renderTasks();

    }
);



// =====================================
// ADD BUTTON
// =====================================

document.getElementById(
    "addBtn"
).addEventListener(
    "click",
    addTask
);



// =====================================
// ENTER KEY
// =====================================

document.getElementById(
    "taskInput"
).addEventListener(
    "keydown",
    function (event) {

        if (
            event.key === "Enter"
        ) {

            addTask();

        }

    }
);



// =====================================
// INITIAL DISPLAY
// =====================================

renderTasks();