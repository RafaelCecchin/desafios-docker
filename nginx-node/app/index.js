const express = require('express');
const http = require('http');
const path = require('path');
const exphbs = require('express-handlebars').create({});
const expressApp = express();
const server = http.createServer(expressApp);

expressApp.engine('handlebars', exphbs.engine);
expressApp.set('view engine', 'handlebars');
expressApp.set('views', path.join(__dirname, 'views'));

const port = 3000;

expressApp.get('/', (req, res) => {
    const data = {};
    
    res.render('index', data);
});

server.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});
