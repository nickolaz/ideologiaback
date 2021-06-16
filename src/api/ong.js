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
    let sql = `select nombre,direccion,telefono,mail,director,instagram,twitter,contacto,web,fecha_creacion from ong;`;
    await db.query(sql).then( async(success) =>{
        let resOng = [];
        if(success.length>0){
            success.forEach((element)=> resOng.push(element) );
            response.status(200).set({
                'Content-Type':'application/json',
            }).json({status: 'success', ongs: resOng});
        }else{
            response.status(404).set({
                'Content-Type':'application/json'
            }).json({status: 'success' , ongs: resOng});
        }
    }).catch((reason) =>{
        console.log('Reason: '+reason);
        response.status(500).set({
            'Content-Type':'application/json'
        }).json({status: 'error' , message: 'error en la base de datos'});
    });
});

app.get('/home',jwt({secret:JWT_secret}),async function (request, response) {
    let sql = `select s.ong,s.ideologia,s.publicaciones,s.relacion,s.fuente,
        (select array_to_string(array_agg(i.pregunta),',') from investigacion i where i.ong = s.ong and i.respuesta = 'Si') as "investigacion",
        o.direccion,o.telefono,o.mail,o.director,o.instagram,o.twitter,o.contacto,o.web,o.fecha_creacion from ong o ,semaforo s where o.nombre = s.ong;`;
    await db.query(sql).then( async(success) =>{
        let resHome = [];
        if(success.length>0){
            success.forEach((element)=> resHome.push(element) );
            response.status(200).set({
                'Content-Type':'application/json',
            }).json({status: 'success', home: resHome});
        }else{
            response.status(404).set({
                'Content-Type':'application/json'
            }).json({status: 'success' , home: resHome});
        }
    }).catch((reason) =>{
        console.log('Reason: '+reason);
        response.status(500).set({
            'Content-Type':'application/json'
        }).json({status: 'error' , message: 'error en la base de datos'});
    });
});

app.post('/new',jwt({secret:JWT_secret }), async (request, response) => {
    let { nombre, direccion, telefono, mail, director, intagram, twitter, contacto, web, fechaCreacion} = request.body;    
    if(nombre !== null ){
        let sql = `insert into 
        ong(nombre,direccion,telefono,mail,director,instagram,twitter,contacto,web,fecha_creacion) 
        values ('${nombre}','${direccion}','${telefono}','${mail}','${director}'
        ,'${intagram}','${twitter}','${contacto}','${web}','${fechaCreacion}')`;
        await db.query(sql).then( async(success) =>{
            response.status(200).set({
                'Content-Type':'application/json',
            }).json({status: 'success', message: 'ONG Creada'});
        }).catch((reason) =>{
            console.log('Reason: '+reason);
            response.status(500).set({
                'Content-Type':'application/json'
            }).json({status: 'error' , message: 'error en la base de datos'});
        });
    }else{
        response.status(500).set({
            'Content-Type':'application/json'
        }).json({status: 'error' , message: 'error el nombre es obligatorio'}); 
    }
});

app.post('/delete',jwt({secret:JWT_secret }), async (request, response) => {
    let { ong } = request.body;
    let sql = `delete from ong where nombre = '${ong}'`;
    await db.query(sql).then( async(success) =>{
        response.status(200).set({
            'Content-Type':'application/json',
        }).json({status: 'success'});
    }).catch((reason) =>{
        console.log('Reasone: '+reason);
    });
});

app.post('/edit',jwt({secret:JWT_secret }), async (request, response) => {
    let { nombre, direccion, telefono, mail, director, intagram, twitter, contacto, web, fechaCreacion} = request.body;    
    if(nombre !== null ){
        let sql = `update ong set direccion = '${direccion}' ,telefono = '${telefono}' 
        ,mail = '${mail}' ,director = '${director}' ,instagram = '${intagram}' 
        ,twitter = '${twitter}' ,contacto = '${contacto}' ,web = '${web}' 
        ,fecha_creacion = '${fechaCreacion}' where nombre = '${nombre}'`;
        await db.query(sql).then( async(success) =>{
            response.status(200).set({
                'Content-Type':'application/json',
            }).json({status: 'success', message: 'ONG Creada'});
        }).catch((reason) =>{
            console.log('Reason: '+reason);
            response.status(500).set({
                'Content-Type':'application/json'
            }).json({status: 'error' , message: 'error en la base de datos'});
        });
    }else{
        response.status(500).set({
            'Content-Type':'application/json'
        }).json({status: 'error' , message: 'error el nombre es obligatorio'}); 
    }
});

module.exports = app;