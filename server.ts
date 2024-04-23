import express from 'express';
import connection from './src/database';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import multer from 'multer';

const upload = multer({ dest: 'uploads/' });

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
  const { email, password } = req.body;
  connection.query('SELECT * FROM users WHERE email = ?', [email], async (error, result) => {
    if (error || result.length === 0) {
      return res.status(401).send('Usuário ou senha incorretos');
    }
    const user = result[0];
    //console.log('Usuário:', user);
    try {
      if (await bcrypt.compare(password, user.senha)) {
        const token = jwt.sign({ id: user.id }, 'secreto', { expiresIn: '1h' });
        res.status(200).json({ token, user });
      } else {
        res.status(401).send('Usuário ou senha incorretos');
      }
    } catch (error) {
      console.log('Comparando', password, 'com', user.senha);
      console.error('Erro ao autenticar usuário:', error);
      res.status(500).send('Erro ao autenticar usuário');
    }
  });
});

// Rota para obter usuários
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
app.post('/registerproduct', upload.single('image'), async (req, res) => {
  const { name, description, price, userId } = req.body;
  const image = (req.file as Express.Multer.File).path; // A imagem agora é o caminho para o arquivo carregado
  try {
    connection.query('INSERT INTO product (nome, descricao, valor, imagem) VALUES (?, ?, ?, ?)', [name, description, price, image], (error, result) => {
      if (error) {
        res.status(500).send('Erro ao registrar produto');
      } else {
        const productId = result.insertId;
        connection.query('INSERT INTO log (id_produto, tipo, quantidade, data_hora, usuario_id) VALUES (?, "adição", 1, NOW(), ?)', [productId, userId], (error) => {
          if (error) {
            res.status(500).send('Erro ao registrar log');
          } else {
            connection.query('INSERT INTO stock (id_produto, quantidade_atual) VALUES (?, 1)', [productId], (error) => {
              if (error) {
                res.status(500).send('Erro ao registrar estoque');
              } else {
                res.status(201).send('Produto registrado com sucesso');
              }
            });
          }
        });
      }
    });
  } catch (error) {
    res.status(500).send('Erro ao registrar produto');
  }
});

//ROta para obter produto
app.get('/products/:id', (req, res) => {
  const productId = req.params.id;
  connection.query('SELECT * FROM PRODUCTS WHERE ID = ?', [productId], (error, result) => {
    if (error) {
      console.error('Erro ao obter produto:', error);
      res.status(500).send('Erro ao obter produto');
    } else if (result.length > 0) {
      res.json(result[0]);
    } else {
      res.status(404).send('Produto não encontrado');
    }
  });
});

// Rota verificar quantidade
app.get('/products/:id/qtd', async (req, res) => {
  const { id } = req.params;
  try {
    connection.query('SELECT quantidade_atual FROM stock WHERE id_produto = ?', [id], (error, results) => {
      if (error) {
        res.status(500).send('Erro ao buscar quantidade do produto');
      } else {
        if (results.length > 0) {
          res.status(200).json({ quantidade: results[0].quantidade_atual });
        } else {
          res.status(404).send('Produto não encontrado');
        }
      }
    });
  } catch (error) {
    res.status(500).send('Erro ao buscar quantidade do produto');
  }
});

//Rota para editar quantidade do produto
app.put('/products/:id/edit', async (req, res) => {
  const { id } = req.params;
  const { quantity, userId, tipo } = req.body;
  try {
    connection.query('SELECT quantidade_atual FROM stock WHERE id_produto = ?', [id], (error, results) => {
      if (error) {
        res.status(500).send('Erro ao buscar quantidade do produto');
      } else {
        if (results.length > 0) {
          const oldQuantity = results[0].quantidade_atual;
          let newQuantity = 0;
          if (tipo === 'adição') {
            newQuantity = oldQuantity + quantity;
          } else if (tipo === 'remoção') {
            newQuantity = oldQuantity - quantity;
          } else {
            res.status(400).send('Tipo inválido');
            return;
          }
          connection.query('UPDATE stock SET quantidade_atual = ? WHERE id_produto = ?', [newQuantity, id], (error) => {
            if (error) {
              res.status(500).send('Erro ao atualizar quantidade do produto');
            } else {
              connection.query('INSERT INTO log (id_produto, tipo, quantidade, data_hora, usuario_id) VALUES (?, ?, ?, NOW(), ?)', [id, tipo, Math.abs(quantity), userId], (error) => {
                if (error) {
                  res.status(500).send('Erro ao registrar log');
                } else {
                  res.status(200).send('Quantidade do produto atualizada com sucesso');
                }
              });
            }
          });
        } else {
          res.status(404).send('Produto não encontrado');
        }
      }
    });
  } catch (error) {
    res.status(500).send('Erro ao atualizar quantidade do produto');
  }
});

//Rota para listar Produtos
app.get('/product', (req, res) => {
  connection.query('SELECT * FROM PRODUCT', (error, result) => {
    if (error) {
      res.status(500).send('Erro ao obter usuários');
    } else {
      res.json(result);
    }
  });
});

app.use('/uploads', express.static('uploads'));

app.listen(3000, () => {
  console.log('Servidor rodando em http://localhost:3000');
});
