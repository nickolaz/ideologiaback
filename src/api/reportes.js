const  express = require('express');
const bodyParser = require('body-parser');
const jwt = require('express-jwt');
const dotenv = require('dotenv');
const db = require('../services/db');

let { JWT_secret } =  process.env;
const app = express();
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.get('/cant',jwt({secret:JWT_secret}),async function (request, response) {
    let sql = `select count(ong) as "cant",ideologia from semaforo group by ideologia;`;
    await db.query(sql).then( async(success) =>{
        let res = [];
        if(success.length>0){
            success.forEach((element)=> res.push(element) );
            response.status(200).set({
                'Content-Type':'application/json',
            }).json({status: 'success', reporte: res});
        }else{
            response.status(404).set({
                'Content-Type':'application/json'
            }).json({status: 'success' , reporte: res});
        }
    }).catch((reason) =>{
        console.log('Reason: '+reason);
        response.status(500).set({
            'Content-Type':'application/json'
        }).json({status: 'error' , message: 'error en la base de datos'});
    });
});

app.get('/dir',jwt({secret:JWT_secret}),async function (request, response) {
    let sql = `select nombre , director ,mail,telefono from ong;`;
    await db.query(sql).then( async(success) =>{
        let res = [];
        if(success.length>0){
            success.forEach((element)=> res.push(element) );
            response.status(200).set({
                'Content-Type':'application/json',
            }).json({status: 'success', reporte: res});
        }else{
            response.status(404).set({
                'Content-Type':'application/json'
            }).json({status: 'success' , reporte: res});
        }
    }).catch((reason) =>{
        console.log('Reason: '+reason);
        response.status(500).set({
            'Content-Type':'application/json'
        }).json({status: 'error' , message: 'error en la base de datos'});
    });
});

app.get('/vin',jwt({secret:JWT_secret}),async function (request, response) {
    let sql = `select ong , relacion from semaforo;`;
    await db.query(sql).then( async(success) =>{
        let res = [];
        if(success.length>0){
            success.forEach((element)=> res.push(element) );
            response.status(200).set({
                'Content-Type':'application/json',
            }).json({status: 'success', reporte: res});
        }else{
            response.status(404).set({
                'Content-Type':'application/json'
            }).json({status: 'success' , reporte: res});
        }
    }).catch((reason) =>{
        console.log('Reason: '+reason);
        response.status(500).set({
            'Content-Type':'application/json'
        }).json({status: 'error' , message: 'error en la base de datos'});
    });
});


module.exports = app;