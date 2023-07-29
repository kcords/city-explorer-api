'use strict'

require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());

const { PORT } = process.env;

app.get('/', (req, res, next) => {
  res.status(200).send('Default route success!')
})

app.listen(PORT, () => console.log(`Listening on port ${PORT}`))