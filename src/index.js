const expres = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');

const app = expres();

const users = [];

app.use(cors());
app.use(expres.json());

function checkExistsUserAccount(request, response, next) {
  const { username } = request.headers;
  const user = users.find(
    (user) => user.username === username
  );

  if (!user) {
    return response.status(404).json({ error: 'User not found' });
  };

  request.user = user;

  return next();
}

app.get('/', (request, response) => {
  return response.json({
    api: 'Todos',
    createdBy: 'Paulo Rogério',
    gretting: 'This api was created as a challenge for the boot camp ignite, in order to control everyone (Todos)',
    baseUrl: 'http://localhost:3333',
    routes: [
      {
        type: 'POST',
        route: 'baseUrl/users',
        description: 'Create User',
      },
      {
        type: 'GET',
        route: 'baseUrl/todos',
        description: 'Listing Todos',
      },
      {
        type: 'POST',
        route: 'baseUrl/todos',
        description: 'Create Todos',
      },
      {
        type: 'PUT',
        route: 'baseUrl/todos/:id',
        description: 'Update Todo',
      },
      {
        type: 'PATCH',
        route: 'baseUrl/todos/:id/done',
        description: 'Update done',
      },
    ]
  })
});

app.post('/users', (request, response) => {
  const { name, username } = request.body;
  const usernameAlreadyExists = users.some(
    (user) => user.username === username
  )

  if (usernameAlreadyExists) {
    return response.status(400).json({ error: 'Username already exists!' });
  }

  if (!name || !username) {
    return response.status(400).json({ error: 'name and username are required!' })
  }

  const user = {
    id: uuidv4(),
    name,
    username,
    todos: []
  }

  users.push(user);

  return response.status(201).send(user);
});

app.use(checkExistsUserAccount);

app.get('/todos', (request, response) => {
  const { user } = request;
  const { todos } = user;

  return response.json(todos);
});

app.post('/todos', (request, response) => {
  const { user } = request;
  const { title, deadline } = request.body;

  if (!title || !deadline) {
    return response.status(400).json({ error: 'title and deadline are required!' })
  }

  const todoOperation = {
    id: uuidv4(),
    title,
    done: false,
    deadline: new Date(deadline),
    created_at: new Date()
  }

  user.todos.push(todoOperation);

  return response.status(201).json(todoOperation)
})

app.put('/todos/:id', (request, response) => {
  const { user } = request;
  const { id } = request.params;
  const { title, deadline } = request.body;

  if (!title && !deadline) {
    return response.status(400).json({ error: 'title or deadline are required!'})
  }

  const todo = user.todos.find(todo => todo.id === id);

  if (!todo) {
    return response.status(404).json({ error: 'Todo not found!'})
  }

  todo.title = title;
  todo.deadline = new Date(deadline);
  
  return response.json(todo);
});

app.patch('/todos/:id/done', (request, response) => {
  const { user } = request;
  const { id } = request.params;
  const todo = user.todos.find(todo => todo.id === id);

  if (!todo) {
    return response.status(404).json({ error: 'Todo not found!'})
  }
  
  todo.done = true;

  return response.json(todo);
});

app.delete('/todos/:id', (request, response) => {
  const { user } = request;
  const { id } = request.params;
  const todoIndex = user.todos.findIndex(todo => todo.id === id);

  if (todoIndex === -1) {
    return response.status(404).json({ error: 'Todo not found!'})
  }

  user.todos.splice(todoIndex, 1);

  return response.status(204).json();
})

app.listen(3333, () => {
  console.log('Server running! Go to: http://localhost:3333')
})