
"use strict";

// =====================================
// V19 TO-DO LIST APPLICATION
// =====================================

// Category names
const categoryLabels = {
    study: "Study",
    college: "College",
    project: "Project",
    personal: "Personal",
    other: "Other"
};

// Priority names
const priorityLabels = {
    high: "High",
    medium: "Medium",
    low: "Low"
};

// Priority sorting order
const priorityOrder = {
    high: 1,
    medium: 2,
    low: 3
};

// Get HTML elements
const $ = id => document.getElementById(id);

const taskForm = $("taskForm");
const taskInput = $("taskInput");
const taskDate = $("taskDate");
const taskTime = $("taskTime");
const taskPriority = $("taskPriority");
const taskCategory = $("taskCategory");

const taskList = $("taskList");
const emptyMessage = $("emptyMessage");

const searchInput = $("searchInput");
const sortPriority = $("sortPriority");
const dueFilter = $("dueFilter");
const themeToggle = $("themeToggle");

// Task counters
const totalCount = $("totalCount");
const activeCount = $("activeCount");
const completedCount = $("completedCount");

// Deadline counters
const overdueCount = $("overdueCount");
const todayCount = $("todayCount");
const upcomingCount = $("upcomingCount");

// Edit form elements
const editTaskSection = $("editTaskSection");
const editTaskId = $("editTaskId");
const editTaskInput = $("editTaskInput");
const editTaskDate = $("editTaskDate");
const editTaskTime = $("editTaskTime");
const editTaskPriority = $("editTaskPriority");
const editTaskCategory = $("editTaskCategory");
const saveEditBtn = $("saveEditBtn");
const cancelEditBtn = $("cancelEditBtn");

// Progress dashboard elements
const progressPercentage = $("progressPercentage");
const progressTotal = $("progressTotal");
const progressCompleted = $("progressCompleted");
const progressRemaining = $("progressRemaining");
const overallProgressBar = $("overallProgressBar");
const categoryProgressList = $("categoryProgressList");

// =====================================
// LOAD TASKS FROM LOCAL STORAGE
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
            .filter(task => task && typeof task === "object")
            .map(task => ({
                id: String(
                    task.id || Date.now() + Math.random()
                ),

                text: String(task.text || ""),

                completed: Boolean(task.completed),

                date: String(task.date || ""),

                time: String(task.time || ""),

                priority: ["high", "medium", "low"].includes(
                    task.priority
                ) ? task.priority : "medium",

                category: Object.prototype.hasOwnProperty.call(
                    categoryLabels,
                    task.category
                ) ? task.category : "other",

                createdAt: Number(task.createdAt) || Date.now()
            }))
            .filter(task => task.text.trim() !== "");

    } catch (error) {
        console.error("Error loading tasks:", error);
        return [];
    }
}

// Application state
let tasks = loadTasks();

let currentFilter = "all";
let currentCategory = "all";
let searchText = "";
let currentSortPriority = "default";
let currentDueFilter = "all";

// =====================================
// SAVE TASKS
// =====================================

function saveTasks() {
    try {
        localStorage.setItem(
            "tasks",
            JSON.stringify(tasks)
        );

        return true;

    } catch (error) {
        console.error("Error saving tasks:", error);

        alert(
            "Unable to save tasks. Please check your browser storage."
        );

        return false;
    }
}

// =====================================
// DATE FUNCTIONS
// =====================================

function getLocalDateString() {
    const now = new Date();

    const year = now.getFullYear();

    const month = String(
        now.getMonth() + 1
    ).padStart(2, "0");

    const day = String(
        now.getDate()
    ).padStart(2, "0");

    return `${year}-${month}-${day}`;
}

// Determine deadline status
function getDueStatus(task) {
    if (task.completed) {
        return "completed";
    }

    if (!task.date) {
        return "no-date";
    }

    const today = getLocalDateString();

    if (task.date < today) {
        return "overdue";
    }

    if (task.date === today) {
        return "today";
    }

    return "upcoming";
}

// Deadline labels
const dueStatusLabels = {
    overdue: "Overdue",
    today: "Due Today",
    upcoming: "Upcoming",
    "no-date": "No Deadline",
    completed: "Completed"
};

// Display date and time
function formatDeadline(task) {
    if (!task.date) {
        return "No deadline set";
    }

    const [year, month, day] = task.date
        .split("-")
        .map(Number);

    const date = new Date(
        year,
        month - 1,
        day
    );

    let result = date.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric"
    });

    if (task.time) {
        const [hours, minutes] = task.time
            .split(":")
            .map(Number);

        const time = new Date();

        time.setHours(hours, minutes, 0, 0);

        result += " at " + time.toLocaleTimeString(
            "en-IN",
            {
                hour: "numeric",
                minute: "2-digit"
            }
        );
    }

    return result;
}

// =====================================
// ADD NEW TASK
// =====================================

taskForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const text = taskInput.value.trim();

    if (!text) {
        alert("Please enter a task name.");
        taskInput.focus();
        return;
    }

    const newTask = {
        id: String(Date.now()) +
            Math.random().toString(36).slice(2),

        text: text,

        completed: false,

        date: taskDate.value,

        time: taskTime.value,

        priority: taskPriority.value,

        category: taskCategory.value,

        createdAt: Date.now()
    };

    tasks.unshift(newTask);

    if (!saveTasks()) {
        tasks.shift();
        return;
    }

    taskForm.reset();

    taskPriority.value = "medium";
    taskCategory.value = "study";

    renderTasks();

    taskInput.focus();
});

// =====================================
// CREATE BADGES
// =====================================

function createBadge(text, className) {
    const badge = document.createElement("span");

    badge.className = className;
    badge.textContent = text;

    return badge;
}

// =====================================
// COMPLETE OR UNDO TASK
// =====================================

function toggleTask(id) {
    const task = tasks.find(
        item => item.id === id
    );

    if (!task) return;

    const oldValue = task.completed;

    task.completed = !oldValue;

    if (!saveTasks()) {
        task.completed = oldValue;
        return;
    }

    renderTasks();
}

// =====================================
// DELETE TASK
// =====================================

function deleteTask(id) {
    const index = tasks.findIndex(
        task => task.id === id
    );

    if (index === -1) return;

    const confirmDelete = confirm(
        "Are you sure you want to delete this task?"
    );

    if (!confirmDelete) return;

    const removedTask = tasks.splice(index, 1)[0];

    if (!saveTasks()) {
        tasks.splice(index, 0, removedTask);
        return;
    }

    renderTasks();
}

// =====================================
// EDIT TASK
// =====================================

function editTask(id) {
    const task = tasks.find(
        item => item.id === id
    );

    if (!task) return;

    editTaskId.value = task.id;

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

// Save edited task
saveEditBtn.addEventListener("click", function () {
    const id = editTaskId.value;

    const text = editTaskInput.value.trim();

    if (!text) {
        alert("Task name cannot be empty.");
        editTaskInput.focus();
        return;
    }

    const index = tasks.findIndex(
        task => task.id === id
    );

    if (index === -1) return;

    const oldTask = { ...tasks[index] };

    tasks[index] = {
        ...tasks[index],

        text: text,

        date: editTaskDate.value,

        time: editTaskTime.value,

        priority: editTaskPriority.value,

        category: editTaskCategory.value
    };

    if (!saveTasks()) {
        tasks[index] = oldTask;
        return;
    }

    editTaskSection.hidden = true;

    renderTasks();
});

// Cancel editing
cancelEditBtn.addEventListener("click", function () {
    editTaskSection.hidden = true;
});

// =====================================
// CREATE TASK CARD
// =====================================

function createTaskElement(task) {
    const li = document.createElement("li");

    li.className = "task";

    if (task.completed) {
        li.classList.add("completed");
    }

    const status = getDueStatus(task);

    if (status === "overdue") {
        li.classList.add("due-overdue");
    }

    if (status === "today") {
        li.classList.add("due-today");
    }

    if (status === "upcoming") {
        li.classList.add("due-upcoming");
    }

    // Task content
    const content = document.createElement("div");

    content.className = "task-content";

    const title = document.createElement("h3");

    title.className = "task-title";

    title.textContent = task.text;

    if (task.completed) {
        title.classList.add("task-completed");
    }

    // Badges
    const badges = document.createElement("div");

    badges.className = "task-details";

    badges.appendChild(
        createBadge(
            priorityLabels[task.priority],
            `priority-badge priority-${task.priority}`
        )
    );

    badges.appendChild(
        createBadge(
            categoryLabels[task.category],
            `category-badge category-${task.category}`
        )
    );

    badges.appendChild(
        createBadge(
            dueStatusLabels[status],
            `due-status status-${status}`
        )
    );

    // Deadline
    const deadline = document.createElement("p");

    deadline.className = "task-deadline";

    deadline.textContent =
        "Deadline: " + formatDeadline(task);

    content.append(title, badges, deadline);

    // Action buttons
    const actions = document.createElement("div");

    actions.className = "task-actions";

    const completeBtn = document.createElement("button");

    completeBtn.type = "button";

    completeBtn.className = "complete-btn";

    completeBtn.textContent = task.completed
        ? "Undo"
        : "Complete";

    completeBtn.addEventListener(
        "click",
        () => toggleTask(task.id)
    );

    const editBtn = document.createElement("button");

    editBtn.type = "button";

    editBtn.className = "edit-btn";

    editBtn.textContent = "Edit";

    editBtn.addEventListener(
        "click",
        () => editTask(task.id)
    );

    const deleteBtn = document.createElement("button");

    deleteBtn.type = "button";

    deleteBtn.className = "delete-btn";

    deleteBtn.textContent = "Delete";

    deleteBtn.addEventListener(
        "click",
        () => deleteTask(task.id)
    );

    actions.append(
        completeBtn,
        editBtn,
        deleteBtn
    );

    li.append(content, actions);

    return li;
}

// =====================================
// UPDATE TASK COUNTERS
// =====================================

function updateCounters() {
    const total = tasks.length;

    const completed = tasks.filter(
        task => task.completed
    ).length;

    const active = total - completed;

    totalCount.textContent = total;

    activeCount.textContent = active;

    completedCount.textContent = completed;

    // Deadline counts include unfinished tasks only
    const unfinished = tasks.filter(
        task => !task.completed
    );

    overdueCount.textContent = unfinished.filter(
        task => getDueStatus(task) === "overdue"
    ).length;

    todayCount.textContent = unfinished.filter(
        task => getDueStatus(task) === "today"
    ).length;

    upcomingCount.textContent = unfinished.filter(
        task => getDueStatus(task) === "upcoming"
    ).length;
}

// =====================================
// V19 OVERALL PROGRESS DASHBOARD
// =====================================

function updateProgressDashboard() {
    const total = tasks.length;

    const completed = tasks.filter(
        task => task.completed
    ).length;

    const remaining = total - completed;

    const percentage = total === 0
        ? 0
        : Math.round((completed / total) * 100);

    // Update overall numbers
    progressPercentage.textContent =
        percentage + "%";

    progressTotal.textContent = total;

    progressCompleted.textContent = completed;

    progressRemaining.textContent = remaining;

    // Update overall progress bar
    overallProgressBar.style.width =
        percentage + "%";

    // Update category progress
    categoryProgressList.innerHTML = "";

    Object.keys(categoryLabels).forEach(category => {
        const categoryTasks = tasks.filter(
            task => task.category === category
        );

        const categoryTotal = categoryTasks.length;

        const categoryCompleted = categoryTasks.filter(
            task => task.completed
        ).length;

        const categoryPercentage = categoryTotal === 0
            ? 0
            : Math.round(
                (categoryCompleted / categoryTotal) * 100
            );

        // Category card
        const item = document.createElement("div");

        item.className = "category-progress-item";

        // Heading
        const heading = document.createElement("div");

        heading.className = "category-progress-heading";

        const name = document.createElement("span");

        name.textContent = categoryLabels[category];

        const percent = document.createElement("span");

        percent.textContent = categoryPercentage + "%";

        heading.append(name, percent);

        // Progress track
        const track = document.createElement("div");

        track.className = "category-progress-track";

        const fill = document.createElement("div");

        fill.className = "category-progress-fill";

        fill.style.width = categoryPercentage + "%";

        track.appendChild(fill);

        // Category information
        const info = document.createElement("p");

        info.className = "category-progress-info";

        info.textContent =
            `${categoryCompleted} completed out of ${categoryTotal} tasks`;

        item.append(
            heading,
            track,
            info
        );

        categoryProgressList.appendChild(item);
    });
}

// =====================================
// STATUS FILTER BUTTONS
// =====================================

document.querySelectorAll("[data-filter]").forEach(button => {
    button.addEventListener("click", function () {
        currentFilter = button.dataset.filter;

        document.querySelectorAll("[data-filter]").forEach(item => {
            item.classList.toggle(
                "active",
                item === button
            );
        });

        renderTasks();
    });
});

// =====================================
// CATEGORY FILTER BUTTONS
// =====================================

document.querySelectorAll("[data-category]").forEach(button => {
    button.addEventListener("click", function () {
        currentCategory = button.dataset.category;

        document.querySelectorAll("[data-category]").forEach(item => {
            item.classList.toggle(
                "active",
                item === button
            );
        });

        renderTasks();
    });
});

// =====================================
// SEARCH TASKS
// =====================================

searchInput.addEventListener("input", function () {
    searchText = searchInput.value
        .trim()
        .toLowerCase();

    renderTasks();
});

// =====================================
// PRIORITY SORTING
// =====================================

sortPriority.addEventListener("change", function () {
    currentSortPriority = sortPriority.value;

    renderTasks();
});

// =====================================
// DEADLINE FILTERING
// =====================================

dueFilter.addEventListener("change", function () {
    currentDueFilter = dueFilter.value;

    renderTasks();
});

// =====================================
// RENDER TASKS
// =====================================

function renderTasks() {
    taskList.innerHTML = "";

    let filteredTasks = tasks.filter(task => {

        // Status filter
        if (
            currentFilter === "active" &&
            task.completed
        ) {
            return false;
        }

        if (
            currentFilter === "completed" &&
            !task.completed
        ) {
            return false;
        }

        // Category filter
        if (
            currentCategory !== "all" &&
            task.category !== currentCategory
        ) {
            return false;
        }

        // Search filter
        if (
            !task.text.toLowerCase().includes(searchText)
        ) {
            return false;
        }

        // Deadline filter
        const status = getDueStatus(task);

        if (
            currentDueFilter !== "all" &&
            status !== currentDueFilter
        ) {
            return false;
        }

        return true;
    });

    // Sort tasks
    if (currentSortPriority === "high-to-low") {
        filteredTasks.sort(
            (a, b) =>
                priorityOrder[a.priority] -
                priorityOrder[b.priority]
        );

    } else if (currentSortPriority === "low-to-high") {
        filteredTasks.sort(
            (a, b) =>
                priorityOrder[b.priority] -
                priorityOrder[a.priority]
        );

    } else {
        filteredTasks.sort(
            (a, b) => b.createdAt - a.createdAt
        );
    }

    // Display tasks
    filteredTasks.forEach(task => {
        taskList.appendChild(
            createTaskElement(task)
        );
    });

    // Empty message
    emptyMessage.hidden =
        filteredTasks.length !== 0;

    // Update all dashboards
    updateCounters();

    updateProgressDashboard();
}

// =====================================
// DARK AND LIGHT MODE
// =====================================

function applyTheme(theme) {
    document.body.classList.toggle(
        "dark-mode",
        theme === "dark"
    );

    themeToggle.textContent = theme === "dark"
        ? "☀️ Light Mode"
        : "🌙 Dark Mode";
}

let savedTheme = "light";

try {
    savedTheme = localStorage.getItem("theme") || "light";
} catch (error) {
    console.error("Could not load theme:", error);
}

applyTheme(savedTheme);

themeToggle.addEventListener("click", function () {
    const isDark = document.body.classList.contains(
        "dark-mode"
    );

    const newTheme = isDark ? "light" : "dark";

    applyTheme(newTheme);

    try {
        localStorage.setItem("theme", newTheme);
    } catch (error) {
        console.error("Could not save theme:", error);
    }
});

// =====================================
// START APPLICATION
// =====================================

renderTasks();
