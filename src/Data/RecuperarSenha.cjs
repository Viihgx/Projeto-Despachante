require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const SECRET_KEY = process.env.SECRET_KEY;

// Configuração do nodemailer
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Função para gerar um PIN aleatório
function gerarPin() {
  return Math.floor(100000 + Math.random() * 900000).toString(); // Gera um PIN de 6 dígitos
}

// Função para enviar o email de recuperação de senha
async function enviarEmailRecuperacao(email, pin) {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'PIN de Redefinição de Senha',
    text: `Seu PIN de redefinição de senha é: ${pin}`
  };

  console.log('Enviando email para:', email);
  try {
    await transporter.sendMail(mailOptions);
    console.log('Email enviado para:', email);
  } catch (error) {
    console.error('Erro ao enviar email:', error.message);
    throw new Error('Erro ao enviar email de recuperação de senha');
  }
}

// Função para recuperar senha
async function recuperarSenha(email) {
  console.log('Iniciando recuperação de senha para:', email);
  try {
    const { data: usuario, error } = await supabase
      .from('Usuarios')
      .select('*')
      .eq('Email_usuario', email)
      .single();

    if (error || !usuario) {
      console.error('Erro ao encontrar usuário:', error);
      throw new Error('Usuário não encontrado');
    }

    const pin = gerarPin();
    const expiracao = new Date();
    expiracao.setMinutes(expiracao.getMinutes() + 30); // Define a expiração para 30 minutos a partir de agora

    console.log('PIN de redefinição de senha gerado:', pin);
    console.log('Expiração do PIN:', expiracao);

    await supabase
      .from('Usuarios')
      .update({ pin_recuperacao: pin, expiracao_pin: expiracao })
      .eq('Email_usuario', email);

    await enviarEmailRecuperacao(email, pin);
  } catch (error) {
    console.error('Erro na função recuperarSenha:', error.message);
    throw error;
  }
}

module.exports = {
  recuperarSenha
};
