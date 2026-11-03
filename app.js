
// =====================================
// MY TO-DO LIST - V20 CALENDAR VIEW
// =====================================

// Labels
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

// Calendar elements
const monthYear = document.getElementById("monthYear");
const calendarDays = document.getElementById("calendarDays");
const prevMonth = document.getElementById("prevMonth");
const nextMonth = document.getElementById("nextMonth");
const todayButton = document.getElementById("todayButton");
const selectedDateTitle = document.getElementById("selectedDateTitle");
const calendarTaskList = document.getElementById("calendarTaskList");

// =====================================
// DATA
// =====================================

let tasks = loadTasks();

let currentFilter = "all";
let currentCategory = "all";
let editingTaskId = null;

// Calendar state
const today = new Date();
today.setHours(0, 0, 0, 0);

let calendarMonth = new Date(today.getFullYear(), today.getMonth(), 1);
let selectedDate = getDateKey(today);

// =====================================
// LOCAL STORAGE
// =====================================

function loadTasks() {
    try {
        const savedTasks = JSON.parse(localStorage.getItem("tasks"));

        if (!Array.isArray(savedTasks)) {
            return [];
        }

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
// DATE HELPERS
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

function formatDate(dateString) {
    if (!dateString) return "No due date";

    const parts = dateString.split("-").map(Number);
    const date = new Date(parts[0], parts[1] - 1, parts[2]);

    return date.toLocaleDateString("en-IN", {
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
    taskForm.reset();

    // Select the new task's date in the calendar
    if (newTask.dueDate) {
        selectedDate = newTask.dueDate;

        const parts = selectedDate.split("-").map(Number);
        calendarMonth = new Date(parts[0], parts[1] - 1, 1);
    }

    renderAll();
});

// =====================================
// DELETE TASK
// =====================================

function deleteTask(id) {
    const confirmDelete = confirm("Are you sure you want to delete this task?");

    if (!confirmDelete) return;

    tasks = tasks.filter(task => task.id !== id);

    if (editingTaskId === id) {
        closeEditForm();
    }

    saveTasks();
    renderAll();
}

// =====================================
// COMPLETE / UNCOMPLETE TASK
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

function createTaskElement(task) {
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

    card.append(title, meta, actions);

    return card;
}

// =====================================
// DISPLAY TASKS
// =====================================

function renderTasks() {
    taskList.innerHTML = "";

    let filteredTasks = [...tasks];

    // Status filter
    if (currentFilter === "active") {
        filteredTasks = filteredTasks.filter(task => !task.completed);
    }

    if (currentFilter === "completed") {
        filteredTasks = filteredTasks.filter(task => task.completed);
    }

    // Category filter
    if (currentCategory !== "all") {
        filteredTasks = filteredTasks.filter(
            task => task.category === currentCategory
        );
    }

    // Search
    const searchText = searchInput.value.trim().toLowerCase();

    if (searchText) {
        filteredTasks = filteredTasks.filter(task =>
            task.text.toLowerCase().includes(searchText)
        );
    }

    // Deadline filter
    const selectedDeadline = deadlineFilter.value;

    if (selectedDeadline !== "all") {
        filteredTasks = filteredTasks.filter(
            task => getDueStatus(task) === selectedDeadline
        );
    }

    // Priority sorting
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
// STATUS FILTER BUTTONS
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
// CATEGORY FILTER BUTTONS
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
    if (document.body.classList.contains("dark-mode")) {
        themeToggle.textContent = "☀️ Light Mode";
    } else {
        themeToggle.textContent = "🌙 Dark Mode";
    }
}

function loadTheme() {
    const savedTheme = localStorage.getItem("theme");

    if (savedTheme === "dark") {
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
// V20 CALENDAR VIEW
// =====================================

function renderCalendar() {
    calendarDays.innerHTML = "";

    const year = calendarMonth.getFullYear();
    const month = calendarMonth.getMonth();

    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    monthYear.textContent = calendarMonth.toLocaleDateString("en-IN", {
        month: "long",
        year: "numeric"
    });

    // Empty cells before the first day
    for (let i = 0; i < firstDay; i++) {
        const emptyCell = document.createElement("div");
        emptyCell.className = "calendar-day empty";
        calendarDays.appendChild(emptyCell);
    }

    // Calendar dates
    for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(year, month, day);
        const dateKey = getDateKey(date);

        const dayTasks = tasks.filter(
            task => task.dueDate === dateKey
        );

        const cell = document.createElement("button");
        cell.type = "button";
        cell.className = "calendar-day";

        const number = document.createElement("span");
        number.className = "day-number";
        number.textContent = day;

        cell.appendChild(number);

        if (dateKey === getTodayKey()) {
            cell.classList.add("today");
        }

        if (dateKey === selectedDate) {
            cell.classList.add("selected");
        }

        if (dayTasks.length > 0) {
            cell.classList.add("has-tasks");

            const dots = document.createElement("span");
            dots.className = "task-dots";

            // Show up to three dots
            for (let i = 0; i < Math.min(dayTasks.length, 3); i++) {
                const dot = document.createElement("i");
                dot.className = "task-dot";
                dots.appendChild(dot);
            }

            cell.appendChild(dots);
            cell.title = `${dayTasks.length} task(s)`;
        }

        cell.addEventListener("click", function() {
            selectedDate = dateKey;
            renderCalendar();
            renderCalendarTasks();
        });

        calendarDays.appendChild(cell);
    }

    renderCalendarTasks();
}

// =====================================
// TASKS FOR SELECTED CALENDAR DATE
// =====================================

function renderCalendarTasks() {
    calendarTaskList.innerHTML = "";

    const dateTasks = tasks.filter(
        task => task.dueDate === selectedDate
    );

    selectedDateTitle.textContent =
        "Tasks for " + formatDate(selectedDate);

    if (dateTasks.length === 0) {
        const message = document.createElement("p");
        message.className = "empty-message";
        message.textContent = "No tasks scheduled for this date.";

        calendarTaskList.appendChild(message);
        return;
    }

    dateTasks.forEach(task => {
        calendarTaskList.appendChild(createTaskElement(task));
    });
}

// Previous month
prevMonth.addEventListener("click", function() {
    calendarMonth.setMonth(calendarMonth.getMonth() - 1);
    renderCalendar();
});

// Next month
nextMonth.addEventListener("click", function() {
    calendarMonth.setMonth(calendarMonth.getMonth() + 1);
    renderCalendar();
});

// Go to today
todayButton.addEventListener("click", function() {
    const now = new Date();

    now.setHours(0, 0, 0, 0);

    selectedDate = getDateKey(now);
    calendarMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    renderCalendar();
});

// =====================================
// RENDER EVERYTHING
// =====================================

function renderAll() {
    renderTasks();
    renderCalendar();
}

// =====================================
// START APPLICATION
// =====================================

loadTheme();
renderAll();
