const express = require('express');
const http = require('http');
const path = require('path');
const exphbs = require('express-handlebars').create({});
const mysql = require('mysql');
const expressApp = express();
const server = http.createServer(expressApp);

expressApp.engine('handlebars', exphbs.engine);
expressApp.set('view engine', 'handlebars');
expressApp.set('views', path.join(__dirname, 'views'));

const port = 3000;

expressApp.use((req, res, next) => {
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    next();
});

const connection = mysql.createConnection({
    host: 'db',
    user: 'root',
    password: 'root',
    database: 'nodedb',
    charset: 'utf8mb4'
});

connection.connect((err) => {
    if (err) {
        console.error('Erro ao conectar ao banco de dados:', err);
        return;
    } 
    console.log('Conexão bem-sucedida ao banco de dados MySQL');
});

expressApp.get('/', (req, res) => {
    const sql = 'SELECT name FROM people';
    
    connection.query(sql, (err, results) => {
        if (err) {
            console.error('Erro ao executar a consulta:', err);
            res.status(500).send('Erro interno do servidor');
            return;
        }
        
        const names = results.map(result => result.name);
        res.render('index', { names });
    });
});

server.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});
