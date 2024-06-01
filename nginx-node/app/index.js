const express = require('express');
const http = require('http');
const expressApp = express();
const server = http.createServer(expressApp);

const port = 3000;

expressApp.get('/', (req, res) => {
    res.send('<h1>Full Cycle Rocks!</h1>');
});

server.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});