require('dotenv').config();
const express = require('express');
const bcrypt = require('bcrypt');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const { createClient } = require('@supabase/supabase-js');

const app = express();
app.use(express.json());
app.use(cors());

const supabaseUrl = 'https://zlzoirfwdhmwmesytvzl.supabase.co';
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const SECRET_KEY = process.env.SECRET_KEY;

// Middleware para verificar o token JWT
const authenticateToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.sendStatus(401);

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// Função para validar o login
async function validarLogin(email, senha) {
  console.log(`Verificando usuário com email: ${email}`);
  const { data: usuario, error } = await supabase
    .from('Usuarios')  // Verifique se o nome da tabela é 'Usuario'
    .select('*')
    .eq('Email_usuario', email)
    .single();

  if (error || !usuario) {
    console.error('Erro ou usuário não encontrado:', error);
    throw new Error('Usuário não encontrado');
  }

  console.log('Usuário encontrado:', usuario);

  const senhaValida = await bcrypt.compare(senha, usuario.Senha_usuario);

  if (!senhaValida) {
    console.error('Senha inválida para o usuário:', usuario.email_usuario);
    throw new Error('Senha inválida');
  }

  return usuario;
}

// Rota de login
app.post('/login', async (req, res) => {
  const { email, senha } = req.body;

  try {
    const usuario = await validarLogin(email, senha);
    const token = jwt.sign({ id: usuario.ID, email: usuario.email_usuario }, SECRET_KEY, { expiresIn: '1h' });

    res.json({ token });
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
});

// Rota de logout
app.post('/logout', authenticateToken, async (req, res) => {
  try {
    // Implemente qualquer lógica de limpeza de sessão necessária aqui, se aplicável
    res.json({ success: true, message: 'Logout bem-sucedido' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/// Rota protegida
app.get('/protected-route', authenticateToken, async (req, res) => {
  try {
    const { id } = req.user; // ID do usuário extraído do token JWT
    const { data: usuario, error } = await supabase
      .from('Usuarios')
      .select('*')
      .eq('ID', id)
      .single();

    if (error || !usuario) {
      console.error('Erro ao buscar usuário:', error);
      throw new Error('Usuário não encontrado');
    }

    res.json({ message: 'Este é um conteúdo protegido', user: usuario }); // Retornar os detalhes completos do usuário
  } catch (error) {
    res.status(403).json({ error: error.message });
  }
});

// Rota para cadastrar um novo serviço
app.post('/cadastrar-servico', authenticateToken, async (req, res) => {
  const { id_usuario, tipo_servico, forma_pagamento, status_servico, data_solicitacao, file_pdf } = req.body; // Certifique-se de incluir o arquivo PDF aqui

  try {
    // Insira os dados do serviço na tabela servicoSolicitado
    const { data: servico, error } = await supabase
      .from('servicoSolicitado')
      .insert({
        id_usuario,
        tipo_servico,
        forma_pagamento,
        status_servico,
        data_solicitacao,
        file_pdf 
      })
      .single();

    if (error) {
      console.error('Erro ao cadastrar serviço:', error);
      throw new Error('Erro ao cadastrar serviço');
    }

    res.status(201).json({ success: true, message: 'Serviço cadastrado com sucesso', servico });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});


// Inicia o servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
