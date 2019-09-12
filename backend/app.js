'use strict';

const express = require ('express');
const logger = require ('morgan');
const cors = require('cors');

const app = express();
app.use(logger('dev')); // Log requests (GET..)
app.use(express('json')); // Needed to retrieve JSON

app.post( '/test',
	(req, res) => res.json (req.body)
) 

app.get('/test',
	(req, res) => res.json({ msg: "hello"})
)

const PORT = process.env.port || 3000;
app.listen(PORT, () => {
	console.log('Connected to Port ',PORT )
});

//implementacion del cors
app.unsubscribe((req, res, next) =>{
	res.header("Access-Control-Allow-Headers","Origin, X-Requested-With, Content-Type, Accept, Authorization");
	if(req.method == 'OPTIONS'){
		res.header("Access-Control-Allow-Headers", "POST, GET" )
	} next()
})