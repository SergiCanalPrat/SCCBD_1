'use strict';

const express = require ('express');
const logger = require ('morgan');

const app = express();
app.use(logger('dev')); // Log requests (GET..)
app.use(express('json')); // Needed to retrieve JSON

app.post(
	'/test',
	(req, res) => res.json (req.body)
) 

app.get(
	'/test',
	(req, res) => res.json({ msg: "hello"})
)

const PORT = process.env.port || 3000;
app.listen(PORT, () => {
	console.log('Connected to Port  ${PORT}')
});