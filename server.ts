import express from  'express';
import connection from './src/database';

const app = express();

app.get('/', (req, res) => {
connection.query('SELECT * FROM PRODUCT', (error, result) => {
  if (error) {
    res.send('Erro ao obter produtos');
  } else {
    res.json(result);
  }
});
});

app.listen('3000', () => {
  console.log('Servidor rodando em http://localhost:3000');
});






