// حالة التطبيق
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
let currentFilter = 'all';
let editingTaskId = null;