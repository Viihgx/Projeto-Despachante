// require('dotenv').config();
// const bcrypt = require('bcrypt');
// const { createClient } = require('@supabase/supabase-js');

// const supabaseUrl = 'https://zlzoirfwdhmwmesytvzl.supabase.co';
// const supabaseKey = process.env.SUPABASE_KEY;
// const supabase = createClient(supabaseUrl, supabaseKey);

// async function inserirUsuario() {
//   const senha = 'Moderador123!';
//   const hashedPassword = await bcrypt.hash(senha, 10);

//   const usuario = {
//     Nome: 'Moderador Teste',
//     Email_usuario: 'moderador123@gmail.com',
//     Senha_usuario: hashedPassword,
//     is_moderador: true
//   };

//   const { data, error } = await supabase
//     .from('Usuarios')
//     .insert([usuario]);

//   if (error) {
//     console.error('Erro ao inserir usuário:', error.message);
//   } else {
//     console.log('Usuário inserido com sucesso:', data);
//   }
// }

// inserirUsuario();
