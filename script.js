document.addEventListener('DOMContentLoaded', () => {
    // Grab elements from the HTML
    const form = document.getElementById('task-form');
    const titleInput = document.getElementById('task-title');
    const prioritySelect = document.getElementById('task-priority');
    const taskList = document.getElementById('task-list');

    // Load saved tasks from localStorage (or start with an empty list)
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

    // Show tasks on the screen when the page loads
    displayTasks();

    // When the user submits the form to add a task
    form.addEventListener('submit', (e) => {
        e.preventDefault(); // Stop the page from reloading

        const title = titleInput.value.trim();
        if (!title) return; // Don't add blank tasks

        // Create a new task object
        const newTask = {
            id: Date.now().toString(), // Simple unique ID using timestamp
            title: title,
            priority: prioritySelect.value,
            completed: false
        };

        tasks.push(newTask);
        saveAndRefresh();
        form.reset(); // Clear the input field
    });

    // Handle clicks on the task list (for completing or deleting)
    taskList.addEventListener('click', (e) => {
        const item = e.target.closest('.task-item');
        if (!item) return;

        const id = item.dataset.id;

        // Delete button clicked
        if (e.target.classList.contains('delete-btn')) {
            tasks = tasks.filter(task => task.id !== id);
            saveAndRefresh();
        }

        // Complete/Undo button clicked
        if (e.target.classList.contains('toggle-btn')) {
            const task = tasks.find(task => task.id === id);
            if (task) {
                task.completed = !task.completed; // Flip true/false
                saveAndRefresh();
            }
        }
    });

    // Helper function to update localStorage and redraw the list
    function saveAndRefresh() {
        localStorage.setItem('tasks', JSON.stringify(tasks));
        displayTasks();
    }

    // Function to draw all tasks onto the webpage
    function displayTasks() {
        taskList.innerHTML = ''; // Clear current list

        tasks.forEach(task => {
            const div = document.createElement('div');
            div.className = `task-item ${task.priority} ${task.completed ? 'completed' : ''}`;
            div.setAttribute('data-id', task.id);

            div.innerHTML = `
                <span>${task.title}</span>
                <div class="task-actions">
                    <button class="toggle-btn" type="button">${task.completed ? 'Undo' : 'Complete'}</button>
                    <button class="delete-btn" type="button">Delete</button>
                </div>
            `;
            
            taskList.appendChild(div);
        });
    }
});