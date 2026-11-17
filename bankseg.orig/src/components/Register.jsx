import React, { useState } from 'react';
import { supabase } from '../supabaseClient'; // Ajuste o caminho do import se necessário

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    setErrorMessage('');

    try {
      // 1. Verifica se o e-mail já existe na tabela usuarios
      const { data: existingUser, error: checkError } = await supabase
        .from('usuarios')
        .select('email')
        .eq('email', email)
        .maybeSingle();

      if (existingUser) {
        setLoading(false);
        setErrorMessage('Este e-mail já está cadastrado.');
        return;
      }

      // 2. Insere o novo usuário diretamente no Supabase
      const { data, error: insertError } = await supabase
        .from('usuarios')
        .insert([
          {
            name,
            email,
            normalPassword,
            securityPassword
          }
        ])
        .select();

      if (insertError) {
        throw insertError;
      }

      setLoading(false);

      // Salva sessão localmente para o app lembrar do usuário logado
      localStorage.setItem('usuario_logado', 'true');
      localStorage.setItem('dados_usuario', JSON.stringify({ email, name }));

      // 3. Sucesso! Avança para a próxima tela do app
      if (onRegisterSuccess) {
        onRegisterSuccess({
          success: true,
          nextStep: 'payment',
          email,
          name
        });
      }
    } catch (error) {
      setLoading(false);
      console.error('Erro ao cadastrar no Supabase:', error);
      
      // Tratamento para e-mail duplicado ou erro geral
      if (error.code === '23505' || (error.message && error.message.toLowerCase().includes('duplicate'))) {
        setErrorMessage('Este e-mail já está cadastrado.');
      } else {
        setErrorMessage('Erro ao realizar o cadastro. Tente novamente.');
      }
    }
  };

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
              {loading ? '
