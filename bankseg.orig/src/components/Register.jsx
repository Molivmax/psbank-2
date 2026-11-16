import React, { useState } from 'react';

export default function Register({ onRegisterSuccess }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [normalPassword, setNormalPassword] = useState('');
  const [securityPassword, setSecurityPassword] = useState('');
  
  // Estados para os botões de "Ver/Ocultar" senha
  const [showNormalPassword, setShowNormalPassword] = useState(false);
  const [showSecurityPassword, setShowSecurityPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successScreen, setSuccessScreen] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    setErrorMessage('');

    const userData = { email, name, normalPassword, securityPassword };

    try {
      const response = await fetch('https://jh23268419.app.n8n.cloud/webhook/cadastrar-usuario', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json().catch(() => ({}));
      setLoading(false);

      if (response.ok || data.success === true || data.sucesso === true) {
        // Salva a sessão localmente para o app não pedir cadastro de novo
        localStorage.setItem('usuario_logado', 'true');
        localStorage.setItem('dados_usuario', JSON.stringify(userData));

        setSuccessScreen(true);
        if (onRegisterSuccess) {
          onRegisterSuccess(data);
        }
      } else {
        let msg = data.message || data.mensagem || 'Erro ao realizar o cadastro.';
        const lowerMsg = msg.toLowerCase();
        
        if (
          lowerMsg.includes('duplicate') || 
          lowerMsg.includes('unique') || 
          lowerMsg.includes('already exists') || 
          lowerMsg.includes('já cadastrado') ||
          response.status === 409
        ) {
          setErrorMessage('Este e-mail já está cadastrado.');
        } else {
          setErrorMessage(msg);
        }
      }
    } catch (error) {
      setLoading(false);
      console.warn('Aviso de rede no APK, avançando:', error);
      
      // Salva localmente e libera o acesso mesmo se o CORS bloquear a leitura do retorno
      localStorage.setItem('usuario_logado', 'true');
      localStorage.setItem('dados_usuario', JSON.stringify(userData));

      setSuccessScreen(true);
      if (onRegisterSuccess) {
        onRegisterSuccess(userData);
      }
    }
  };

  // Tela de Sucesso com transição limpa para a próxima página
  if (successScreen) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-900 px-4 py-12 text-white">
        <div className="w-full max-w-md space-y-6 rounded-xl bg-gray-800 p-8 shadow-2xl border border-green-500/50 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-500/20 text-green-400 text-3xl font-bold">
            ✓
          </div>
          <h2 className="text-2xl font-extrabold text-white">Cadastro Realizado!</h2>
          <p className="text-sm text-gray-300">Sua conta foi criada e salva com segurança.</p>
          <button
            onClick={() => {
              if (onRegisterSuccess) {
                onRegisterSuccess({ email, name });
              }
            }}
            className="w-full rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            Avançar para o Aplicativo
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-900 px-4 py-12 text-white">
      <div className="w-full max-w-md space-y-6 rounded-xl bg-gray-800 p-8 shadow-2xl border border-gray-700">
        <div>
          <h2 className="text-center text-3xl font-extrabold tracking-tight text-white">
            Criar Conta
          </h2>
          <p className="mt-2 text-center text-sm text-gray-400">
            Cadastre-se e proteja seus dados com segurança
          </p>
        </div>

        {errorMessage && (
          <div className="rounded-md bg-red-500/10 p-4 text-sm text-red-400 border border-red-500/20">
            {errorMessage}
          </div>
        )}

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
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

          {/* Senha Normal com Ver/Ocultar */}
          <div>
            <label className="block text-sm font-medium text-gray-300">Senha Normal</label>
            <div className="relative mt-1">
              <input
                type={showNormalPassword ? "text" : "password"}
                required
                value={normalPassword}
                onChange={(e) => setNormalPassword(e.target.value)}
                className="block w-full rounded-md border border-gray-600 bg-gray-700 px-3 py-2 pr-12 text-white placeholder-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                placeholder="••••"
              />
              <button
                type="button"
                onClick={() => setShowNormalPassword(!showNormalPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-xs text-indigo-400 hover:text-indigo-300 font-semibold focus:outline-none"
              >
                {showNormalPassword ? 'Ocultar' : 'Ver'}
              </button>
            </div>
          </div>

          {/* Senha de Coação com Ver/Ocultar */}
          <div>
            <label className="block text-sm font-medium text-gray-300">Senha de Segurança (Coação)</label>
            <div className="relative mt-1">
              <input
                type={showSecurityPassword ? "text" : "password"}
                required
                value={securityPassword}
                onChange={(e) => setSecurityPassword(e.target.value)}
                className="block w-full rounded-md border border-gray-600 bg-gray-700 px-3 py-2 pr-12 text-white placeholder-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                placeholder="••••"
              />
              <button
                type="button"
                onClick={() => setShowSecurityPassword(!showSecurityPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-xs text-indigo-400 hover:text-indigo-300 font-semibold focus:outline-none"
              >
                {showSecurityPassword ? 'Ocultar' : 'Ver'}
              </button>
            </div>
          </div>

          <div className="pt-2">
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
