import React, { useState } from 'react';

export default function Register({ onRegisterSuccess }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [normalPassword, setNormalPassword] = useState('');
  const [securityPassword, setSecurityPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');

    try {
      const response = await fetch('https://jh23268419.app.n8n.cloud/webhook/cadastrar-usuario', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          name,
          normalPassword,
          securityPassword
        }),
      });

      const data = await response.json().catch(() => ({}));

      // Verifica se o cadastro deu certo
      if (response.ok || data.success === true || data.sucesso === true) {
        if (onRegisterSuccess) {
          onRegisterSuccess(data);
        } else {
          alert('Cadastro realizado com sucesso!');
        }
      } else {
        // Pega a mensagem de erro que veio do servidor
        let msg = data.message || data.mensagem || 'Erro ao realizar o cadastro. Tente novamente.';
        
        // Converte erros de duplicidade do banco em uma mensagem amigável
        const lowerMsg = msg.toLowerCase();
        if (
          lowerMsg.includes('duplicate') || 
          lowerMsg.includes('unique') || 
          lowerMsg.includes('already exists') || 
          lowerMsg.includes('violates unique constraint') ||
          lowerMsg.includes('já cadastrado')
        ) {
          msg = 'Este e-mail já está cadastrado.';
        }

        setErrorMessage(msg);
      }
    } catch (error) {
      console.error('Erro de conexão:', error);
      setErrorMessage('Erro de conexão com o servidor. Verifique sua internet.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-900 px-4 py-12 text-white">
      <div className="w-full max-w-md space-y-8 rounded-xl bg-gray-800 p-8 shadow-2xl border border-gray-700">
        <div>
          <h2 className="text-center text-3xl font-extrabold tracking-tight text-white">
            Criar Conta
          </h2>
          <p className="mt-2 text-center text-sm text-gray-400">
            Cadastre-se e comece seu período de teste gratuito
          </p>
        </div>

        {errorMessage && (
          <div className="rounded-md bg-red-500/10 p-4 text-sm text-red-400 border border-red-500/20">
            {errorMessage}
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4 rounded-md shadow-sm">
            <div>
              <label className="block text-sm font-medium text-gray-300">Nome Completo</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 block w-full rounded-md border border-gray-600 bg-gray-700 px-3 py-2 text-white placeholder-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                placeholder="Seu nome"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300">E-mail</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full rounded-md border border-gray-600 bg-gray-700 px-3 py-2 text-white placeholder-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                placeholder="seu@email.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300">Senha Normal</label>
              <input
                type="password"
                required
                value={normalPassword}
                onChange={(e) => setNormalPassword(e.target.value)}
                className="mt-1 block w-full rounded-md border border-gray-600 bg-gray-700 px-3 py-2 text-white placeholder-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                placeholder="••••••••"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300">Senha de Segurança (Coação)</label>
              <input
                type="password"
                required
                value={securityPassword}
                onChange={(e) => setSecurityPassword(e.target.value)}
                className="mt-1 block w-full rounded-md border border-gray-600 bg-gray-700 px-3 py-2 text-white placeholder-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                placeholder="••••••••"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
            >
              {loading ? 'Cadastrando...' : 'Entrar no Aplicativo'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
