require('dotenv').config();
const express = require('express');
const bcrypt = require('bcrypt');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const { createClient } = require('@supabase/supabase-js');
const multer = require('multer');
const fs = require('fs');

const app = express();
app.use(express.json());
app.use(cors());

const supabaseUrl = 'https://zlzoirfwdhmwmesytvzl.supabase.co';
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const SECRET_KEY = process.env.SECRET_KEY;

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/') // Diretório onde os arquivos serão salvos
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname) // Nome do arquivo
  }
});

const upload = multer({ storage: storage });


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

//rota para cadastrar serviço
app.post('/cadastrar-servico', authenticateToken, async (req, res) => {
  const { id_usuario, tipo_servico, forma_pagamento, status_servico, data_solicitacao } = req.body;

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
        file_pdf: req.body.file_pdf // Utilize a URL do arquivo PDF que foi retornada ao fazer o upload
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

// rota de upload do arquivo pdf
app.post('/upload-pdf', authenticateToken, upload.single('pdf'), async (req, res) => {
  try {
    const file = req.file;
    if (!file) {
      return res.status(400).json({ error: 'Nenhum arquivo enviado' });
    }
    
    // Obtenha o token JWT do cabeçalho de autorização
    const token = req.headers.authorization.split(' ')[1];
    const decoded = jwt.decode(token);

    // Upload do arquivo para o bucket no Supabase
    const { data, error } = await supabase.storage
      .from('arquivoPdf')
      .upload(file.path, {
        destination: `public/${file.originalname}`, // Define o destino como uma pasta pública com o nome original do arquivo
        contentType: 'application/pdf',
        upsert: false, // Impede a substituição do arquivo se ele já existir
        cacheControl: '3600', // Define o controle de cache para 1 hora
        metadata: {
          id_usuario: decoded.id, // Adiciona o ID do usuário como metadado
        },
      });

    if (error) {
      console.error('Erro ao fazer o upload do arquivo PDF:', error.message);
      return res.status(500).json({ error: 'Erro ao fazer o upload do arquivo PDF' });
    }

    // Log da URL pública do arquivo PDF antes de enviar a resposta
    console.log('URL do arquivo PDF:', `${supabaseUrl}/storage/v1/object/public/${file.originalname}`);

    // Retorne a URL pública do arquivo PDF
    res.json({ url: `${supabaseUrl}/storage/v1/object/public/${file.originalname}` });
  } catch (error) {
    console.error('Erro ao processar o upload do arquivo PDF:', error.message);
    res.status(500).json({ error: 'Erro ao processar o upload do arquivo PDF' });
  }
});

// Inicia o servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
