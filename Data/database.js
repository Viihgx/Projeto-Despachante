const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://zlzoirfwdhmwmesytvzl.supabase.co/'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpsem9pcmZ3ZGhtd21lc3l0dnpsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTA1MzQxOTYsImV4cCI6MjAyNjExMDE5Nn0.QxDTeHLAzf_Re5gIdGo277zutfvxLyamc7xGemWzZ3M'
const supabase = createClient(supabaseUrl, supabaseKey)

module.exports = supabase;

// Insere um usuário de teste na tabela de usuários
async function inserirUsuarioDeTeste() {
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
        console.error('Erro ao inserir usuário:', error.message);
        return;
    }


    console.log('Usuário inserido com sucesso:', data);
}
inserirUsuarioDeTeste();