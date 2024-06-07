const express = require('express');
const http = require('http');
const path = require('path');
const exphbs = require('express-handlebars').create({});
const mysql = require('mysql');
const bodyParser = require('body-parser');
const expressApp = express();
const server = http.createServer(expressApp);

expressApp.engine('handlebars', exphbs.engine);
expressApp.set('view engine', 'handlebars');
expressApp.set('views', path.join(__dirname, 'views'));
expressApp.use(bodyParser.urlencoded({ extended: true }));
expressApp.use(bodyParser.json());

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
    const checkTableSql = `
        SELECT COUNT(*)
        FROM information_schema.tables 
        WHERE table_schema = 'nodedb' 
        AND table_name = 'people'
    `;

    connection.query(checkTableSql, (err, results) => {
        if (err) {
            console.error('Erro ao verificar a existência da tabela:', err);
            res.status(500).send('Erro interno do servidor');
            return;
        }

        const tableExists = results[0]['COUNT(*)'] > 0;
        if (!tableExists) {
            console.error('A tabela "people" não existe.');
            res.status(404).send('A tabela "people" não foi encontrada. Aguarde a migration ser realizada...');
            return;
        }

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
});

expressApp.post('/', (req, res) => {
    const name = req.body.name;
    
    if (!name) {
        res.status(400).send('Nome é obrigatório');
        return;
    }

    const sql = 'INSERT INTO people (name) VALUES (?)';
    connection.query(sql, [name], (err, results) => {
        if (err) {
            console.error('Erro ao inserir no banco de dados:', err);
            res.status(500).send('Erro interno do servidor');
            return;
        }

        res.redirect('/');
    });
});

server.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});
