const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors')
const bodyParser = require('body-parser');
const compression = require('compression');
const auth = require('./api/auth');
const ong = require('./api/ong');
const semaforo = require('./api/semaforo');
const reportes = require('./api/reportes');
const users = require('./api/users');

dotenv.config()
let { Server_port } =  process.env;

const app = express();

const corsOptions = {
    exposedHeaders: ['Authorization','sessionId'],
    allowedHeaders: '*',
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue: false
};

app.use(cors(corsOptions));
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
app.use(express.json());
app.use(compression());
app.use(cors());
app.use('/auth', auth);
app.use('/ong', ong );
app.use('/semaforo', semaforo );
app.use('/reportes', reportes );
app.use('/usuario', users);

app.listen(Number(Server_port) , '0.0.0.0', () => {
    console.log('Server listening in '+Server_port)
});
