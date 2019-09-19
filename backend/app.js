'use strict';

const express = require ('express');
const logger = require ('morgan');
const cors = require('cors');

const app = express();
app.use(logger('dev')); // Log requests (GET..)
app.use(express('json')); // Needed to retrieve JSON

//conexion al puerto
const PORT = process.env.port || 3000;
app.listen(PORT, () => {
	console.log('Connected to Port ',PORT )
});

//implementacion del cors
app.unsubscribe((req, res, next) =>{
	res.header("Access-Control-Allow-Headers" ,"http://localhost:4200"); ///¿Añadir local host?
	res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
	if(req.method == 'OPTIONS'){
		res.header("Access-Control-Allow-Headers", "POST", "GET" )
	} next()
})

app.use(cors());
//funciones
app.post( '/post',
	(req, res) => res.json (req.json)
) 

app.get('/get',
	(req, res) => res.json("hello")
)