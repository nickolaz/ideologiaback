const  express = require('express');
const bodyParser = require('body-parser');
const jwt = require('express-jwt');
const dotenv = require('dotenv');
const db = require('../services/db');
const bcrypt = require('bcrypt');

let { JWT_secret } =  process.env;
const saltRounds = 10;
const app = express();
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.get('/',jwt({secret:JWT_secret}),async function (request, response) {
    let sql = `select username, nombre, tipo from usuario;`;
    await db.query(sql).then( async(success) =>{
        let resUsers = [];
        if(success.length>0){
            success.forEach((element)=> resUsers.push(element) );
            response.status(200).set({
                'Content-Type':'application/json',
            }).json({status: 'success', users: resUsers});
        }else{
            response.status(404).set({
                'Content-Type':'application/json'
            }).json({status: 'success' , users: resUsers});
        }
    }).catch((reason) =>{
        console.log('Reason: '+reason);
        response.status(500).set({
            'Content-Type':'application/json'
        }).json({status: 'error' , message: 'error en la base de datos'});
    });
});

app.post('/new',jwt({secret:JWT_secret }), async (request, response) => {
    let { username, nombre, password, tipo } = request.body;    
    if(username !== null ){
        bcrypt.hash(password, saltRounds, async function(err, hash) {
        // Store hash in your password DB.
            let sql = `insert into usuario( username, nombre, password, tipo)
            values ('${username}','${nombre}','${hash}','${tipo}')`;
            await db.query(sql).then( async(success) =>{
                response.status(200).set({
                    'Content-Type':'application/json',
                }).json({status: 'success', message: 'Usuario Creado'});
            }).catch((reason) =>{
                console.log('Reason: '+reason);
                response.status(500).set({
                    'Content-Type':'application/json'
                }).json({status: 'error' , message: 'error en la base de datos'});
            });
        });
    }else{
        response.status(500).set({
            'Content-Type':'application/json'
        }).json({status: 'error' , message: 'error el username es obligatorio'}); 
    }
});

app.post('/delete',jwt({secret:JWT_secret }), async (request, response) => {
    let { username } = request.body;
    let sql = `delete from usuario where username = '${username}'`;
    await db.query(sql).then( async(success) =>{
        response.status(200).set({
            'Content-Type':'application/json',
        }).json({status: 'success'});
    }).catch((reason) =>{
        console.log('Reasone: '+reason);
    });
});

app.post('/edit',jwt({secret:JWT_secret }), async (request, response) => {
    let { nombre, tipo, username } = request.body;    
    if(username !== null ){
        let sql = `update usuario set nombre = '${nombre}' ,tipo = '${tipo}' where username = '${username}'`;
        await db.query(sql).then( async(success) =>{
            response.status(200).set({
                'Content-Type':'application/json',
            }).json({status: 'success', message: 'Usuario editado'});
        }).catch((reason) =>{
            console.log('Reason: '+reason);
            response.status(500).set({
                'Content-Type':'application/json'
            }).json({status: 'error' , message: 'error en la base de datos'});
        });
    }else{
        response.status(500).set({
            'Content-Type':'application/json'
        }).json({status: 'error' , message: 'error el username es obligatorio'}); 
    }
});

app.post('/changepass',jwt({secret:JWT_secret }), async (request, response) => {
    let { pass, newpass, username } = request.body;  
    if(username !== null && pass !== null){
        let sql = `select password from usuario where username = '${username}'`;
        await db.query(sql).then(async(success) =>{
            if(success.length>0){
                bcrypt.compare(pass, success[0].password, async function(err, res) {
                    if(res){
                        bcrypt.hash(newpass, saltRounds, async function(err, hash) {
                            // Store hash in your password DB.
                            let sql = `update usuario set password = '${hash}' where username = '${username}'`;
                            await db.query(sql).then( async(success) =>{
                                response.status(200).set({
                                    'Content-Type':'application/json',
                                }).json({status: 'success', message: 'Contraseña actualizada'});
                            }).catch((reason) =>{
                                console.log('Reason: '+reason);
                                response.status(500).set({
                                    'Content-Type':'application/json'
                                }).json({status: 'error' , message: 'error en la base de datos'});
                            });
                        });
                    }else{
                        //contraseña incorrecta
                        response.status(500).set({
                            'Content-Type':'application/json'
                        }).json({status: 'error' , message: 'Contraseña incorrecta.'});
                    }
                });
            }else{
                response.status(500).set({
                    'Content-Type':'application/json'
                }).json({status: 'error' , message: 'Contraseña incorrecta.'});
            }
        }).catch((reason) =>{
            console.log('Reason: '+reason);
            response.status(500).set({
                'Content-Type':'application/json'
            }).json({status: 'error' , message: 'error en la base de datos'});
        });
    }else{
        response.status(500).set({
            'Content-Type':'application/json'
        }).json({status: 'error' , message: 'error el username es obligatorio'}); 
    }  
});

module.exports = app;