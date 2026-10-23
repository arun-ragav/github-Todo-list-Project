
"use strict";

// =====================================
// V17 TO-DO LIST PROJECT
// =====================================

// CATEGORY LABELS
const categoryLabels = {
    study: "📚 Study",
    college: "🎓 College",
    project: "💻 Project",
    personal: "🏠 Personal",
    other: "📌 Other"
};

const priorityLabels = {
    high: "🔴 High",
    medium: "🟡 Medium",
    low: "🟢 Low"
};

const priorityOrder = {
    high: 1,
    medium: 2,
    low: 3
};


// =====================================
// ELEMENTS
// =====================================

const taskInput = document.getElementById("taskInput");
const taskDate = document.getElementById("taskDate");
const taskTime = document.getElementById("taskTime");
const taskPriority = document.getElementById("taskPriority");
const taskCategory = document.getElementById("taskCategory");
const addBtn = document.getElementById("addBtn");

const taskList = document.getElementById("taskList");
const emptyMessage = document.getElementById("emptyMessage");
const searchInput = document.getElementById("searchInput");
const sortPrioritySelect = document.getElementById("sortPriority");
const themeBtn = document.getElementById("themeBtn");

const editTaskSection = document.getElementById("editTaskSection");
const editTaskId = document.getElementById("editTaskId");
const editTaskInput = document.getElementById("editTaskInput");
const editTaskDate = document.getElementById("editTaskDate");
const editTaskTime = document.getElementById("editTaskTime");
const editTaskPriority = document.getElementById("editTaskPriority");
const editTaskCategory = document.getElementById("editTaskCategory");
const saveEditBtn = document.getElementById("saveEditBtn");
const cancelEditBtn = document.getElementById("cancelEditBtn");


// =====================================
// LOAD SAVED TASKS
// =====================================

function loadTasks() {
    try {
        const savedTasks = JSON.parse(
            localStorage.getItem("tasks") || "[]"
        );

        if (!Array.isArray(savedTasks)) {
            return [];
        }

        return savedTasks
            .filter(task => task && typeof task.text === "string")
            .map((task, index) => ({
                id: task.id ?? (Date.now() + index),
                text: task.text,
                date: task.date || "",
                time: task.time || "",
                priority: priorityOrder[task.priority]
                    ? task.priority
                    : "medium",
                category: categoryLabels[task.category]
                    ? task.category
                    : "study",
                completed: task.completed === true
            }));
    } catch (error) {
        console.error("Could not load saved tasks:", error);
        return [];
    }
}

let tasks = loadTasks();

let currentFilter = "all";
let currentCategory = "all";
let searchText = "";
let currentSortPriority = "default";


// =====================================
// SAVE TASKS
// =====================================

function saveTasks() {
    try {
        localStorage.setItem("tasks", JSON.stringify(tasks));
        return true;
    } catch (error) {
        console.error("Could not save tasks:", error);
        alert("Unable to save tasks. Check your browser storage.");
        return false;
    }
}


// =====================================
// DARK / LIGHT MODE
// =====================================

function applyTheme(theme) {
    const isDark = theme === "dark";

    document.body.classList.toggle("dark-mode", isDark);

    themeBtn.textContent = isDark
        ? "☀️ Light Mode"
        : "🌙 Dark Mode";
}

applyTheme(localStorage.getItem("theme") || "light");

themeBtn.addEventListener("click", function () {
    const nextTheme = document.body.classList.contains("dark-mode")
        ? "light"
        : "dark";

    applyTheme(nextTheme);

    try {
        localStorage.setItem("theme", nextTheme);
    } catch (error) {
        console.error("Could not save theme:", error);
    }
});


// =====================================
// UPDATE COUNTERS
// =====================================

function updateCounters() {
    const completed = tasks.filter(task => task.completed).length;
    const active = tasks.length - completed;

    document.getElementById("totalCount").textContent = tasks.length;
    document.getElementById("activeCount").textContent = active;
    document.getElementById("completedCount").textContent = completed;
}


// =====================================
// ADD TASK
// =====================================

function addTask() {
    const text = taskInput.value.trim();

    if (!text) {
        alert("Please enter a task!");
        taskInput.focus();
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

    if (!saveTasks()) {
        tasks.pop();
        return;
    }

    taskInput.value = "";
    taskDate.value = "";
    taskTime.value = "";
    taskPriority.value = "medium";
    taskCategory.value = "study";

    renderTasks();
    taskInput.focus();
}

addBtn.addEventListener("click", addTask);

taskInput.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
        addTask();
    }
});


// =====================================
// CREATE TASK INFORMATION BADGE
// =====================================

function createBadge(className, text) {
    const badge = document.createElement("span");

    badge.className = className;
    badge.textContent = text;

    return badge;
}


// =====================================
// OPEN EDIT FORM
// =====================================

function openEditForm(task) {
    editTaskId.value = String(task.id);
    editTaskInput.value = task.text;
    editTaskDate.value = task.date;
    editTaskTime.value = task.time;
    editTaskPriority.value = task.priority;
    editTaskCategory.value = task.category;

    editTaskSection.hidden = false;

    editTaskSection.scrollIntoView({
        behavior: "smooth",
        block: "center"
    });

    editTaskInput.focus();
}


// =====================================
// CREATE TASK ELEMENT
// =====================================

function createTaskElement(task) {
    const li = document.createElement("li");

    li.className = "task priority-" + task.priority;

    if (task.completed) {
        li.classList.add("completed");
    }

    // Completion checkbox
    const checkbox = document.createElement("input");

    checkbox.type = "checkbox";
    checkbox.checked = task.completed;
    checkbox.setAttribute("aria-label", "Mark task complete");

    checkbox.addEventListener("change", function () {
        task.completed = checkbox.checked;
        saveTasks();
        renderTasks();
    });

    // Task content
    const content = document.createElement("div");
    content.className = "task-content";

    const taskText = document.createElement("div");
    taskText.className = "task-text";
    taskText.textContent = task.text;

    const info = document.createElement("div");
    info.className = "task-info";

    if (task.date) {
        info.appendChild(createBadge("task-date", "📅 " + task.date));
    }

    if (task.time) {
        info.appendChild(createBadge("task-time", "⏰ " + task.time));
    }

    info.appendChild(
        createBadge("task-priority", priorityLabels[task.priority])
    );

    info.appendChild(
        createBadge("task-category", categoryLabels[task.category])
    );

    content.appendChild(taskText);
    content.appendChild(info);

    // Action buttons
    const actions = document.createElement("div");
    actions.className = "task-actions";

    const editBtn = document.createElement("button");
    editBtn.className = "edit-btn";
    editBtn.textContent = "✏️ Edit";

    editBtn.addEventListener("click", function () {
        openEditForm(task);
    });

    const deleteBtn = document.createElement("button");
    deleteBtn.className = "delete-btn";
    deleteBtn.textContent = "🗑️ Delete";

    deleteBtn.addEventListener("click", function () {
        const confirmed = confirm(
            "Are you sure you want to delete this task?"
        );

        if (!confirmed) {
            return;
        }

        const oldTasks = tasks;
        tasks = tasks.filter(item => item.id !== task.id);

        if (!saveTasks()) {
            tasks = oldTasks;
            return;
        }

        if (Number(editTaskId.value) === task.id) {
            editTaskSection.hidden = true;
        }

        renderTasks();
    });

    actions.appendChild(editBtn);
    actions.appendChild(deleteBtn);

    li.appendChild(checkbox);
    li.appendChild(content);
    li.appendChild(actions);

    return li;
}


// =====================================
// SAVE EDITED TASK — V17
// =====================================

saveEditBtn.addEventListener("click", function () {
    const id = Number(editTaskId.value);
    const newText = editTaskInput.value.trim();

    if (!newText) {
        alert("Please enter a task name!");
        editTaskInput.focus();
        return;
    }

    const task = tasks.find(item => item.id === id);

    if (!task) {
        alert("Task not found. Please try again.");
        editTaskSection.hidden = true;
        return;
    }

    const oldTask = { ...task };

    task.text = newText;
    task.date = editTaskDate.value;
    task.time = editTaskTime.value;
    task.priority = editTaskPriority.value;
    task.category = editTaskCategory.value;

    if (!saveTasks()) {
        Object.assign(task, oldTask);
        return;
    }

    editTaskSection.hidden = true;
    renderTasks();
});


// =====================================
// CANCEL EDITING
// =====================================

cancelEditBtn.addEventListener("click", function () {
    editTaskSection.hidden = true;
});


// Press Enter to save edits
editTaskInput.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
        saveEditBtn.click();
    }

    if (event.key === "Escape") {
        editTaskSection.hidden = true;
    }
});


// =====================================
// STATUS FILTER BUTTONS
// =====================================

document.querySelectorAll(".filter-btn").forEach(function (button) {
    button.addEventListener("click", function () {
        currentFilter = button.dataset.filter;

        document.querySelectorAll(".filter-btn").forEach(function (btn) {
            btn.classList.toggle("active-filter", btn === button);
        });

        renderTasks();
    });
});


// =====================================
// CATEGORY FILTER BUTTONS
// =====================================

document.querySelectorAll(".category-btn").forEach(function (button) {
    button.addEventListener("click", function () {
        currentCategory = button.dataset.category;

        document.querySelectorAll(".category-btn").forEach(function (btn) {
            btn.classList.toggle("active-category", btn === button);
        });

        renderTasks();
    });
});


// =====================================
// SEARCH TASKS
// =====================================

searchInput.addEventListener("input", function () {
    searchText = searchInput.value.trim().toLowerCase();
    renderTasks();
});


// =====================================
// SORT TASKS BY PRIORITY
// =====================================

sortPrioritySelect.addEventListener("change", function () {
    currentSortPriority = sortPrioritySelect.value;
    renderTasks();
});


// =====================================
// RENDER TASKS
// =====================================

function renderTasks() {
    taskList.innerHTML = "";

    let filteredTasks = tasks.filter(function (task) {
        const matchesSearch = task.text
            .toLowerCase()
            .includes(searchText);

        const matchesStatus =
            currentFilter === "all" ||
            (currentFilter === "active" && !task.completed) ||
            (currentFilter === "completed" && task.completed);

        const matchesCategory =
            currentCategory === "all" ||
            task.category === currentCategory;

        return matchesSearch && matchesStatus && matchesCategory;
    });

    if (currentSortPriority !== "default") {
        filteredTasks.sort(function (a, b) {
            const difference =
                priorityOrder[a.priority] - priorityOrder[b.priority];

            return currentSortPriority === "high"
                ? difference
                : -difference;
        });
    }

    filteredTasks.forEach(function (task) {
        taskList.appendChild(createTaskElement(task));
    });

    emptyMessage.hidden = filteredTasks.length !== 0;

    if (tasks.length === 0) {
        emptyMessage.textContent = "No tasks yet. Add your first task!";
    } else {
        emptyMessage.textContent = "No matching tasks found.";
    }

    updateCounters();
}


// =====================================
// INITIAL DISPLAY
// =====================================

renderTasks();
