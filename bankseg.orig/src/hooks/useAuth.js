import { useState, useEffect, useCallback } from 'react';
import { secureStorage, passwordUtils, securityValidators } from '../utils/crypto';

// Chave mestra para criptografia (em produção, seria derivada de forma mais segura)
const MASTER_KEY = 'pasta-segura-bancaria-2024';

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Carregar usuário do armazenamento seguro
  const loadUser = useCallback(async () => {
    try {
      setIsLoading(true);
      
      // Verificar se existe dados do usuário
      if (secureStorage.hasItem('pastaSeguraUser')) {
        const userData = await secureStorage.getItem('pastaSeguraUser', MASTER_KEY);
        if (userData) {
          setUser(userData);
        }
      }
    } catch (error) {
      console.error('Erro ao carregar usuário:', error);
      // Se houver erro na descriptografia, limpar dados corrompidos
      secureStorage.removeItem('pastaSeguraUser');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Registrar novo usuário
  const register = useCallback(async (userData) => {
    try {
      setIsLoading(true);

      // Validar dados de entrada
      const validation = validateRegistrationData(userData);
      if (!validation.isValid) {
        throw new Error(validation.errors.join(', '));
      }

      // Hash das senhas
      const normalPasswordHash = await passwordUtils.simpleHash(userData.normalPassword);
      const securityPasswordHash = await passwordUtils.simpleHash(userData.securityPassword);

      // Preparar dados seguros para armazenamento
      const secureUserData = {
        id: generateUserId(),
        name: securityValidators.sanitizeInput(userData.name),
        email: securityValidators.sanitizeInput(userData.email.toLowerCase()),
        normalPasswordHash,
        securityPasswordHash,
        emergencyContact1: {
          name: securityValidators.sanitizeInput(userData.emergencyContact1.name),
          phone: userData.emergencyContact1.phone
        },
        emergencyContact2: {
          name: securityValidators.sanitizeInput(userData.emergencyContact2.name),
          phone: userData.emergencyContact2.phone
        },
        emergencyContact3: {
          name: securityValidators.sanitizeInput(userData.emergencyContact3.name),
          phone: userData.emergencyContact3.phone
        },
        registeredAt: new Date().toISOString(),
        lastLogin: null
      };

      // Salvar dados criptografados
      const success = await secureStorage.setItem('pastaSeguraUser', secureUserData, MASTER_KEY);
      
      if (!success) {
        throw new Error('Falha ao salvar dados do usuário');
      }

      setUser(secureUserData);
      return { success: true };

    } catch (error) {
      console.error('Erro no registro:', error);
      return { 
        success: false, 
        error: error.message || 'Erro interno no registro' 
      };
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fazer login
  const login = useCallback(async (password) => {
    try {
      setIsLoading(true);

      if (!user) {
        throw new Error('Usuário não encontrado');
      }

      // Verificar senha normal
      const isNormalPassword = await passwordUtils.verifySimpleHash(password, user.normalPasswordHash);
      
      // Verificar senha de emergência
      const isEmergencyPassword = await passwordUtils.verifySimpleHash(password, user.securityPasswordHash);

      if (!isNormalPassword && !isEmergencyPassword) {
        throw new Error('Senha incorreta');
      }

      // Atualizar último login
      const updatedUser = {
        ...user,
        lastLogin: new Date().toISOString()
      };

      await secureStorage.setItem('pastaSeguraUser', updatedUser, MASTER_KEY);
      setUser(updatedUser);
      setIsAuthenticated(true);

      return {
        success: true,
        loginType: isEmergencyPassword ? 'emergency' : 'normal'
      };

    } catch (error) {
      console.error('Erro no login:', error);
      return {
        success: false,
        error: error.message || 'Erro interno no login'
      };
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  // Fazer logout
  const logout = useCallback(() => {
    setIsAuthenticated(false);
  }, []);

  // Deletar conta
  const deleteAccount = useCallback(async () => {
    try {
      secureStorage.removeItem('pastaSeguraUser');
      secureStorage.removeItem('bankApps');
      setUser(null);
      setIsAuthenticated(false);
      return { success: true };
    } catch (error) {
      console.error('Erro ao deletar conta:', error);
      return { 
        success: false, 
        error: 'Erro ao deletar conta' 
      };
    }
  }, []);

  // Atualizar dados do usuário
  const updateUser = useCallback(async (updates) => {
    try {
      if (!user) {
        throw new Error('Usuário não encontrado');
      }

      const updatedUser = {
        ...user,
        ...updates,
        updatedAt: new Date().toISOString()
      };

      const success = await secureStorage.setItem('pastaSeguraUser', updatedUser, MASTER_KEY);
      
      if (!success) {
        throw new Error('Falha ao atualizar dados');
      }

      setUser(updatedUser);
      return { success: true };

    } catch (error) {
      console.error('Erro ao atualizar usuário:', error);
      return {
        success: false,
        error: error.message || 'Erro ao atualizar dados'
      };
    }
  }, [user]);

  // Carregar usuário na inicialização
  useEffect(() => {
    loadUser();
  }, [loadUser]);

  return {
    user,
    isLoading,
    isAuthenticated,
    register,
    login,
    logout,
    deleteAccount,
    updateUser,
    reloadUser: loadUser
  };
};

// Funções auxiliares
function generateUserId() {
  return 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

function validateRegistrationData(data) {
  const errors = [];

  // Validar nome
  if (!data.name || data.name.trim().length < 2) {
    errors.push('Nome deve ter pelo menos 2 caracteres');
  }

  // Validar email
  if (!securityValidators.validateEmail(data.email)) {
    errors.push('Email inválido');
  }

  // Validar senhas
  const normalPasswordValidation = securityValidators.validatePasswordStrength(data.normalPassword);
  if (!normalPasswordValidation.isValid) {
    errors.push(...normalPasswordValidation.errors.map(e => `Senha normal: ${e}`));
  }

  const securityPasswordValidation = securityValidators.validatePasswordStrength(data.securityPassword);
  if (!securityPasswordValidation.isValid) {
    errors.push(...securityPasswordValidation.errors.map(e => `Senha de emergência: ${e}`));
  }

  // Validar se senhas são diferentes
  if (!securityValidators.validatePasswordsDifferent(data.normalPassword, data.securityPassword)) {
    errors.push('As senhas devem ser diferentes');
  }

  // Validar contatos de emergência
  for (let i = 1; i <= 3; i++) {
    const contact = data[`emergencyContact${i}`];
    if (!contact.name || contact.name.trim().length < 2) {
      errors.push(`Nome do contato ${i} é obrigatório`);
    }
    if (!securityValidators.validatePhoneNumber(contact.phone)) {
      errors.push(`Telefone do contato ${i} inválido`);
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

export default useAuth;

