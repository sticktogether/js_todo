//Imports
const express = require('express');
const http = require('http');
const cors = require('cors');
const apiTodosRouter = require('./controllers/api-todos.controller');
const apiAuthRouter = require('./controllers/api-auth.controller');
const apiUsersRouter = require('./controllers/api-users.controller');
const { notFound, errorHandler, asyncHandler } = require('./middlewares/middlewares');
const { initDB } = require('./dataBase');

//Init zone
const app = express();

//InitDB
initDB();

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use((req, res, next) => {
  console.log('URL = ', req.url);
  console.log('Original_URL = ', req.originalUrl);
  console.log('METHOD = ', req.method);
  console.log('HOST = ', req.headers.host);
  console.log('IsSecure = ', req.secure);
  console.log('BODY', req.body);
  console.log('QUERY', req.query);

  next();
});

app.use('/api/todos', apiTodosRouter);
app.use('/api/auth', apiAuthRouter);
app.use('/api/users', apiUsersRouter);

app.use(notFound);
app.use(errorHandler);

//Create server
http.createServer(app).listen(3000, () => {
  console.log('Server is working on port 3000');
});