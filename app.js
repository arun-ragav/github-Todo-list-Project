
// =====================================
// MY TO-DO LIST - V21 WEEKLY SCHEDULER
// =====================================

const categoryLabels = {
    study: "Study",
    college: "College",
    project: "Project",
    personal: "Personal",
    other: "Other"
};

const priorityLabels = {
    low: "Low",
    medium: "Medium",
    high: "High"
};

const priorityOrder = {
    high: 3,
    medium: 2,
    low: 1
};

// =====================================
// DOM ELEMENTS
// =====================================

const taskForm = document.getElementById("taskForm");
const taskInput = document.getElementById("taskInput");
const dueDate = document.getElementById("dueDate");
const dueTime = document.getElementById("dueTime");
const priority = document.getElementById("priority");
const category = document.getElementById("category");

const taskList = document.getElementById("taskList");
const emptyMessage = document.getElementById("emptyMessage");

const totalTasks = document.getElementById("totalTasks");
const activeTasks = document.getElementById("activeTasks");
const completedTasks = document.getElementById("completedTasks");

const overdueCount = document.getElementById("overdueCount");
const todayCount = document.getElementById("todayCount");
const upcomingCount = document.getElementById("upcomingCount");

const searchInput = document.getElementById("searchInput");
const prioritySort = document.getElementById("prioritySort");
const deadlineFilter = document.getElementById("deadlineFilter");

const editSection = document.getElementById("editSection");
const editForm = document.getElementById("editForm");
const editTaskInput = document.getElementById("editTaskInput");
const editDueDate = document.getElementById("editDueDate");
const editDueTime = document.getElementById("editDueTime");
const editPriority = document.getElementById("editPriority");
const editCategory = document.getElementById("editCategory");
const cancelEdit = document.getElementById("cancelEdit");

const themeToggle = document.getElementById("themeToggle");

const progressPercentage = document.getElementById("progressPercentage");
const progressTotal = document.getElementById("progressTotal");
const progressCompleted = document.getElementById("progressCompleted");
const progressRemaining = document.getElementById("progressRemaining");
const overallProgressBar = document.getElementById("overallProgressBar");
const categoryProgressList = document.getElementById("categoryProgressList");

// Weekly calendar elements
const weekGrid = document.getElementById("weekGrid");
const weekRange = document.getElementById("weekRange");
const prevWeek = document.getElementById("prevWeek");
const nextWeek = document.getElementById("nextWeek");
const thisWeek = document.getElementById("thisWeek");
const selectedDayTitle = document.getElementById("selectedDayTitle");
const dailyTaskCount = document.getElementById("dailyTaskCount");
const weeklyTaskList = document.getElementById("weeklyTaskList");

// =====================================
// DATA AND STATE
// =====================================

let tasks = loadTasks();

let currentFilter = "all";
let currentCategory = "all";
let editingTaskId = null;

const today = new Date();
today.setHours(0, 0, 0, 0);

let selectedDate = getDateKey(today);
let weekStart = getWeekStart(today);

// =====================================
// LOCAL STORAGE
// =====================================

function loadTasks() {
    try {
        const savedTasks = JSON.parse(localStorage.getItem("tasks"));

        if (!Array.isArray(savedTasks)) return [];

        return savedTasks
            .filter(task => task && typeof task === "object")
            .map((task, index) => ({
                id: task.id ?? Date.now() + index,
                text: String(task.text ?? ""),
                completed: Boolean(task.completed),
                dueDate: typeof task.dueDate === "string" ? task.dueDate : "",
                dueTime: typeof task.dueTime === "string" ? task.dueTime : "",
                priority: ["low", "medium", "high"].includes(task.priority)
                    ? task.priority : "medium",
                category: Object.hasOwn(categoryLabels, task.category)
                    ? task.category : "other"
            }))
            .filter(task => task.text.trim() !== "");

    } catch (error) {
        console.error("Could not load tasks:", error);
        return [];
    }
}

function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

// =====================================
// DATE FUNCTIONS
// =====================================

function getDateKey(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
}

function getTodayKey() {
    return getDateKey(new Date());
}

function parseDate(dateString) {
    if (!dateString) return null;

    const [year, month, day] = dateString.split("-").map(Number);

    return new Date(year, month - 1, day);
}

function formatDate(dateString) {
    if (!dateString) return "No due date";

    return parseDate(dateString).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric"
    });
}

function getDueStatus(task) {
    if (task.completed) return "completed";
    if (!task.dueDate) return "no-date";

    const currentDate = getTodayKey();

    if (task.dueDate < currentDate) return "overdue";
    if (task.dueDate === currentDate) return "today";

    return "upcoming";
}

function getDeadlineText(task) {
    if (!task.dueDate) return "No due date";

    let text = formatDate(task.dueDate);

    if (task.dueTime) {
        text += " at " + task.dueTime;
    }

    return text;
}

// Sunday is the first day of the week.
function getWeekStart(date) {
    const result = new Date(date);

    result.setHours(0, 0, 0, 0);
    result.setDate(result.getDate() - result.getDay());

    return result;
}

function formatWeekRange(start) {
    const end = new Date(start);
    end.setDate(start.getDate() + 6);

    const first = start.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short"
    });

    const last = end.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric"
    });

    return `${first} - ${last}`;
}

// =====================================
// ADD TASK
// =====================================

taskForm.addEventListener("submit", function(event) {
    event.preventDefault();

    const text = taskInput.value.trim();

    if (!text) {
        alert("Please enter a task.");
        return;
    }

    const newTask = {
        id: Date.now() + Math.floor(Math.random() * 1000),
        text: text,
        completed: false,
        dueDate: dueDate.value,
        dueTime: dueTime.value,
        priority: priority.value,
        category: category.value
    };

    tasks.push(newTask);

    saveTasks();

    // If a due date exists, show its week.
    if (newTask.dueDate) {
        selectedDate = newTask.dueDate;
        weekStart = getWeekStart(parseDate(newTask.dueDate));
    }

    taskForm.reset();
    renderAll();
});

// =====================================
// DELETE TASK
// =====================================

function deleteTask(id) {
    if (!confirm("Are you sure you want to delete this task?")) {
        return;
    }

    tasks = tasks.filter(task => task.id !== id);

    if (editingTaskId === id) {
        closeEditForm();
    }

    saveTasks();
    renderAll();
}

// =====================================
// COMPLETE TASK
// =====================================

function toggleTask(id) {
    tasks = tasks.map(task => {
        if (task.id === id) {
            return {
                ...task,
                completed: !task.completed
            };
        }

        return task;
    });

    saveTasks();
    renderAll();
}

// =====================================
// EDIT TASK
// =====================================

function editTask(id) {
    const task = tasks.find(item => item.id === id);

    if (!task) return;

    editingTaskId = id;

    editTaskInput.value = task.text;
    editDueDate.value = task.dueDate;
    editDueTime.value = task.dueTime;
    editPriority.value = task.priority;
    editCategory.value = task.category;

    editSection.classList.remove("hidden");

    editSection.scrollIntoView({
        behavior: "smooth",
        block: "center"
    });
}

editForm.addEventListener("submit", function(event) {
    event.preventDefault();

    const text = editTaskInput.value.trim();

    if (!text || editingTaskId === null) return;

    tasks = tasks.map(task => {
        if (task.id === editingTaskId) {
            return {
                ...task,
                text: text,
                dueDate: editDueDate.value,
                dueTime: editDueTime.value,
                priority: editPriority.value,
                category: editCategory.value
            };
        }

        return task;
    });

    saveTasks();
    closeEditForm();
    renderAll();
});

function closeEditForm() {
    editingTaskId = null;
    editSection.classList.add("hidden");
    editForm.reset();
}

cancelEdit.addEventListener("click", closeEditForm);

// =====================================
// CREATE TASK CARD
// =====================================

function createTaskElement(task, showTime = false) {
    const card = document.createElement("div");
    card.className = "task-card";

    if (task.completed) {
        card.classList.add("completed");
    }

    const title = document.createElement("p");
    title.className = "task-title";
    title.textContent = task.text;

    const meta = document.createElement("div");
    meta.className = "task-meta";

    const priorityTag = document.createElement("span");
    priorityTag.className = `tag priority-${task.priority}`;
    priorityTag.textContent = priorityLabels[task.priority];

    const categoryTag = document.createElement("span");
    categoryTag.className = "tag";
    categoryTag.textContent = categoryLabels[task.category];

    const deadlineTag = document.createElement("span");
    deadlineTag.className = "tag";

    const status = getDueStatus(task);

    if (status === "overdue") {
        deadlineTag.classList.add("deadline-overdue");
        deadlineTag.textContent = "Overdue: " + getDeadlineText(task);
    } else if (status === "today") {
        deadlineTag.classList.add("deadline-today");
        deadlineTag.textContent = "Due today: " + getDeadlineText(task);
    } else if (status === "upcoming") {
        deadlineTag.classList.add("deadline-upcoming");
        deadlineTag.textContent = "Upcoming: " + getDeadlineText(task);
    } else if (status === "no-date") {
        deadlineTag.textContent = "No due date";
    } else {
        deadlineTag.textContent = "Completed";
    }

    meta.append(priorityTag, categoryTag, deadlineTag);

    if (showTime && task.dueTime) {
        const time = document.createElement("p");
        time.className = "weekly-task-time";
        time.textContent = "🕒 " + task.dueTime;
        card.append(title, time, meta);
    } else {
        card.append(title, meta);
    }

    const actions = document.createElement("div");
    actions.className = "task-actions";

    const completeButton = document.createElement("button");
    completeButton.className = "complete-btn";
    completeButton.textContent = task.completed ? "Undo" : "Complete";
    completeButton.addEventListener("click", () => toggleTask(task.id));

    const editButton = document.createElement("button");
    editButton.className = "edit-btn";
    editButton.textContent = "Edit";
    editButton.addEventListener("click", () => editTask(task.id));

    const deleteButton = document.createElement("button");
    deleteButton.className = "delete-btn";
    deleteButton.textContent = "Delete";
    deleteButton.addEventListener("click", () => deleteTask(task.id));

    actions.append(completeButton, editButton, deleteButton);
    card.appendChild(actions);

    return card;
}

// =====================================
// DISPLAY ALL TASKS
// =====================================

function renderTasks() {
    taskList.innerHTML = "";

    let filteredTasks = [...tasks];

    if (currentFilter === "active") {
        filteredTasks = filteredTasks.filter(task => !task.completed);
    }

    if (currentFilter === "completed") {
        filteredTasks = filteredTasks.filter(task => task.completed);
    }

    if (currentCategory !== "all") {
        filteredTasks = filteredTasks.filter(
            task => task.category === currentCategory
        );
    }

    const searchText = searchInput.value.trim().toLowerCase();

    if (searchText) {
        filteredTasks = filteredTasks.filter(task =>
            task.text.toLowerCase().includes(searchText)
        );
    }

    const selectedDeadline = deadlineFilter.value;

    if (selectedDeadline !== "all") {
        filteredTasks = filteredTasks.filter(
            task => getDueStatus(task) === selectedDeadline
        );
    }

    if (prioritySort.value === "high") {
        filteredTasks.sort(
            (a, b) => priorityOrder[b.priority] - priorityOrder[a.priority]
        );
    }

    if (prioritySort.value === "low") {
        filteredTasks.sort(
            (a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]
        );
    }

    filteredTasks.forEach(task => {
        taskList.appendChild(createTaskElement(task));
    });

    emptyMessage.style.display =
        filteredTasks.length === 0 ? "block" : "none";

    updateCounters();
    updateProgressDashboard();
}

// =====================================
// COUNTERS
// =====================================

function updateCounters() {
    const total = tasks.length;
    const completed = tasks.filter(task => task.completed).length;
    const active = total - completed;

    totalTasks.textContent = total;
    activeTasks.textContent = active;
    completedTasks.textContent = completed;

    overdueCount.textContent = tasks.filter(
        task => getDueStatus(task) === "overdue"
    ).length;

    todayCount.textContent = tasks.filter(
        task => getDueStatus(task) === "today"
    ).length;

    upcomingCount.textContent = tasks.filter(
        task => getDueStatus(task) === "upcoming"
    ).length;
}

// =====================================
// PROGRESS DASHBOARD
// =====================================

function updateProgressDashboard() {
    const total = tasks.length;
    const completed = tasks.filter(task => task.completed).length;
    const remaining = total - completed;

    const percentage = total === 0
        ? 0
        : Math.round((completed / total) * 100);

    progressPercentage.textContent = percentage + "% Completed";
    progressTotal.textContent = "Total Tasks: " + total;
    progressCompleted.textContent = "Completed: " + completed;
    progressRemaining.textContent = "Remaining: " + remaining;

    overallProgressBar.style.width = percentage + "%";

    categoryProgressList.innerHTML = "";

    Object.keys(categoryLabels).forEach(categoryName => {
        const categoryTasks = tasks.filter(
            task => task.category === categoryName
        );

        const categoryCompleted = categoryTasks.filter(
            task => task.completed
        ).length;

        const categoryTotal = categoryTasks.length;

        const categoryPercentage = categoryTotal === 0
            ? 0
            : Math.round((categoryCompleted / categoryTotal) * 100);

        const item = document.createElement("div");
        item.className = "category-progress-item";

        const label = document.createElement("div");
        label.className = "category-progress-label";

        const name = document.createElement("span");
        name.textContent = categoryLabels[categoryName];

        const percentageText = document.createElement("span");
        percentageText.textContent = categoryPercentage + "%";

        label.append(name, percentageText);

        const track = document.createElement("div");
        track.className = "category-progress-track";

        const fill = document.createElement("div");
        fill.className = "category-progress-fill";
        fill.style.width = categoryPercentage + "%";

        track.appendChild(fill);
        item.append(label, track);

        categoryProgressList.appendChild(item);
    });
}

// =====================================
// STATUS FILTERS
// =====================================

document.querySelectorAll(".filter-btn").forEach(button => {
    button.addEventListener("click", function() {
        document.querySelectorAll(".filter-btn").forEach(btn => {
            btn.classList.remove("active");
        });

        this.classList.add("active");
        currentFilter = this.dataset.filter;

        renderTasks();
    });
});

// =====================================
// CATEGORY FILTERS
// =====================================

document.querySelectorAll(".category-filter").forEach(button => {
    button.addEventListener("click", function() {
        document.querySelectorAll(".category-filter").forEach(btn => {
            btn.classList.remove("active");
        });

        this.classList.add("active");
        currentCategory = this.dataset.category;

        renderTasks();
    });
});

// =====================================
// SEARCH AND SORTING
// =====================================

searchInput.addEventListener("input", renderTasks);
prioritySort.addEventListener("change", renderTasks);
deadlineFilter.addEventListener("change", renderTasks);

// =====================================
// DARK / LIGHT MODE
// =====================================

function updateThemeButton() {
    themeToggle.textContent =
        document.body.classList.contains("dark-mode")
            ? "☀️ Light Mode"
            : "🌙 Dark Mode";
}

function loadTheme() {
    if (localStorage.getItem("theme") === "dark") {
        document.body.classList.add("dark-mode");
    }

    updateThemeButton();
}

themeToggle.addEventListener("click", function() {
    document.body.classList.toggle("dark-mode");

    const isDark = document.body.classList.contains("dark-mode");

    localStorage.setItem("theme", isDark ? "dark" : "light");

    updateThemeButton();
});

// =====================================
// V21 WEEKLY CALENDAR
// =====================================

function renderWeeklyCalendar() {
    weekGrid.innerHTML = "";

    const endOfWeek = new Date(weekStart);
    endOfWeek.setDate(weekStart.getDate() + 6);

    weekRange.textContent = formatWeekRange(weekStart);

    for (let i = 0; i < 7; i++) {
        const date = new Date(weekStart);
        date.setDate(weekStart.getDate() + i);

        const dateKey = getDateKey(date);

        const dayTasks = tasks.filter(
            task => task.dueDate === dateKey
        );

        const dayButton = document.createElement("button");
        dayButton.type = "button";
        dayButton.className = "week-day";

        if (dateKey === getTodayKey()) {
            dayButton.classList.add("today");
        }

        if (dateKey === selectedDate) {
            dayButton.classList.add("selected");
        }

        const dayName = document.createElement("span");
        dayName.className = "week-day-name";
        dayName.textContent = date.toLocaleDateString("en-IN", {
            weekday: "short"
        });

        const dayNumber = document.createElement("span");
        dayNumber.className = "week-day-number";
        dayNumber.textContent = date.getDate();

        const taskCount = document.createElement("span");
        taskCount.className = "week-task-count";
        taskCount.textContent =
            dayTasks.length + (dayTasks.length === 1 ? " task" : " tasks");

        dayButton.append(dayName, dayNumber, taskCount);

        if (dayTasks.length > 0) {
            const dot = document.createElement("span");
            dot.className = "week-task-dot";
            dayButton.appendChild(dot);
        }

        dayButton.addEventListener("click", function() {
            selectedDate = dateKey;
            renderWeeklyCalendar();
        });

        weekGrid.appendChild(dayButton);
    }

    renderSelectedDayTasks();
}

// =====================================
// SELECTED DAY TASKS
// =====================================

function renderSelectedDayTasks() {
    weeklyTaskList.innerHTML = "";

    selectedDayTitle.textContent =
        "Tasks for " + formatDate(selectedDate);

    const dayTasks = tasks
        .filter(task => task.dueDate === selectedDate)
        .sort((a, b) => {
            // Tasks with a time appear in time order.
            if (!a.dueTime && !b.dueTime) return 0;
            if (!a.dueTime) return 1;
            if (!b.dueTime) return -1;

            return a.dueTime.localeCompare(b.dueTime);
        });

    dailyTaskCount.textContent =
        dayTasks.length + (dayTasks.length === 1 ? " task" : " tasks");

    if (dayTasks.length === 0) {
        const message = document.createElement("p");
        message.className = "empty-message";
        message.textContent = "No tasks scheduled for this day.";

        weeklyTaskList.appendChild(message);
        return;
    }

    dayTasks.forEach(task => {
        weeklyTaskList.appendChild(createTaskElement(task, true));
    });
}

// Previous week
prevWeek.addEventListener("click", function() {
    weekStart.setDate(weekStart.getDate() - 7);
    selectedDate = getDateKey(weekStart);

    renderWeeklyCalendar();
});

// Next week
nextWeek.addEventListener("click", function() {
    weekStart.setDate(weekStart.getDate() + 7);
    selectedDate = getDateKey(weekStart);

    renderWeeklyCalendar();
});

// Go to current week
thisWeek.addEventListener("click", function() {
    const now = new Date();
    now.setHours(0, 0, 0, 0);

    weekStart = getWeekStart(now);
    selectedDate = getDateKey(now);

    renderWeeklyCalendar();
});

// =====================================
// RENDER ALL FEATURES
// =====================================

function renderAll() {
    renderTasks();
    renderWeeklyCalendar();
}

// =====================================
// START APPLICATION
// =====================================

loadTheme();
renderAll();
