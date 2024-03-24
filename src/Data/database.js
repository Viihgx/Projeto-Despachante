import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://zlzoirfwdhmwmesytvzl.supabase.co/';
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
    } catch (error) {
        console.error(error);
    }
}

inserirUsuarioDeTeste();