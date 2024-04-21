import mysql from 'mysql';

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'admin',
  password: '',
  database: 'ESTOQUE'
});

connection.connect(error => {
  if (error) throw error;
  console.log("Conectado com sucesso ao banco de dados!");
});

export default connection;
