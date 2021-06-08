const  express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const db = require('../services/db');
const bcrypt = require('bcrypt');
// import bcrypt , {hash} from 'bcrypt';

let { JWT_secret } =  process.env;
const saltRounds = 10;
const app = express();

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.post('/login', async function (request, response) {
    const { user, password } = request.body;
    // console.log("USER: ",user," --- PASS: ",password);
    // bcrypt.hash(password, saltRounds, function(err, hash) {
    //     // Store hash in your password DB.
    //     console.log("HASH: ",hash);
    //     console.log("ERROR: ",err);
    // });
    if(user !== null && password !== null){
        let sql = `select password,tipo from usuario where username = '${user}'`;
        await db.query(sql).then((success) =>{
            if(success.length>0){
                bcrypt.compare(password, success[0].password, function(err, res) {
                    if(res){
                        //contraseña correcta
                        response.status(200).set({
                            'Content-Type':'application/json',
                            'Authorization': 'bearer '+jwt.sign({ username: user },JWT_secret)
                        }).json({status: 'success',tipo: success[0].tipo});
                    }else{
                        //contraseña incorrecta
                        response.status(500).set({
                            'Content-Type':'application/json'
                        }).json({status: 'error' , message: 'Usuario o Contraseña incorrecto.'});
                    }
                });
            }else{
                response.status(500).set({
                    'Content-Type':'application/json'
                }).json({status: 'error' , message: 'Usuario o Contraseña incorrecto.'});
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
        }).json({status: 'error' , message: 'Usuario o Contraseña incorrecta'});
    }
});

module.exports = app;