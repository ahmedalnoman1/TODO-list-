// حالة التطبيق
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
let currentFilter = 'all';
let editingTaskId = null;


// عناصر DOM
const taskInput = document.getElementById('taskInput');
const addBtn = document.getElementById('addBtn');
const taskList = document.getElementById('taskList');
const taskCount = document.getElementById('taskCount');
const clearCompletedBtn = document.getElementById('clearCompleted');
const filterBtns = document.querySelectorAll('.filter-btn');
const emptyState = document.getElementById('emptyState');
const editModal = document.getElementById('editModal');
const editTaskInput = document.getElementById('editTaskInput');
const saveEditBtn = document.getElementById('saveEditBtn');
const cancelEditBtn = document.getElementById('cancelEditBtn');

// تهيئة التطبيق
document.addEventListener('DOMContentLoaded', () => {
    renderTasks();
    updateTaskCount();

// إضافة مهمة جديدة
addBtn.addEventListener('click', addTask);
taskInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addTask();
});


// فلترة المهام
filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentFilter = btn.dataset.filter;
        renderTasks();
    });
});


// حذف المهام المكتملة
clearCompletedBtn.addEventListener('click', clearCompletedTasks);
    
// أحداث نافذة التحرير
saveEditBtn.addEventListener('click', saveEditedTask);
cancelEditBtn.addEventListener('click', closeEditModal);

// إغلاق النافذة عند النقر خارجها
editModal.addEventListener('click', (e) => {
    if (e.target === editModal) closeEditModal();
});
});


// إضافة مهمة جديدة
function addTask() {
    const text = taskInput.value.trim();
    
    if (text === '') {
        showMessage('يرجى إدخال نص المهمة', 'error');
        return;
    }
    
    const newTask = {
        id: Date.now(),
        text: text,
        completed: false,
        createdAt: new Date().toISOString()
    };
    
    tasks.unshift(newTask);
    saveTasks();
    renderTasks();
    updateTaskCount();
    
    taskInput.value = '';
    taskInput.focus();
    
    showMessage('تمت إضافة المهمة بنجاح', 'success');
}


// عرض المهام
function renderTasks() {
    const filteredTasks = filterTasks();
    
    if (filteredTasks.length === 0) {
        taskList.style.display = 'none';
        emptyState.style.display = 'block';
    } else {
        taskList.style.display = 'block';
        emptyState.style.display = 'none';
        
        taskList.innerHTML = '';
        
        filteredTasks.forEach(task => {
            const taskItem = createTaskElement(task);
            taskList.appendChild(taskItem);
        });
    }
}

// تصفية المهام حسب الحالة
function filterTasks() {
    switch (currentFilter) {
        case 'active':
            return tasks.filter(task => !task.completed);
        case 'completed':
            return tasks.filter(task => task.completed);
        default:
            return tasks;
    }
}

// إنشاء عنصر المهمة
function createTaskElement(task) {
    const li = document.createElement('li');
    // li.className = task-item {task.completed ? 'completed' : ''};
    li.dataset.id = task.id;
    
    li.innerHTML = `
        <div class="task-content">
            <input type="checkbox" class="task-checkbox" ${task.completed ? 'checked' : ''}>
            <span class="task-text">${task.text}</span>
        </div>
        <div class="task-actions">
            <button class="edit-btn" title="تحرير">
                <i class="fas fa-edit"></i>
            </button>
            <button class="delete-btn" title="حذف">
                <i class="fas fa-trash"></i>
            </button>
        </div>
    `;
    
    // أحداث العناصر
    const checkbox = li.querySelector('.task-checkbox');
    const editBtn = li.querySelector('.edit-btn');
    const deleteBtn = li.querySelector('.delete-btn');
    
    checkbox.addEventListener('change', () => toggleTaskCompletion(task.id));
    editBtn.addEventListener('click', () => openEditModal(task.id));
    deleteBtn.addEventListener('click', () => deleteTask(task.id));
    
    return li;
}



