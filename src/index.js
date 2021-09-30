const expres = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');

const app = expres();

const users = [];

function verifyExistsUserAccount(request, response, next) {

}

app.use(cors());
app.use(expres.json());

app.post('/users', (request, response) => {

});