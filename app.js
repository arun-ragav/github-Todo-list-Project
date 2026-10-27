
"use strict";

// ===== Labels and settings =====
const categoryLabels = {
    study: "Study",
    college: "College",
    project: "Project",
    personal: "Personal",
    other: "Other"
};

const priorityLabels = {
    high: "High",
    medium: "Medium",
    low: "Low"
};

const priorityOrder = {
    high: 1,
    medium: 2,
    low: 3
};

// ===== HTML elements =====
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

const totalCount = $("totalCount");
const activeCount = $("activeCount");
const completedCount = $("completedCount");
const overdueCount = $("overdueCount");
const todayCount = $("todayCount");
const upcomingCount = $("upcomingCount");

const editTaskSection = $("editTaskSection");
const editTaskId = $("editTaskId");
const editTaskInput = $("editTaskInput");
const editTaskDate = $("editTaskDate");
const editTaskTime = $("editTaskTime");
const editTaskPriority = $("editTaskPriority");
const editTaskCategory = $("editTaskCategory");
const saveEditBtn = $("saveEditBtn");
const cancelEditBtn = $("cancelEditBtn");

// ===== Load saved tasks =====
function loadTasks() {
    try {
        const saved = JSON.parse(localStorage.getItem("tasks") || "[]");

        if (!Array.isArray(saved)) return [];

        return saved
            .filter(task => task && typeof task === "object")
            .map(task => ({
                id: String(task.id || (
                    Date.now() + Math.random()
                )),
                text: String(task.text || ""),
                completed: Boolean(task.completed),
                date: String(task.date || ""),
                time: String(task.time || ""),
                priority: ["high", "medium", "low"].includes(task.priority)
                    ? task.priority
                    : "medium",
                category: Object.hasOwn(categoryLabels, task.category)
                    ? task.category
                    : "other",
                createdAt: Number(task.createdAt) || Date.now()
            }))
            .filter(task => task.text.trim());
    } catch (error) {
        console.error("Error loading tasks:", error);
        return [];
    }
}

let tasks = loadTasks();
let currentFilter = "all";
let currentCategory = "all";
let searchText = "";
let currentSortPriority = "default";
let currentDueFilter = "all";

// ===== Save tasks =====
function saveTasks() {
    try {
        localStorage.setItem("tasks", JSON.stringify(tasks));
        return true;
    } catch (error) {
        console.error("Error saving tasks:", error);
        alert("Could not save tasks. Please check your browser storage.");
        return false;
    }
}

// ===== Date helpers =====
function getLocalDateString() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
}

function getDueStatus(task) {
    if (task.completed) return "completed";
    if (!task.date) return "no-date";

    const today = getLocalDateString();

    if (task.date < today) return "overdue";
    if (task.date === today) return "today";

    return "upcoming";
}

const dueStatusLabels = {
    overdue: "Overdue",
    today: "Due Today",
    upcoming: "Upcoming",
    "no-date": "No Deadline",
    completed: "Completed"
};

function formatDeadline(task) {
    if (!task.date) return "No deadline set";

    const [year, month, day] = task.date.split("-").map(Number);

    const date = new Date(year, month - 1, day);

    let result = date.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric"
    });

    if (task.time) {
        const [hours, minutes] = task.time.split(":").map(Number);
        const time = new Date();

        time.setHours(hours, minutes, 0, 0);

        result += " at " + time.toLocaleTimeString("en-IN", {
            hour: "numeric",
            minute: "2-digit"
        });
    }

    return result;
}

// ===== Add a task =====
taskForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const text = taskInput.value.trim();

    if (!text) {
        alert("Please enter a task name.");
        taskInput.focus();
        return;
    }

    const newTask = {
        id: String(Date.now()) + Math.random().toString(36).slice(2),
        text,
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

// ===== Create badges safely =====
function createBadge(text, className) {
    const badge = document.createElement("span");
    badge.className = className;
    badge.textContent = text;

    return badge;
}

// ===== Complete or undo a task =====
function toggleTask(id) {
    const task = tasks.find(item => item.id === id);
    if (!task) return;

    task.completed = !task.completed;

    if (!saveTasks()) {
        task.completed = !task.completed;
        return;
    }

    renderTasks();
}

// ===== Delete a task =====
function deleteTask(id) {
    const index = tasks.findIndex(task => task.id === id);
    if (index === -1) return;

    if (!confirm("Are you sure you want to delete this task?")) {
        return;
    }

    const removed = tasks.splice(index, 1)[0];

    if (!saveTasks()) {
        tasks.splice(index, 0, removed);
        return;
    }

    renderTasks();
}

// ===== Edit a task =====
function editTask(id) {
    const task = tasks.find(item => item.id === id);
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

saveEditBtn.addEventListener("click", function () {
    const id = editTaskId.value;
    const text = editTaskInput.value.trim();

    if (!text) {
        alert("Task name cannot be empty.");
        editTaskInput.focus();
        return;
    }

    const index = tasks.findIndex(task => task.id === id);
    if (index === -1) return;

    const oldTask = { ...tasks[index] };

    tasks[index] = {
        ...tasks[index],
        text,
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

cancelEditBtn.addEventListener("click", function () {
    editTaskSection.hidden = true;
});

// ===== Create a task card =====
function createTaskElement(task) {
    const li = document.createElement("li");
    li.className = "task";

    if (task.completed) li.classList.add("completed");

    const status = getDueStatus(task);

    if (status === "overdue") li.classList.add("due-overdue");
    if (status === "today") li.classList.add("due-today");
    if (status === "upcoming") li.classList.add("due-upcoming");

    const content = document.createElement("div");
    content.className = "task-content";

    const title = document.createElement("h3");
    title.className = "task-title";
    title.textContent = task.text;

    if (task.completed) title.classList.add("task-completed");

    const badges = document.createElement("div");
    badges.className = "task-details";

    badges.appendChild(createBadge(
        priorityLabels[task.priority],
        `priority-badge priority-${task.priority}`
    ));

    badges.appendChild(createBadge(
        categoryLabels[task.category],
        `category-badge category-${task.category}`
    ));

    badges.appendChild(createBadge(
        dueStatusLabels[status],
        `due-status status-${status}`
    ));

    const deadline = document.createElement("p");
    deadline.className = "task-deadline";
    deadline.textContent = "Deadline: " + formatDeadline(task);

    content.append(title, badges, deadline);

    const actions = document.createElement("div");
    actions.className = "task-actions";

    const completeBtn = document.createElement("button");
    completeBtn.type = "button";
    completeBtn.className = "complete-btn";
    completeBtn.textContent = task.completed ? "Undo" : "Complete";
    completeBtn.addEventListener("click", () => toggleTask(task.id));

    const editBtn = document.createElement("button");
    editBtn.type = "button";
    editBtn.className = "edit-btn";
    editBtn.textContent = "Edit";
    editBtn.addEventListener("click", () => editTask(task.id));

    const deleteBtn = document.createElement("button");
    deleteBtn.type = "button";
    deleteBtn.className = "delete-btn";
    deleteBtn.textContent = "Delete";
    deleteBtn.addEventListener("click", () => deleteTask(task.id));

    actions.append(completeBtn, editBtn, deleteBtn);
    li.append(content, actions);

    return li;
}

// ===== Update counters =====
function updateCounters() {
    const total = tasks.length;
    const completed = tasks.filter(task => task.completed).length;
    const active = total - completed;

    totalCount.textContent = total;
    activeCount.textContent = active;
    completedCount.textContent = completed;

    const unfinished = tasks.filter(task => !task.completed);

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

// ===== Status filters =====
document.querySelectorAll("[data-filter]").forEach(button => {
    button.addEventListener("click", function () {
        currentFilter = button.dataset.filter;

        document.querySelectorAll("[data-filter]").forEach(item => {
            item.classList.toggle("active", item === button);
        });

        renderTasks();
    });
});

// ===== Category filters =====
document.querySelectorAll("[data-category]").forEach(button => {
    button.addEventListener("click", function () {
        currentCategory = button.dataset.category;

        document.querySelectorAll("[data-category]").forEach(item => {
            item.classList.toggle("active", item === button);
        });

        renderTasks();
    });
});

// ===== Search =====
searchInput.addEventListener("input", function () {
    searchText = searchInput.value.trim().toLowerCase();
    renderTasks();
});

// ===== Priority sorting =====
sortPriority.addEventListener("change", function () {
    currentSortPriority = sortPriority.value;
    renderTasks();
});

// ===== Deadline filtering =====
dueFilter.addEventListener("change", function () {
    currentDueFilter = dueFilter.value;
    renderTasks();
});

// ===== Display tasks =====
function renderTasks() {
    taskList.innerHTML = "";

    let filteredTasks = tasks.filter(task => {
        if (currentFilter === "active" && task.completed) {
            return false;
        }

        if (currentFilter === "completed" && !task.completed) {
            return false;
        }

        if (
            currentCategory !== "all" &&
            task.category !== currentCategory
        ) {
            return false;
        }

        if (!task.text.toLowerCase().includes(searchText)) {
            return false;
        }

        const status = getDueStatus(task);

        if (currentDueFilter !== "all" &&
            status !== currentDueFilter) {
            return false;
        }

        return true;
    });

    if (currentSortPriority === "high-to-low") {
        filteredTasks.sort(
            (a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]
        );
    } else if (currentSortPriority === "low-to-high") {
        filteredTasks.sort(
            (a, b) => priorityOrder[b.priority] - priorityOrder[a.priority]
        );
    } else {
        filteredTasks.sort((a, b) => b.createdAt - a.createdAt);
    }

    filteredTasks.forEach(task => {
        taskList.appendChild(createTaskElement(task));
    });

    emptyMessage.hidden = filteredTasks.length !== 0;

    updateCounters();
}

// ===== Dark and light mode =====
function applyTheme(theme) {
    document.body.classList.toggle("dark-mode", theme === "dark");

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
    const darkMode = document.body.classList.contains("dark-mode");
    const newTheme = darkMode ? "light" : "dark";

    applyTheme(newTheme);

    try {
        localStorage.setItem("theme", newTheme);
    } catch (error) {
        console.error("Could not save theme:", error);
    }
});

// ===== Start application =====
renderTasks();
