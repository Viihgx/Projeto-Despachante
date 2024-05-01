import { createClient } from '@supabase/supabase-js';
import bcrypt from 'bcryptjs';


const supabaseUrl = 'https://zlzoirfwdhmwmesytvzl.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpsem9pcmZ3ZGhtd21lc3l0dnpsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTA1MzQxOTYsImV4cCI6MjAyNjExMDE5Nn0.QxDTeHLAzf_Re5gIdGo277zutfvxLyamc7xGemWzZ3M';
const supabase = createClient(supabaseUrl, supabaseKey);

async function login(email, senha) {
    try {
        const { data, error } = await supabase
            .from('Usuarios')
            .select('*')
            .eq('Email_usuario', email)
            .single();

        if (error) {
            throw new Error(`Erro ao realizar login: ${error.message}`);
        }

        if (data) {
            // Comparando a senha fornecida com o hash armazenado
            const passwordMatch = await bcrypt.compare(senha, data.Senha_usuario);
            if (passwordMatch) {
                return { success: true, usuario: data };
            } else {
                return { success: false, message: 'Email ou senha incorretos' };
            }
        } else {
            return { success: false, message: 'Email ou senha incorretos' };
        }
    } catch (error) {
        console.error(error);
        return { success: false, message: 'Erro ao realizar login' };
    }
}

function validarEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}



async function cadastrarUsuario(usuario) {
    try {
        // Hash da senha antes de inserir no banco de dados
        const hashedPassword = await bcrypt.hash(usuario.Senha_usuario, 10);
        usuario.Senha_usuario = hashedPassword;
        
        if (!validarEmail(usuario.Email_usuario)) {
            throw new Error('Endereço de e-mail inválido');
        }

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
        return { success: false, message: 'Erro ao cadastrar usuário' };
    }
}
async function inserirDocumento(id_servico_solicitado, file) {
    try {
        // Faz o upload do arquivo para o Supabase Storage
        const { data: fileData, error: fileError } = await supabase.storage
            .from('documentos')
            .upload(`anexos/${file.name}`, file);

        if (fileError) {
            throw new Error(`Erro ao fazer upload do arquivo: ${fileError.message}`);
        }

        // Insere os dados do documento na tabela anexosdocumentos
        const { data, error } = await supabase
            .from('anexosdocumentos')
            .insert([
                {
                    id_servico_solicitado: id_servico_solicitado,
                    nome_arquivo: file.name,
                    caminho_arquivo: fileData.Key,
                    data_hora_envio: new Date().toISOString()
                }
            ]);

        if (error) {
            throw new Error(`Erro ao inserir documento: ${error.message}`);
        }

        console.log('Documento inserido com sucesso:', data);
        return { success: true, documento: data };
    } catch (error) {
        console.error(error);
        return { success: false, message: 'Erro ao inserir documento' };
    }
}

export { login, cadastrarUsuario, inserirDocumento };