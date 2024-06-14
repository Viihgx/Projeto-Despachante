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

app.post('/upload-pdf', authenticateToken, upload.array('pdfs'), async (req, res) => {
  try {
    const files = req.files;
    if (!files || files.length === 0) {
      console.error('Nenhum arquivo enviado');
      return res.status(400).json({ error: 'Nenhum arquivo enviado' });
    }

    const urls = [];
    for (const file of files) {
      const filePath = path.join(__dirname, 'uploads', file.filename);
      console.log('File path:', filePath);

      const form = new FormData();
      form.append('file', fs.createReadStream(filePath));

      const response = await axios.post(`${supabaseUrl}/storage/v1/object/arquivoPdf/${file.filename}`, form, {
        headers: {
          ...form.getHeaders(),
          'Authorization': `Bearer ${supabaseKey}`,
          'Cache-Control': '3600',
          'apikey': supabaseKey
        }
      });

      if (response.status !== 200) {
        console.error('Erro no Supabase upload:', response.data);
        return res.status(response.status).json({ error: response.data });
      }

      const publicURL = `${supabaseUrl}/storage/v1/object/public/arquivoPdf/${file.filename}`;
      urls.push(publicURL);

      fs.unlinkSync(filePath);
    }

    res.json({ urls });
  } catch (error) {
    console.error('Erro ao processar o upload dos arquivos PDF:', error.message);
    res.status(500).json({ error: 'Erro ao processar o upload dos arquivos PDF' });
  }
});


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

async function validarLogin(email, senha) {
  console.log('Validando login para:', email);

  const { data: usuario, error } = await supabase
    .from('Usuarios')
    .select('*')
    .eq('Email_usuario', email)
    .single();

  if (error || !usuario) {
    console.error('Usuário não encontrado:', error);
    throw new Error('Usuário não encontrado');
  }

  const senhaValida = await bcrypt.compare(senha, usuario.Senha_usuario);

  if (!senhaValida) {
    console.error('Senha inválida');
    throw new Error('Senha inválida');
  }

  console.log('Usuário validado:', usuario);
  return usuario;
}

app.post('/login', async (req, res) => {
  const { email, senha } = req.body;

  try {
    console.log('Tentando fazer login com email:', email);
    const usuario = await validarLogin(email, senha);
    console.log('Usuário validado:', usuario);

    const token = jwt.sign({ id: usuario.ID, email: usuario.Email_usuario, is_moderador: usuario.is_moderador }, SECRET_KEY, { expiresIn: '1h' });
    console.log('Token gerado:', token);

    res.json({ token, is_moderador: usuario.is_moderador });
  } catch (error) {
    console.error('Erro no login:', error.message);
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
  const { id_usuario, tipo_servico, forma_pagamento, status_servico, data_solicitacao, file_pdfs, nome_completo, placa_do_veiculo, apelido_do_veiculo } = req.body;

  // Validação para a placa do veículo
  const placaMercosul = /^[A-Z]{3}[0-9][A-Z][0-9]{2}$/;
  const placaAntiga = /^[A-Z]{3}[0-9]{4}$/;
  
  if (!placaMercosul.test(placa_do_veiculo) && !placaAntiga.test(placa_do_veiculo)) {
    return res.status(400).json({ success: false, message: 'Placa do veículo inválida' });
  }

  try {
    const { data: servico, error } = await supabase
      .from('servicoSolicitado')
      .insert({
        id_usuario,
        tipo_servico,
        forma_pagamento,
        status_servico,
        data_solicitacao,
        file_pdfs,
        nome_completo,
        placa_do_veiculo,
        apelido_do_veiculo
      });

    if (error) {
      throw new Error('Erro ao cadastrar serviço');
    }

    res.status(201).json({ success: true, message: 'Serviço cadastrado com sucesso', servico });
  } catch (error) {
    console.error('Erro ao cadastrar serviço:', error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Rota para buscar dados específicos para o moderador
// Rota para buscar dados específicos para o moderador
app.get('/moderador/servicos', authenticateToken, async (req, res) => {
  try {
    if (!req.user.is_moderador) {
      console.error('Acesso negado: usuário não é moderador');
      return res.status(403).json({ error: 'Acesso negado' });
    }

    const { data: servicos, error } = await supabase
      .from('servicoSolicitado')
      .select(`
        id,
        tipo_servico,
        status_servico,
        data_solicitacao,
        file_pdfs,
        id_usuario,
        nome_completo,
        placa_do_veiculo,
        apelido_do_veiculo,
        forma_pagamento,
        Usuarios (
          Email_usuario
        )
      `)
      .order('data_solicitacao', { ascending: true });

    if (error) {
      console.error('Erro ao buscar serviços no Supabase:', error);
      throw new Error('Erro ao buscar serviços');
    }

    res.json({ servicos });
  } catch (error) {
    console.error('Erro ao buscar serviços:', error.message);
    res.status(500).json({ error: error.message });
  }
});


// Rota para atualizar o status do serviço
app.patch('/moderador/servicos/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Atualize o status do serviço no banco de dados
    const { data: servicoAtualizado, error } = await supabase
      .from('servicoSolicitado')
      .update({ status_servico: status })
      .eq('id', id)
      .single();

    if (error || !servicoAtualizado) {
      throw new Error('Erro ao atualizar o status do serviço');
    }

    res.json({ success: true, message: 'Status do serviço atualizado com sucesso', servico: servicoAtualizado });
  } catch (error) {
    console.error('Erro ao atualizar status do serviço:', error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

//rota para addicionar carro
app.post('/add-vehicle', authenticateToken, async (req, res) => {
  const { placa_veiculo, nome_veiculo } = req.body;
  const { id: usuario_id } = req.user;

  try {
    const { data, error } = await supabase
      .from('Veiculos')
      .insert({ usuario_id, placa_veiculo, nome_veiculo });

    if (error) {
      console.error('Erro ao inserir no Supabase:', error); // Log do erro do Supabase
      return res.status(500).json({ success: false, error: error.message });
    }

    console.log('Veículo adicionado com sucesso:', data);
    res.status(201).json({ success: true, veiculo: data[0] });
  } catch (error) {
    console.error('Erro ao adicionar veículo:', error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Rota para buscar veículos do usuário
app.get('/user-vehicles', authenticateToken, async (req, res) => {
  const { id: usuario_id } = req.user;

  try {
    const { data: veiculos, error } = await supabase
      .from('Veiculos')
      .select('*')
      .eq('usuario_id', usuario_id);

    if (error) {
      throw new Error(error.message);
    }

    res.json({ success: true, veiculos });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});


// Rota para buscar serviços do usuário
app.get('/user-services', authenticateToken, async (req, res) => {
  try {
    const { id } = req.user;
    const { data: servicos, error } = await supabase
      .from('servicoSolicitado')
      .select('*, nome_completo, placa_do_veiculo, apelido_do_veiculo, forma_pagamento')
      .eq('id_usuario', id);

    if (error) {
      throw new Error('Erro ao buscar serviços');
    }

    res.json({ servicos });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Rota para atualizar PDF (usuario)
app.post('/update-pdf/:servicoId/:index', authenticateToken, upload.single('pdf'), async (req, res) => {
  const { servicoId, index } = req.params;
  const file = req.file;

  if (!file) {
    return res.status(400).json({ success: false, message: 'Nenhum arquivo enviado' });
  }

  try {
    const filePath = path.join(__dirname, 'uploads', file.filename);
    const form = new FormData();
    form.append('file', fs.createReadStream(filePath));

    const response = await axios.post(`${supabaseUrl}/storage/v1/object/arquivoPdf/${file.filename}`, form, {
      headers: {
        ...form.getHeaders(),
        'Authorization': `Bearer ${supabaseKey}`,
        'apikey': supabaseKey
      }
    });

    if (response.status !== 200) {
      return res.status(response.status).json({ success: false, message: response.data });
    }

    const fileUrl = `${supabaseUrl}/storage/v1/object/public/arquivoPdf/${file.filename}`;
    fs.unlinkSync(filePath);

    const { data: servico, error } = await supabase
      .from('servicoSolicitado')
      .select('file_pdfs')
      .eq('id', servicoId)
      .single();

    if (error || !servico) {
      throw new Error('Serviço não encontrado');
    }

    let filePdfs = JSON.parse(servico.file_pdfs);
    filePdfs[index] = fileUrl;

    const { data: updatedServico, error: updateError } = await supabase
      .from('servicoSolicitado')
      .update({ file_pdfs: JSON.stringify(filePdfs) })
      .eq('id', servicoId)
      .single();

    if (updateError) {
      throw new Error('Erro ao atualizar serviço');
    }

    res.json({ success: true, fileUrl });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Rota para enviar mensagem ao cliente
app.post('/send-message', authenticateToken, async (req, res) => {
  const { servicoId, text } = req.body;

  try {
    const { data: message, error } = await supabase
      .from('messages')
      .insert({
        servico_id: servicoId,
        text,
        timestamp: new Date(),
      })
      .single();

    if (error) {
      throw new Error('Erro ao enviar mensagem');
    }

    res.status(201).json({ success: true, message: 'Mensagem enviada com sucesso', message });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});


// Rota para buscar mensagens de um serviço específico
app.get('/messages/:servicoId', authenticateToken, async (req, res) => {
  const { servicoId } = req.params;

  try {
    const { data: messages, error } = await supabase
      .from('messages')
      .select('*')
      .eq('servico_id', servicoId)
      .order('timestamp', { ascending: false });

    if (error) {
      throw new Error('Erro ao buscar mensagens');
    }

    res.json({ success: true, messages });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Rota para editar perfil
app.put('/update-profile', authenticateToken, async (req, res) => {
  const { nome, email, endereco, placa_veiculo, numero_celular, senhaAtual } = req.body;
  const { id } = req.user;

  try {
    // Verifique a senha atual
    const { data: usuario, error: userError } = await supabase
      .from('Usuarios')
      .select('Senha_usuario')
      .eq('ID', id)
      .single();

    if (userError || !usuario) {
      throw new Error('Usuário não encontrado');
    }

    if (!senhaAtual) {
      return res.status(400).json({ success: false, message: 'Senha atual é obrigatória' });
    }

    const senhaValida = await bcrypt.compare(senhaAtual, usuario.Senha_usuario);

    if (!senhaValida) {
      return res.status(401).json({ success: false, message: 'Senha atual incorreta' });
    }

    // Atualizar os dados do usuário no banco de dados
    let updateData = {
      Nome: nome,
      Email_usuario: email,
      Endereco: endereco,
      Placa_do_veiculo: placa_veiculo,
      Numero_celular: numero_celular
    };

    const { data, error } = await supabase
      .from('Usuarios')
      .update(updateData)
      .eq('ID', id)
      .select(); // Certifique-se de selecionar os dados atualizados

    if (error) {
      console.error('Erro ao atualizar perfil no Supabase:', error.message);
      throw new Error('Erro ao atualizar perfil');
    }

    if (!data || data.length === 0) {
      console.error('Nenhum usuário atualizado');
      throw new Error('Erro ao atualizar perfil');
    }

    res.json({ success: true, message: 'Perfil atualizado com sucesso', user: data[0] });
  } catch (error) {
    console.error('Erro ao atualizar perfil:', error.message);
    res.status(500).json({ success: false, message: error.message });
  }
});

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});