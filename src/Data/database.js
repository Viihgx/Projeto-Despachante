import { createClient } from '@supabase/supabase-js';
import bcrypt from 'bcryptjs';

const supabaseUrl = 'https://zlzoirfwdhmwmesytvzl.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpsem9pcmZ3ZGhtd21lc3l0dnpsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTA1MzQxOTYsImV4cCI6MjAyNjExMDE5Nn0.QxDTeHLAzf_Re5gIdGo277zutfvxLyamc7xGemWzZ3M';
const supabase = createClient(supabaseUrl, supabaseKey);

async function getSessionUser() {
    const user = supabase.auth.user();
    return user;
}

async function login(email, senha) {
    try {
        const { data: userInfo, error: userError } = await supabase
            .from('Usuarios')
            .select('*')
            .eq('Email_usuario', email)
            .single();
        console.log('Resultado da consulta:', userInfo);
        if (userError) {
            throw new Error(`Erro ao realizar login: ${userError.message}`);
        }
        if (userInfo) {
            const passwordMatch = await bcrypt.compare(senha, userInfo.Senha_usuario);
            if (passwordMatch) {
                // Adicione a propriedade 'nome' ao objeto usuário
                const usuarioComNome = { ...userInfo, nome: userInfo.Nome };
                return { success: true, usuario: usuarioComNome };
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
function validarSenha(senha) {
    const regexSenha = /^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.*[0-9]).{8,}$/;
    return regexSenha.test(senha);
}
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
async function inserirDocumento(id_servico_solicitado, file) {
    try {
        const { data: fileData, error: fileError } = await supabase.storage
            .from('documentos')
            .upload(`anexos/${file.name}`, file);
        if (fileError) {
            throw new Error(`Erro ao fazer upload do arquivo: ${fileError.message}`);
        }
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
async function cadastrarPagamento(detalhesPagamento) {
    try {
        const { data, error } = await supabase
            .from('DetalhesPagamento')
            .insert([detalhesPagamento]);
        if (error) {
            throw new Error(`Erro ao cadastrar detalhes do pagamento: ${error.message}`);
        }
        console.log('Detalhes do pagamento cadastrados com sucesso:', data);
        return { success: true, pagamento: data };
    } catch (error) {
        console.error(error);
        return { success: false, message: 'Erro ao cadastrar detalhes do pagamento' };
    }
}
export { login, cadastrarUsuario, inserirDocumento, cadastrarPagamento, getSessionUser };