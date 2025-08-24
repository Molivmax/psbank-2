// Utilitário de criptografia para proteger dados sensíveis
class CryptoUtils {
  constructor() {
    this.algorithm = 'AES-GCM';
    this.keyLength = 256;
  }

  // Gerar chave de criptografia baseada em uma senha
  async generateKey(password) {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    
    return await crypto.subtle.importKey(
      'raw',
      hashBuffer,
      { name: this.algorithm },
      false,
      ['encrypt', 'decrypt']
    );
  }

  // Criptografar dados
  async encrypt(data, password) {
    try {
      const key = await this.generateKey(password);
      const encoder = new TextEncoder();
      const dataBuffer = encoder.encode(JSON.stringify(data));
      
      // Gerar IV (Initialization Vector) aleatório
      const iv = crypto.getRandomValues(new Uint8Array(12));
      
      const encryptedBuffer = await crypto.subtle.encrypt(
        {
          name: this.algorithm,
          iv: iv
        },
        key,
        dataBuffer
      );

      // Combinar IV + dados criptografados
      const combined = new Uint8Array(iv.length + encryptedBuffer.byteLength);
      combined.set(iv);
      combined.set(new Uint8Array(encryptedBuffer), iv.length);

      // Converter para base64 para armazenamento
      return btoa(String.fromCharCode(...combined));
    } catch (error) {
      console.error('Erro na criptografia:', error);
      throw new Error('Falha ao criptografar dados');
    }
  }

  // Descriptografar dados
  async decrypt(encryptedData, password) {
    try {
      const key = await this.generateKey(password);
      
      // Converter de base64
      const combined = new Uint8Array(
        atob(encryptedData).split('').map(char => char.charCodeAt(0))
      );

      // Separar IV dos dados criptografados
      const iv = combined.slice(0, 12);
      const encrypted = combined.slice(12);

      const decryptedBuffer = await crypto.subtle.decrypt(
        {
          name: this.algorithm,
          iv: iv
        },
        key,
        encrypted
      );

      const decoder = new TextDecoder();
      const decryptedText = decoder.decode(decryptedBuffer);
      
      return JSON.parse(decryptedText);
    } catch (error) {
      console.error('Erro na descriptografia:', error);
      throw new Error('Falha ao descriptografar dados');
    }
  }

  // Hash de senha para verificação
  async hashPassword(password) {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  // Verificar senha
  async verifyPassword(password, hash) {
    const passwordHash = await this.hashPassword(password);
    return passwordHash === hash;
  }

  // Gerar salt aleatório
  generateSalt() {
    const array = new Uint8Array(16);
    crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  }

  // Hash com salt
  async hashWithSalt(password, salt) {
    const encoder = new TextEncoder();
    const data = encoder.encode(password + salt);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }
}

// Instância singleton
const cryptoUtils = new CryptoUtils();

// Funções de conveniência para armazenamento seguro
export const secureStorage = {
  // Salvar dados criptografados no localStorage
  async setItem(key, data, password) {
    try {
      const encrypted = await cryptoUtils.encrypt(data, password);
      localStorage.setItem(key, encrypted);
      return true;
    } catch (error) {
      console.error('Erro ao salvar dados seguros:', error);
      return false;
    }
  },

  // Recuperar dados descriptografados do localStorage
  async getItem(key, password) {
    try {
      const encrypted = localStorage.getItem(key);
      if (!encrypted) return null;
      
      return await cryptoUtils.decrypt(encrypted, password);
    } catch (error) {
      console.error('Erro ao recuperar dados seguros:', error);
      return null;
    }
  },

  // Remover item do localStorage
  removeItem(key) {
    localStorage.removeItem(key);
  },

  // Verificar se item existe
  hasItem(key) {
    return localStorage.getItem(key) !== null;
  }
};

// Funções de hash para senhas
export const passwordUtils = {
  // Hash de senha com salt
  async hashPassword(password) {
    const salt = cryptoUtils.generateSalt();
    const hash = await cryptoUtils.hashWithSalt(password, salt);
    return { hash, salt };
  },

  // Verificar senha
  async verifyPassword(password, storedHash, storedSalt) {
    const hash = await cryptoUtils.hashWithSalt(password, storedSalt);
    return hash === storedHash;
  },

  // Hash simples (para compatibilidade)
  async simpleHash(password) {
    return await cryptoUtils.hashPassword(password);
  },

  // Verificar hash simples
  async verifySimpleHash(password, hash) {
    return await cryptoUtils.verifyPassword(password, hash);
  }
};

// Validadores de segurança
export const securityValidators = {
  // Validar força da senha
  validatePasswordStrength(password) {
    const errors = [];
    
    if (password.length < 4) {
      errors.push('Senha deve ter pelo menos 4 dígitos');
    }
    
    if (!/^\d+$/.test(password)) {
      errors.push('Senha deve conter apenas números');
    }
    
    if (password.length > 4) {
      errors.push('Senha deve ter exatamente 4 dígitos');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  },

  // Validar se senhas são diferentes
  validatePasswordsDifferent(password1, password2) {
    return password1 !== password2;
  },

  // Validar formato de telefone brasileiro
  validatePhoneNumber(phone) {
    const phoneRegex = /^\(\d{2}\)\s\d{4,5}-\d{4}$/;
    return phoneRegex.test(phone);
  },

  // Validar email
  validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  // Sanitizar entrada de texto
  sanitizeInput(input) {
    return input.trim().replace(/[<>]/g, '');
  }
};

export default cryptoUtils;

