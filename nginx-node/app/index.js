const express = require('express');
const http = require('http');
const path = require('path');
const exphbs = require('express-handlebars').create({});
const mysql = require('mysql');
const bodyParser = require('body-parser');
const fs = require('fs');
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
    runMigrations();
});

function runMigrations() {
    const createMigrationsTable = `
        CREATE TABLE IF NOT EXISTS migrations (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            run_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    `;

    connection.query(createMigrationsTable, (err) => {
        if (err) {
            console.error('Erro ao criar a tabela de migrations:', err);
            return;
        }
        
        const migrationsDir = path.join(__dirname, 'migrations');
        fs.readdir(migrationsDir, (err, files) => {
            if (err) {
                console.error('Erro ao ler o diretório de migrations:', err);
                return;
            }
            
            connection.query('SELECT name FROM migrations', (err, results) => {
                if (err) {
                    console.error('Erro ao obter lista de migrations aplicadas:', err);
                    return;
                }

                const appliedMigrations = results.map(row => row.name);
                const pendingMigrations = files.filter(file => !appliedMigrations.includes(file));
                
                pendingMigrations.forEach(migration => {
                    const migrationPath = path.join(migrationsDir, migration);
                    const migrationSql = fs.readFileSync(migrationPath, 'utf-8');

                    connection.query(migrationSql, (err) => {
                        if (err) {
                            console.error(`Erro ao aplicar a migration ${migration}:`, err);
                            return;
                        }
                        
                        connection.query('INSERT INTO migrations (name) VALUES (?)', [migration], (err) => {
                            if (err) {
                                console.error(`Erro ao registrar a migration ${migration}:`, err);
                                return;
                            }

                            console.log(`Migration ${migration} aplicada com sucesso.`);
                        });
                    });
                });
                
                server.listen(port, () => {
                    console.log(`Servidor rodando na porta ${port}`);
                });
            });
        });
    });
}

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
