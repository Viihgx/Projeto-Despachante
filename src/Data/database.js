import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://zlzoirfwdhmwmesytvzl.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpsem9pcmZ3ZGhtd21lc3l0dnpsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTA1MzQxOTYsImV4cCI6MjAyNjExMDE5Nn0.QxDTeHLAzf_Re5gIdGo277zutfvxLyamc7xGemWzZ3M';
const supabase = createClient(supabaseUrl, supabaseKey);

async function inserirUsuarioDeTeste() {
    try {
        const { data, error } = await supabase
            .from('Usuarios')
            .insert([
                {
                    Nome: 'Usuário de Test',
                    Placa_do_Veiculo: 'AB31234',
                    Tipo_de_veiculo: 'CarroE',
                    Plano_adquirido: 'Plano C',
                    Endereco: 'Endereço de Teste4',
                }
            ]);

        if (error) {
            throw new Error(`Erro ao inserir usuário: ${error.message}`);
        }

        console.log('Usuário inserido com sucesso:', data);
        return { success: true, usuario: data };
    } catch (error) {
        console.error(error);
        return { success: false, message: 'Erro ao inserir usuário' };
    }
}

async function login(email, senha) {
    try {
        const { data, error } = await supabase
            .from('Usuarios')
            .select('*')
            .eq('Email_usuario', email)
            .eq('Senha_usuario', senha)
            .single();

        if (error) {
            throw new Error(`Erro ao realizar login: ${error.message}`);
        }

        if (data) {
            return { success: true, usuario: data };
        } else {
            return { success: false, message: 'Email ou senha incorretos' };
        }
    } catch (error) {
        console.error(error);
        return { success: false, message: 'Erro ao realizar login' };
    }
}

async function cadastrarUsuario(usuario) {
    try {
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

export { login, cadastrarUsuario, inserirUsuarioDeTeste };