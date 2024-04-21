import express from 'express';
import connection from './src/database';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const app = express();

app.use(express.json());

// Rota de registro
app.post('/register', async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    connection.query('INSERT INTO users (nome, email, senha) VALUES (?, ?, ?)', [name, email, hashedPassword], (error, result) => {
      if (error) {
        res.status(500).send('Erro ao registrar usuário');
      } else {
        res.status(201).send('Usuário registrado com sucesso');
      }
    });
  } catch (error) {
    res.status(500).send('Erro ao registrar usuário');
  }
});

// Rota de login
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  connection.query('SELECT * FROM users WHERE username = ?', [username], async (error, result) => {
    if (error || result.length === 0) {
      return res.status(401).send('Usuário ou senha incorretos');
    }
    const user = result[0];
    try {
      if (await bcrypt.compare(password, user.password)) {
        const token = jwt.sign({ id: user.id }, 'secreto', { expiresIn: '1h' });
        res.status(200).json({ token });
      } else {
        res.status(401).send('Usuário ou senha incorretos');
      }
    } catch {
      res.status(500).send('Erro ao autenticar usuário');
    }
  });
});

app.get('/users', (req, res) => {
  connection.query('SELECT * FROM USERS', (error, result) => {
    if (error) {
      res.status(500).send('Erro ao obter usuários');
    } else {
      res.json(result);
    }
  });
});

// Rota de registro Produto
app.post('/registerproduct', async (req, res) => {
  const { name, description, image, price } = req.body;
  try {
    connection.query('INSERT INTO product (nome, descricao, imagem, valor) VALUES (?, ?, ?, ?)', [name, description, image, price], (error, result) => {
      if (error) {
        res.status(500).send('Erro ao registrar produto');
      } else {
        res.status(201).send('Produto registrado com sucesso');
      }
    });
  } catch (error) {
    res.status(500).send('Erro ao registrar produto');
  }
});

app.get('/product', (req, res) => {
  connection.query('SELECT * FROM PRODUCT', (error, result) => {
    if (error) {
      res.status(500).send('Erro ao obter usuários');
    } else {
      res.json(result);
    }
  });
});

app.listen(3000, () => {
  console.log('Servidor rodando em http://localhost:3000');
});
