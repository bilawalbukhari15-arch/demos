// DOM Elements
const todoInput = document.getElementById('todoInput');
const addBtn = document.getElementById('addBtn');
const todoList = document.getElementById('todoList');
const todoCount = document.getElementById('todoCount');
const filterBtns = document.querySelectorAll('.filter-btn');
// State - Array me sab todos store honge
let todos = JSON.parse(localStorage.getItem('todos')) || [];
let currentFilter = 'all';
// Initial Render
renderTodos();
// Event Listeners
addBtn.addEventListener('click', addTodo);
todoInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') addTodo();
});
// Event Delegation - 1 listener se sab handle
todoList.addEventListener('click', (e) => {
  const li = e.target.closest('li');
  if (!li) return;  
  const id = Number(li.dataset.id);
  if (e.target.classList.contains('deleteBtn')) {
    deleteTodo(id);
  }
  if (e.target.classList.contains('editBtn')) {
    editTodo(id, li);
  }
  if (e.target.type === 'checkbox') {
    toggleComplete(id);
  }
});
// Filter Buttons
filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentFilter = btn.dataset.filter;
    renderTodos();
  });
});
// Functions
function addTodo() {
  const text = todoInput.value.trim();
  if (text === '') return;
  const newTodo = {
    id: Date.now(),
    text: text,
    completed: false
  };
  todos.push(newTodo);
  saveTodos();
  todoInput.value = '';
}
function deleteTodo(id) {
  todos = todos.filter(todo => todo.id !== id);
  saveTodos();
}
function toggleComplete(id) {
  todos = todos.map(todo => {
    if (todo.id === id) {
      return { ...todo, completed: !todo.completed };
    }
    return todo;
  });
  saveTodos();
}
function editTodo(id, li) {
  const todo = todos.find(t => t.id === id); 
  li.innerHTML = `
    <input type="checkbox" ${todo.completed ? 'checked' : ''}>
    <input type="text" value="${todo.text}" class="editInput">
    <button class="saveBtn">Save</button>
    <button class="deleteBtn">Delete</button>
  `;
  const editInput = li.querySelector('.editInput');
  editInput.focus();
  li.querySelector('.saveBtn').addEventListener('click', () => {
    const newText = editInput.value.trim();
    if (newText !== '') {
      todos = todos.map(t => {
        if (t.id === id) return { ...t, text: newText };
        return t;
      });
      saveTodos();
    }
  });
}
// LocalStorage me save karo
function saveTodos() {
  localStorage.setItem('todos', JSON.stringify(todos));
  renderTodos();
}
// DOM Manipulation - List ko render karna
function renderTodos() {
  todoList.innerHTML = ''; 
  // Filter apply karo
  let filteredTodos = todos;
  if (currentFilter === 'active') {
    filteredTodos = todos.filter(t => !t.completed);
  } else if (currentFilter === 'completed') {
    filteredTodos = todos.filter(t => t.completed);
  }
  // Render
  filteredTodos.forEach(todo => {
    const li = document.createElement('li');
    li.dataset.id = todo.id;
    if (todo.completed) li.classList.add('completed'); 
    li.innerHTML = `
      <input type="checkbox" ${todo.completed ? 'checked' : ''}>
      <span>${todo.text}</span>
      <button class="editBtn">Edit</button>
      <button class="deleteBtn">Delete</button>
    `;
    todoList.appendChild(li);
  });
  // Count update karo
  todoCount.innerText = todos.filter(t => !t.completed).length;
}