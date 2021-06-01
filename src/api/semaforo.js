const  express = require('express');
const bodyParser = require('body-parser');
const jwt = require('express-jwt');
const dotenv = require('dotenv');
const db = require('../services/db');

let { JWT_secret } =  process.env;
const app = express();
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.get('/',jwt({secret:JWT_secret}),async function (request, response) {
    let sql = `select ong,ideologia,publicaciones,relacion,fuente from semaforo;`;
    await db.query(sql).then( async(success) =>{
        let resSemaforo = [];
        if(success.length>0){
            success.forEach((element)=> resSemaforo.push(element) );
            response.status(200).set({
                'Content-Type':'application/json',
            }).json({status: 'success', semaforos: resSemaforo});
        }else{
            response.status(404).set({
                'Content-Type':'application/json'
            }).json({status: 'success' , semaforos: resSemaforo});
        }
    }).catch((reason) =>{
        console.log('Reason: '+reason);
        response.status(500).set({
            'Content-Type':'application/json'
        }).json({status: 'error' , message: 'error en la base de datos'});
    });
});

app.get('/investigacion',jwt({secret:JWT_secret }), async (request, response) => {
    let sql = `select ong,pregunta,respuesta from investigacion`;
    await db.query(sql).then( async(successI) =>{
        let investigacion = [];
        successI.forEach((value)=> investigacion.push(value));
        response.status(200).set({
            'Content-Type':'application/json',
        }).json({status: 'success', investigacion: investigacion});
    }).catch((reason) =>{
        console.log('Reason: '+reason);
        response.status(500).set({
            'Content-Type':'application/json'
        }).json({status: 'error' , message: 'error en la base de datos'});
    });
});

app.post('/new',jwt({secret:JWT_secret }), async (request, response) => {
    const { ong, ideologia, publicaciones, investigacion, relacion, fuente} = request.body;
    if(ong !== null ){
        for(var i = 0 ; i < investigacion.length ; i++){
            const {ong , pregunta , respuesta } = investigacion[i];
            let sqlI = `insert into investigacion(ong,pregunta,respuesta); 
            values ('${ong}','${pregunta}','${respuesta}')`;
            await db.query(sqlI).then( async(success) =>{
            }).catch((reason) =>{
                console.log('Reason: '+reason);
            });    
        }
        let sql = `insert into semaforo(ong,ideologia,publicaciones,relacion,fuente) 
        values ('${ong}','${ideologia}','${publicaciones}','${relacion}','${fuente}')`;
        await db.query(sql).then( async(success) =>{
            response.status(200).set({
                'Content-Type':'application/json',
            }).json({status: 'success', message: 'Semaforo Creado'});
        }).catch((reason) =>{
            console.log('Reason: '+reason);
            response.status(500).set({
                'Content-Type':'application/json'
            }).json({status: 'error' , message: 'error en la base de datos'});
        });
    }else{
        response.status(500).set({
            'Content-Type':'application/json'
        }).json({status: 'error' , message: 'error la ong es obligatorio'}); 
    }
});

app.post('/edit',jwt({secret:JWT_secret }), async (request, response) => {
    const { ong, ideologia, publicaciones, investigacion, relacion, fuente} = request.body;
    if(ong !== null ){
        for(var i = 0 ; i < investigacion.length ; i++){
            const {ong , pregunta , respuesta } = investigacion[i];
            let sqlI = `update investigacion set respuesta = '${respuesta}' 
                where  ong = '${ong}' and pregunta = '${pregunta}'`;
            await db.query(sqlI).then( async(success) =>{
            }).catch((reason) =>{
                console.log('Reason: '+reason);
            });    
        }
        let sql = `update semaforo set ideologia = '${ideologia}', 
            publicaciones = '${publicaciones}', relacion = '${relacion}' ,
            fuente = '${fuente}' where ong = '${ong}'`;
        await db.query(sql).then( async(success) =>{
            response.status(200).set({
                'Content-Type':'application/json',
            }).json({status: 'success', message: 'Semaforo editado'});
        }).catch((reason) =>{
            console.log('Reason: '+reason);
            response.status(500).set({
                'Content-Type':'application/json'
            }).json({status: 'error' , message: 'error en la base de datos'});
        });
    }else{
        response.status(500).set({
            'Content-Type':'application/json'
        }).json({status: 'error' , message: 'error la ong es obligatorio'}); 
    }
});

app.post('/delete',jwt({secret:JWT_secret }), async (request, response) => {
    const { ong } = request.body;
    let sql = `delete from investigacion where ong = '${ong}'`;
    await db.query(sql).then( async(success) =>{
        sql = `delete from semaforo where ong = '${ong}'`;
        await db.query(sql).then( async(success) =>{
            response.status(200).set({
                'Content-Type':'application/json',
            }).json({status: 'success'});
        }).catch((reason) =>{
            console.log('Reasone: '+reason);
        });
    }).catch((reason) =>{
        console.log('Reasone: '+reason);
    });
});

module.exports = app;