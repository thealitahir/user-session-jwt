const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');

require('./config/db');
const routes = require('./routes/index');

dotenv.config();

const app = express();
app.use(cors());


app.use(express.json());
app.use('/api/v1', routes);
app.use(express.urlencoded({ extended: false }));
app.use(express.json());


const Port = process.env.PORT || 3000;
app.listen(Port, () => console.log(`Listening on port ${process.env.PORT}...`));