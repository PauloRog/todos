const expres = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');

const app = expres();

const users = [];

app.use(cors());
app.use(expres.json());

function verifyExistsUserAccount(request, response, next) {
  const { username } = request.headers;
  const user = users.find(
    (user) => user.username === username
  );

  if (!user) {
    return response.status(400).json({ error: 'User not found' });
  };

  request.user = user;

  return next();
}

app.get('/', (request, response) => {
  return response.json({
    api: 'Todos',
    createdBy: 'Paulo Rogério',
    gretting: 'This api was created as a challenge for the boot camp ignite, in order to control everyone (Activities)',
    baseUrl: 'http://localhost:3333',
    routes: [
      {
        type: 'POST',
        route: 'baseUrl/users',
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

app.use(verifyExistsUserAccount);

app.get('/todos', (request, response) => {
  const { user } = request;
  const { todos } = user;

  if (todos.length === 0) {
    return response.json({ message: 'There are no registered todos!' })
  }

  return response.json(todos);
});

app.listen(3333, () => {
  console.log('Server running! Go to: http://localhost:3333')
})