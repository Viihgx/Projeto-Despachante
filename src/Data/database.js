import { createClient } from '@supabase/supabase-js';
import bcrypt from 'bcryptjs';

const supabaseUrl = 'https://zlzoirfwdhmwmesytvzl.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpsem9pcmZ3ZGhtd21lc3l0dnpsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTA1MzQxOTYsImV4cCI6MjAyNjExMDE5Nn0.QxDTeHLAzf_Re5gIdGo277zutfvxLyamc7xGemWzZ3M';
const supabase = createClient(supabaseUrl, supabaseKey);

async function isUserLoggedIn() {
    const user = supabase.auth.user();
    return user !== null;
}

async function getSessionUserIfLoggedIn() {
    try {
        if (await isUserLoggedIn()) {
            const sessionUser = await getSessionUser();
            if (sessionUser) {
                console.log('Usuário está na sessão:', sessionUser.nome); // Mensagem indicando que o usuário está na sessão
            }
            return sessionUser;
        } else {
            console.log('Usuário não está na sessão'); // Mensagem indicando que o usuário não está na sessão
            throw new Error('Usuário não autenticado');
        }
    } catch (error) {
        console.error(error);
        return null;
    }
}

async function getSessionUser() {
    try {
        const user = supabase.auth.user();
        if (user) {
            const { data: userData, error } = await supabase
                .from('Usuarios')
                .select('ID', 'Nome', 'Email_usuario') // Include the 'id' field
                .eq('ID', user.id.toUpperCase())
                .single();
            if (error) {
                throw new Error(`Erro ao buscar informações do usuário: ${error.message}`);
            }
            if (userData) {
                return { ...user, ID: userData.id, nome: userData.Nome, email: userData.Email_usuario }; // Include the 'id' field
            } else {
                throw new Error('Informações do usuário não encontradas');
            }
        } else {
            throw new Error('Usuário não autenticado');
        }
    } catch (error) {
        console.error('Erro ao obter o usuário da sessão:', error.message);
        return null;
    }
}


async function login(email, senha) {
    try {
        const { data: userInfo, error: userError } = await supabase
            .from('Usuarios')
            .select('*')
            .eq('Email_usuario', email)
            .single();
        
        if (userError) {
            throw new Error(`Erro ao realizar login: ${userError.message}`);
        }

        if (userInfo) {
            const passwordMatch = await bcrypt.compare(senha, userInfo.Senha_usuario); // Comparar senhas
            
            if (passwordMatch) {
                console.log('Login bem-sucedido'); // Mensagem indicando login bem-sucedido
                return { success: true };
            } else {
                throw new Error('Senha incorreta');
            }
        } else {
            throw new Error('Usuário não encontrado');
        }
    } catch (error) {
        console.error('Erro ao realizar login:', error.message);
        return { success: false, message: error.message };
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

async function logout() {
    try {
        const { error } = await supabase.auth.signOut();
        if (error) {
            throw new Error(`Erro ao realizar logout: ${error.message}`);
        }
        console.log('Usuário desconectado com sucesso');
        return { success: true };
    } catch (error) {
        console.error(error);
        return { success: false, message: 'Erro ao realizar logout' };
    }
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

const cadastrarServicoSolicitado = async (tipoServico) => {
    try {
      const user = supabase.auth.user();
      if (!user) {
        throw new Error('Usuário não autenticado');
      }
      
      const idUsuario = user.id;
      
      const insercao = await supabase
        .from('servissolicitados')
        .insert([{ id_usuario: idUsuario, tipo_servico: tipoServico }]);
  
      return { success: true };
    } catch (error) {
      console.error('Erro ao cadastrar serviço solicitado:', error);
      return { success: false, message: 'Erro ao cadastrar serviço solicitado' };
    }
};


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

export { login, cadastrarUsuario, inserirDocumento, cadastrarPagamento, getSessionUser, getSessionUserIfLoggedIn, logout, cadastrarServicoSolicitado };