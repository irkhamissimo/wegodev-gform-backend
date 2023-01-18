import express from 'express';
import apiRouter from './routes/api.js';
import connection from './connection.js';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import cors from 'cors';

const env = dotenv.config().parsed;
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors({ origin: 'http://localhost:5454 ' }));
app.use('/', apiRouter);

app.use((req, res) => {
  res.status(404).json({ status: 'error', message: '404 Not Found' });
});

connection();

app.listen(env.APP_PORT, () => {
  console.log(`Server started on port ${env.APP_PORT}`);
});
