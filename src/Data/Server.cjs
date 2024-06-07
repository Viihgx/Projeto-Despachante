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
const { recuperarSenha } = require('./RecuperarSenha.cjs'); 

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

 
// Rota para recuperar senha
app.post('/recuperar-senha', async (req, res) => {
  const { email } = req.body;

  try {
    console.log('Solicitação de recuperação de senha recebida para:', email);
    await recuperarSenha(email);
    res.json({ success: true, message: 'PIN de redefinição enviado para o email' });
  } catch (error) {
    console.error('Erro ao processar solicitação de recuperação de senha:', error.message);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Rota para validar o PIN e redefinir a senha
app.post('/redefinir-senha', async (req, res) => {
  const { email, pin, novaSenha } = req.body;

  try {
    const { data: usuario, error } = await supabase
      .from('Usuarios')
      .select('*')
      .eq('Email_usuario', email)
      .eq('pin_recuperacao', pin)
      .single();

    if (error || !usuario) {
      console.error('Erro ao encontrar usuário ou PIN inválido:', error);
      throw new Error('PIN inválido ou expirado');
    }

    const expiracao = new Date(usuario.expiracao_pin);
    const agora = new Date();

    console.log('Expiração do PIN:', expiracao);
    console.log('Hora atual:', agora);

    if (agora > expiracao) {
      console.error('PIN expirado');
      throw new Error('PIN expirado');
    }

    const hashedPassword = await bcrypt.hash(novaSenha, 10);
    await supabase
      .from('Usuarios')
      .update({ Senha_usuario: hashedPassword, pin_recuperacao: null, expiracao_pin: null })
      .eq('Email_usuario', email);

    res.json({ success: true, message: 'Senha redefinida com sucesso' });
  } catch (error) {
    console.error('Erro ao redefinir senha:', error.message);
    res.status(500).json({ success: false, message: error.message });
  }
});



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

// Função para cadastrar usuário
async function cadastrarUsuario(usuario) {
  try {
    if (!validarEmail(usuario.Email_usuario)) {
      throw new Error('Endereço de e-mail inválido');
    }
    if (!validarSenha(usuario.Senha_usuario)) {
      throw new Error('A senha deve conter ao menos um caractere maiúsculo, um caractere especial e um número.');
    }
    const hashedPassword = await bcrypt.hash(usuario.Senha_usuario, 10);
    usuario.Senha_usuario = hashedPassword;
    const { data, error } = await supabase
      .from('Usuarios')
      .insert([usuario]);
    if (error) {
      throw new Error(`Erro ao cadastrar usuário: ${error.message}`);
    }
    console.log('Usuário cadastrado com sucesso:', data);
    return { success: true, usuario: data };
  } catch (error) {
    console.error(error);
    return { success: false, message: error.message };
  }
}

// Rota para cadastrar usuário
app.post('/cadastro', async (req, res) => {
  const { nome, email, senha } = req.body;

  const usuario = {
    Nome: nome,
    Email_usuario: email,
    Senha_usuario: senha
  };

  try {
    const result = await cadastrarUsuario(usuario);
    if (result.success) {
      res.status(201).json(result);
    } else {
      res.status(400).json(result);
    }
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

// Função para validar o email
function validarEmail(email) {
  const re = /\S+@\S+\.\S+/;
  return re.test(email);
}

// Função para validar a senha
function validarSenha(senha) {
  const re = /^(?=.*[A-Z])(?=.*[!@#$&*])(?=.*[0-9]).{8,}$/;
  return re.test(senha);
}

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