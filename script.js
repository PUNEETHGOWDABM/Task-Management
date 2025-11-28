// ---- Utility: load & save to localStorage ----
function getTasks() {
  const tasks = localStorage.getItem('tasks');
  return tasks ? JSON.parse(tasks) : [];
}

function saveTasks(tasks) {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

// ---- DOM Elements ----
const taskForm = document.getElementById('taskForm');
const taskIdInput = document.getElementById('taskId');
const titleInput = document.getElementById('title');
const descInput = document.getElementById('description');
const statusInput = document.getElementById('status');
const taskTableBody = document.getElementById('taskTableBody');
const saveBtn = document.getElementById('saveBtn');
const cancelEditBtn = document.getElementById('cancelEditBtn');

// ---- Display tasks (READ) ----
function renderTasks() {
  const tasks = getTasks();
  taskTableBody.innerHTML = '';

  tasks.forEach((task, index) => {
    const tr = document.createElement('tr');

    tr.innerHTML = `
      <td>${index + 1}</td>
      <td>${task.title}</td>
      <td>${task.description}</td>
      <td>${task.status}</td>
      <td>
        <button class="small" onclick="editTask(${task.id})">Edit</button>
        <button class="small danger" onclick="deleteTask(${task.id})">Delete</button>
      </td>
    `;

    taskTableBody.appendChild(tr);
  });
}

// ---- Create / Update (C & U) ----
taskForm.addEventListener('submit', function (e) {
  e.preventDefault();

  const id = taskIdInput.value;
  const title = titleInput.value.trim();
  const description = descInput.value.trim();
  const status = statusInput.value;

  if (!title) {
    alert('Title is required');
    return;
  }

  let tasks = getTasks();

  if (id) {
    // UPDATE
    tasks = tasks.map(task =>
      task.id === Number(id)
        ? { ...task, title, description, status }
        : task
    );
  } else {
    // CREATE
    const newTask = {
      id: Date.now(), // simple unique id
      title,
      description,
      status
    };
    tasks.push(newTask);
  }

  saveTasks(tasks);
  renderTasks();
  resetForm();
});

// ---- Edit task ----
function editTask(id) {
  const tasks = getTasks();
  const task = tasks.find(t => t.id === id);
  if (!task) return;

  taskIdInput.value = task.id;
  titleInput.value = task.title;
  descInput.value = task.description;
  statusInput.value = task.status;

  saveBtn.textContent = 'Update Task';
  cancelEditBtn.classList.remove('hidden');
}

// ---- Delete task (D) ----
function deleteTask(id) {
  if (!confirm('Delete this task?')) return;

  let tasks = getTasks();
  tasks = tasks.filter(task => task.id !== id);
  saveTasks(tasks);
  renderTasks();
}

// ---- Reset form ----
function resetForm() {
  taskIdInput.value = '';
  titleInput.value = '';
  descInput.value = '';
  statusInput.value = 'pending';
  saveBtn.textContent = 'Add Task';
  cancelEditBtn.classList.add('hidden');
}

cancelEditBtn.addEventListener('click', resetForm);

// ---- Initial render ----
renderTasks();