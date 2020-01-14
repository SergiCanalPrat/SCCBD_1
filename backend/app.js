'use strict';

const express = require ('express');
const logger = require ('morgan');
const cors = require('cors');
const crypto = require('crypto');
const cryptojs = require('crypto-js');
const app = express();
const bigintCryptoUtils = require('bigint-crypto-utils');
const Moneda = require('./modelos/moneda')
const moneyInBank = require('./modelos/cuenta')
const mongoose = require('mongoose')
const banco = require('./controllers/banco')
const tienda = require('./controllers/tienda')
const lista_gastados = []


const moment = require('moment')
const jwt = require('jwt-simple')
const Cuentas = require('./modelos/cuenta')

app.use(logger('dev')); // Log requests (GET..)
app.use(express.json()); // Needed to retrieve JSON

const PORT = process.env.port || 3000;
const db =  process.env.MONGODB || 'mongodb://localhost:27017/SCCBD';

mongoose.connect(db, (err, res) => {
	if (err) {return console.log(`Error al conectar a la base de datos: ${err}`)}
	console.log('Conexión a la base de datos establecida...')


//conexion al puerto
app.listen(PORT, () => {
	console.log('Connected to Port: ', PORT )
});
// TIENDA
const PORT2 = process.env.port || 3010;
app.listen(PORT2, () => {
	console.log('Connected to Port: ', PORT2 )
});

//implementacion del cors
app.unsubscribe((req, res, next) =>{
	res.header("Access-Control-Allow-Headers" ,"http://localhost:4200"); //http://localhost:4200
	res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
	if(req.method == 'OPTIONS'){
		res.header("Access-Control-Allow-Headers", 'PUT, POST, PATCH, DELETE, GET' )
	} next()
})
app.use(cors());

//FUNCIONES POST, GET, ENCRIPTAR, DESENCRIPTAR

const KEY_LENGTH = 32;
const IV_LENGTH = 16; // For AES, this is always 16
let iv = crypto.randomBytes(IV_LENGTH);
let key = crypto.randomBytes(KEY_LENGTH);
KeyRSA5();
KeyRSA10();
KeyRSA20();
let n5;
let d5;
let e5;
let n10;
let d10;
let e10;
let n20;
let d20;
let e20;
let nfront;
let dfront;
let moneyBlind;
//banco.getMonedero()
//FUNCIONES DEL PROYECTO


//Funciones del proyecto
app.post('/login/:name/:pass', banco.getCuenta)

app.post('/cuenta/:name', banco.getInfo)

app.post('/monedero/:id',banco.getMonedero)

// FUNCIONES 	FIRMA POR PARTE DEL BANCO 
app.post('/postMoney/:value/:id/:moneyblind/:_id',(req,res) => {
	let value = req.params.value;
	let id = req.params.id;
	let _id = req.params._id
	moneyBlind = req.params.moneyblind;
	console.log('cuerpo PostMoney', value, id)
	//moneyInBank = moneyInBank - value; //El banco resta de la cuenta del cliente el valor de la moneda
 	let sign = signMoney(moneyBlind,value) //El banco firma la moneda
	let respu = banco.saveMoney(value,id,sign,_id)
	console.log(respu)
	return res.json(sign.toString(16))
})


function signMoney(msg, value){
	console.log("La moneda que quiero firmar es: ", msg)
	//let msgbuf = Buffer.from(msg,'utf8');
	//let msgbig = BigInt('0x' + msgbuf.toString('hex'));
	let signMoney;
	if (value == 5){
		signMoney = bigintCryptoUtils.modPow(msg,d5,n5)
	}
	else if (value == 10){
		signMoney = bigintCryptoUtils.modPow(msg,d10,n10)
	}
	else if (value == 20){
		signMoney = bigintCryptoUtils.modPow(msg,d20,n20)
	}
	else {
		signMoney = 'Valor incorrecto' 
	}
	console.log('3', signMoney)
	//Restar saldo a la base de datos
	return signMoney;
}


	
app.post('/compracliente/:money',(req,res)=> {
	let money = req.params.money.split(',');
    console.log("recibimos de la tienda: ",lista_gastados, money)    
	let _id = money[0]
	let id = money[1]
	let valor = money[2]
    let firma = money[3]
    let result = "GASTADO"
	
	if (lista_gastados.indexOf(id) == -1){
		   result = "NO-GASTADO"
		   lista_gastados.push(id);
		   console.log('resultado', res)
		   let msgbig = BigInt('0x' + firma.toString())
			console.log("La moneda que quiero VERFICAR  es: ", firma,)
			result= verify(valor,id, msgbig );
			return res.json(result.toString(16))

	} else{return res.json(result.toString(16))
	 }     
})
//FUNCIONES DEL PROYECTO
function verify(valor,id, firma){
	//console.log('datos', valor,id,firma)
	let res		
	let verification;
	//Para verificarla, hace falta
	//1 desfirmo la firma //2 esto me tiene que dar igual al valor mas la id
	if (valor == 5){
		let hash = bigintCryptoUtils.modPow(firma, e5,n5)
		let hash2 = cryptojs.SHA256(id,valor)
		//let hash = cryptojs.SHA256(verification.toString())
		console.log('El hash el libro',hash , " y la vevrificacion", hash2)
		if(hash == hash2 ){
			return  "NO-GASTADO"
			
		}
	}
	else if (valor == 10){
		let hash = cryptojs.SHA256(valor.toString())
		let hash_hex = hash.toString(cryptojs.enc.Hex)
		let hash_big = BigInt('0x'+ hash_hex);
		verification = bigintCryptoUtils.modPow(hash_big, e5, n5)
		//let hash = cryptojs.SHA256(verification.toString())
		console.log('El hash el libro',hash_big , " y la vevrificacion", verification)
		if(verification = "16720724496674382452057531847361888043146266825258940714695291273417735679624052357503895894672805902608345205315595486105634967605400786417094365100442614862351328024868159533658380366183547393061349722689820635651133634926703586404314295521464000203932236892980632669192129116832848502401190320107760053537425388217625072637639104271093786219261879056860963776649852724910139058822139957549980834460602713486278803440299479782946450368408920244325572338563448900109686764399859070644454187407381086091483649548502503584575664955152509745442106787327286106779518722820423955368810705730192304500031927959639450823357"){
			return  "NO-GASTADO"
			
		}
	}
	else if (valor == 20){
		let hash = cryptojs.SHA256(valor.toString())
		let hash_hex = hash.toString(cryptojs.enc.Hex)
		let hash_big = BigInt('0x'+ hash_hex);
		verification = bigintCryptoUtils.modPow(hash_big, e5, n5)
		//let hash = cryptojs.SHA256(verification.toString())
		console.log('El hash el libro',hash_big , " y la vevrificacion", verification)
		if(verification = "762104776503486250810275130735865827438745483481573084087362694276809026909960004280393442539741034650863357739628898198896463053364707958943219575535717548715408290069529862984244119972492182030172067445955896083776801441891698839101485065748369568796255496097723727177523509819455334010127113789816020399073512592947998050785154066747932294107851675543699407664001107422210180416347603748491158905362689597824165294492213893170555343970164556485746142390378411428793507406341749648094375519883571563737376123822533625681817967128793328140691555597737478473708077104729327801528876916768528126635727010486442649299"){
			return  "NO-GASTADO"
			
		}
	}
	else {
		verification = 'Valor incorrecto' 
	}
		return verification;
}


//funcion para crear key RSA
async function KeyRSA5(){
	console.log('Voy a crear la Key de 5')
	let r = BigInt('1')
	let p = await bigintCryptoUtils.prime(1024);
	let q = await bigintCryptoUtils.prime(1025);
	//n5 = p * q;
	n5 = BigInt('22905916875747722246660110056226373270193310829822604418085419486125339615418903270281743525388994061770052154256452342574385083107021263069629382773402334528553635733772627951247006546252761379017505197872333080673239391807329440139656465341307740256513769162069010086366999935138332706269245682944572754037644695327638767285967207236831067450541220303518679268482175663401177536958317225194230283047500203330722933357386762837989818161370714793314381591333109542090092117938349414232263823892283531249019378010835235507398464702439940727421467225154092517928460592147475100536723795095674704641392930047567957349031')
	let phi_n = (p-r)*(q-r);	
	d5 = BigInt ('10946341923364556098740375465019054647743782929935977352793341973022254778450411699070050894481863756665338105484807527306516416952695407755584214094026087783996388567466086863986831835788794629437558101410861036568734981949337789885620349390793248349691849434469678607426767642226489494905877680457467904904011936204147995786166438164128967181428394863931870094513811532909687250909168551770810358668991016894240993582284757181549552616216782945644796769638688895710268758529449490314109812858138653022870752847373168370626415182549517830193697214608955128665805482953179588656658740569096005335988851805163827200897')
	e5 = BigInt('65537');
//	d5 = bigintCryptoUtils.modInv(e5, phi_n);
}
//funcion para crear key RSA
async function KeyRSA10(){
	console.log('Voy a crear la Key de 10')
	let r = BigInt('1')
	let p = await bigintCryptoUtils.prime(1024);
	let q = await bigintCryptoUtils.prime(1025);
	n10 = BigInt('17009576215749279853719082143825216456820375740171399848367792414259689686646120053537132921214303317961631018745154643415957398851703844683508275515870889767769348605400704195776477696021010776484360909347698709848364494656975966898461661242950295288880107508951468423186221167476595514228449370005580327173324748242953967735210224778520100195934213759737994322510886239212510403879633978205329151804673079268081314074797650932992722736244148738973034846947449374953557256117071816897560411863112173639736024331689597624742597225581829055979650405373879099651538116393204917155158071330074369631404089663236431705313')
	//n10 = p * q;
	let phi_n = (p-r)*(q-r);	
	e10 = BigInt('65537');
	d10 = BigInt('11479783413931159455114648554305707449251904105520868924319938756353210164182744649404167512065395884107617095535604849671654358737960430813071311386582927587747471781825206330521528067697717741957669215578345997456444603249655980467306372559576033552381952717219775086225334520326797018323062454563327943775134793654537969601464229144071831509398840151998274230707712455769882566995188510272443751192030601820467243961477167324462477514504820603478514519782396962799466441287404624942112772445833150349073790389161691155785222534127956412237091291747269431076007542688121272231949931640042864918272897090303769799377')
	//d10 = bigintCryptoUtils.modInv(e10, phi_n);
}
//funcion para crear key RSA
async function KeyRSA20(){
	console.log('Voy a crear la Key de 20')
	let r = BigInt('1')
	let p = await bigintCryptoUtils.prime(1024);
	let q = await bigintCryptoUtils.prime(1025);
	n20 = BigInt('28672654403672456233051771434347126962819093740095376734863610916626200663004362688354343182876246608787168583846737715345055704592502624702805743828033820023036633188653925846065502374641402761256055649161060832836851021168131897740638348668728545159992997977607329327982293955943679993225312080566337897856551387483498810174849108443128145863879251853707958530073216297170209607329776818245619103907834580656328662430957709201835935511940433410106543130023723156229313510659583359870531334321366225687011349757518643091389119635551373822902197454955714427122819935921896379517896223137849990612531522429391684741797')
	//n20 = p * q;
	let phi_n = (p-r)*(q-r);	
	e20 = BigInt('65537');
	d20 = BigInt(' 8857254503598713344189284109561890006595855055437858034351798266736308229283051140969737365722105262598169400185806568002207191959888545968053195657392689417678206797752395269139510437990985228216562348250082801482857758572239044658120197274797586047027759037744486049788692511681642453314104140730663758519578391114967313978952409224902934600172185632162410158149931192913009573878885838298170007517739162334291937014743800144278674563158819554496509740761842313546923603831959524118585019537216609728279260906436095400264571454244234434120106615990481409905816643675201443211398495447705823027695335293073161364733')
	//d20 = bigintCryptoUtils.modInv(e20, phi_n);
}


//funcion para encriptar RSA
//funcion para desencryptar RSA
function decryptRSA(msg, d, n){
	let msgbig = BigInt('0x' + msg);
	//let dbig = BigInt('0x' + d);
	//let nbig = BigInt('0x' + n);
	let decrypto = bigintCryptoUtils.modPow(msgbig, d, n);
	console.log('1', decrypto)
	let decryptoHex = decrypto.toString(16);
	console.log('2', decryptoHex)
	let decryptobuf = Buffer.from(decryptoHex, 'hex');
	console.log('1', decryptobuf)
	let decryptedRSA = decryptobuf.toString('utf8');
	console.log('1', decryptedRSA)
	return decryptedRSA;
}




function buf2hex(buffer) { // buffer is an ArrayBuffer
	return Array.prototype.map.call(new Uint8Array(buffer), x => ('00' + x.toString(16)).slice(-2)).join('');
}

function hex2ab2(hex){
	var typedArray = new Uint8Array(hex.match(/[\da-f]{2}/gi).map(function(h){
	  return parseInt(h, 16)
	}))
	var buffer = typedArray.buffer
	return buffer
  }

function d2h(d) {
	return d.toString(16);
}

function ascii_to_hexa(str)
{
	var arr1 = [];
	for (var n = 0, l = str.length; n < l; n ++)
		{
		var hex = Number(str.charCodeAt(n)).toString(16);
		arr1.push(hex);
		}
	return arr1.join('');
}
}) //cierra la conxion de mongo
