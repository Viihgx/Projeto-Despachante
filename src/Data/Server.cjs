require('dotenv').config();
const express = require('express');
const bcrypt = require('bcrypt');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const { createClient } = require('@supabase/supabase-js');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const FormData = require('form-data');

const app = express();
app.use(express.json());
app.use(cors());

const supabaseUrl = 'https://zlzoirfwdhmwmesytvzl.supabase.co';
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const SECRET_KEY = process.env.SECRET_KEY;

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(__dirname, 'uploads');
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath);
    }
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
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
  const { data: usuario, error } = await supabase
    .from('Usuarios')
    .select('*')
    .eq('Email_usuario', email)
    .single();

  if (error || !usuario) {
    throw new Error('Usuário não encontrado');
  }

  const senhaValida = await bcrypt.compare(senha, usuario.Senha_usuario);

  if (!senhaValida) {
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
    res.json({ success: true, message: 'Logout bem-sucedido' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Rota protegida
app.get('/protected-route', authenticateToken, async (req, res) => {
  try {
    const { id } = req.user;
    const { data: usuario, error } = await supabase
      .from('Usuarios')
      .select('*')
      .eq('ID', id)
      .single();

    if (error || !usuario) {
      throw new Error('Usuário não encontrado');
    }

    res.json({ message: 'Este é um conteúdo protegido', user: usuario });
  } catch (error) {
    res.status(403).json({ error: error.message });
  }
});

// Rota para cadastrar serviço
app.post('/cadastrar-servico', authenticateToken, async (req, res) => {
  const { id_usuario, tipo_servico, forma_pagamento, status_servico, data_solicitacao, file_pdf } = req.body;

  try {
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
      throw new Error('Erro ao cadastrar serviço');
    }

    res.status(201).json({ success: true, message: 'Serviço cadastrado com sucesso', servico });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Rota de upload do arquivo pdf
app.post('/upload-pdf', authenticateToken, upload.single('pdf'), async (req, res) => {
  try {
    const file = req.file;
    if (!file) {
      console.error('Nenhum arquivo enviado');
      return res.status(400).json({ error: 'Nenhum arquivo enviado' });
    }

    const token = req.headers.authorization.split(' ')[1];
    const decoded = jwt.decode(token);

    const filePath = path.join(__dirname, 'uploads', file.filename);
    console.log('File path:', filePath);

    const form = new FormData();
    form.append('file', fs.createReadStream(filePath));

    const response = await axios.post(`${supabaseUrl}/storage/v1/object/arquivoPdf/${file.filename}`, form, {
      headers: {
        ...form.getHeaders(),
        'Authorization': `Bearer ${supabaseKey}`,
        'Cache-Control': '3600',
      }
    });

    const publicURL = `${supabaseUrl}/storage/v1/object/public/arquivoPdf/${file.filename}`;

    console.log('Public URL:', publicURL);

    fs.unlinkSync(filePath);
    res.json({ url: publicURL });
  } catch (error) {
    console.error('Erro ao processar o upload do arquivo PDF:', error.message);
    res.status(500).json({ error: 'Erro ao processar o upload do arquivo PDF' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});