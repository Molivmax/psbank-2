// Utilitário para gerenciar apps bancários e deep links

// Base de dados de bancos brasileiros com deep links
export const BRAZILIAN_BANKS = [
  {
    id: 'itau',
    name: 'Itaú',
    fullName: 'Banco Itaú Unibanco S.A.',
    deepLink: 'itau://',
    webUrl: 'https://www.itau.com.br',
    icon: '🏦',
    color: '#FF6600',
    category: 'tradicional',
    description: 'Banco tradicional brasileiro'
  },
  {
    id: 'bradesco',
    name: 'Bradesco',
    fullName: 'Banco Bradesco S.A.',
    deepLink: 'bradesco://',
    webUrl: 'https://www.bradesco.com.br',
    icon: '🏛️',
    color: '#CC092F',
    category: 'tradicional',
    description: 'Banco tradicional brasileiro'
  },
  {
    id: 'banco_do_brasil',
    name: 'Banco do Brasil',
    fullName: 'Banco do Brasil S.A.',
    deepLink: 'bb://',
    alternativeDeepLinks: ['br.com.bb://'],
    webUrl: 'https://www.bb.com.br',
    icon: '🏦',
    color: '#FFFF00',
    category: 'tradicional',
    description: 'Banco público brasileiro'
  },
  {
    id: 'caixa',
    name: 'Caixa',
    fullName: 'Caixa Econômica Federal',
    deepLink: 'caixa://',
    webUrl: 'https://www.caixa.gov.br',
    icon: '🏛️',
    color: '#0066CC',
    category: 'tradicional',
    description: 'Banco público brasileiro'
  },
  {
    id: 'santander',
    name: 'Santander',
    fullName: 'Banco Santander Brasil S.A.',
    deepLink: 'santander://',
    webUrl: 'https://www.santander.com.br',
    icon: '🏦',
    color: '#EC0000',
    category: 'tradicional',
    description: 'Banco internacional'
  },
  {
    id: 'nubank',
    name: 'Nubank',
    fullName: 'Nu Pagamentos S.A.',
    deepLink: 'nubank://',
    webUrl: 'https://nubank.com.br',
    icon: '💜',
    color: '#8A05BE',
    category: 'digital',
    description: 'Banco digital brasileiro'
  },
  {
    id: 'inter',
    name: 'Inter',
    fullName: 'Banco Inter S.A.',
    deepLink: 'inter://',
    webUrl: 'https://www.bancointer.com.br',
    icon: '🧡',
    color: '#FF7A00',
    category: 'digital',
    description: 'Banco digital brasileiro'
  },
  {
    id: 'picpay',
    name: 'PicPay',
    fullName: 'PicPay Serviços S.A.',
    deepLink: 'picpay://',
    webUrl: 'https://picpay.com',
    icon: '💚',
    color: '#11C76F',
    category: 'fintech',
    description: 'Carteira digital e pagamentos'
  },
  {
    id: 'mercado_pago',
    name: 'Mercado Pago',
    fullName: 'Mercado Pago Brasil Ltda.',
    deepLink: 'mercadopago://',
    webUrl: 'https://www.mercadopago.com.br',
    icon: '💙',
    color: '#009EE3',
    category: 'fintech',
    description: 'Carteira digital e pagamentos'
  },
  {
    id: 'pagbank',
    name: 'PagBank',
    fullName: 'PagSeguro Digital Ltd.',
    deepLink: 'pagbank://',
    webUrl: 'https://pagseguro.uol.com.br',
    icon: '💛',
    color: '#FFCC00',
    category: 'fintech',
    description: 'Banco digital e pagamentos'
  },
  {
    id: 'original',
    name: 'Original',
    fullName: 'Banco Original S.A.',
    deepLink: 'original://',
    webUrl: 'https://www.original.com.br',
    icon: '🖤',
    color: '#000000',
    category: 'digital',
    description: 'Banco digital brasileiro'
  },
  {
    id: 'c6_bank',
    name: 'C6 Bank',
    fullName: 'Banco C6 S.A.',
    deepLink: 'c6bank://',
    webUrl: 'https://www.c6bank.com.br',
    icon: '⚫',
    color: '#000000',
    category: 'digital',
    description: 'Banco digital brasileiro'
  },
  {
    id: 'xp_investimentos',
    name: 'XP Investimentos',
    fullName: 'XP Investimentos CCTVM S.A.',
    deepLink: 'xp://',
    webUrl: 'https://www.xpi.com.br',
    icon: '📈',
    color: '#000000',
    category: 'investimentos',
    description: 'Corretora de investimentos'
  },
  {
    id: 'btg_pactual',
    name: 'BTG Pactual',
    fullName: 'Banco BTG Pactual S.A.',
    deepLink: 'btgpactual://',
    webUrl: 'https://www.btgpactual.com',
    icon: '💼',
    color: '#1B4B8C',
    category: 'investimentos',
    description: 'Banco de investimentos'
  },
  {
    id: 'rico',
    name: 'Rico',
    fullName: 'Rico Investimentos',
    deepLink: 'rico://',
    webUrl: 'https://www.rico.com.vc',
    icon: '💰',
    color: '#00A859',
    category: 'investimentos',
    description: 'Corretora de investimentos'
  },
  {
    id: 'will_bank',
    name: 'Will Bank',
    fullName: 'Will Financeira S.A.',
    deepLink: 'willbank://',
    webUrl: 'https://willbank.com.br',
    icon: '🌟',
    color: '#6B46C1',
    category: 'digital',
    description: 'Banco digital brasileiro'
  },
  {
    id: 'neon',
    name: 'Neon',
    fullName: 'Neon Pagamentos S.A.',
    deepLink: 'neon://',
    webUrl: 'https://neon.com.br',
    icon: '💎',
    color: '#00D4FF',
    category: 'digital',
    description: 'Banco digital brasileiro'
  },
  {
    id: 'next',
    name: 'Next',
    fullName: 'Next Bank',
    deepLink: 'next://',
    webUrl: 'https://www.next.me',
    icon: '🔮',
    color: '#7B2CBF',
    category: 'digital',
    description: 'Banco digital do Bradesco'
  },
  {
    id: 'digio',
    name: 'Digio',
    fullName: 'Digio S.A.',
    deepLink: 'digio://',
    webUrl: 'https://www.digio.com.br',
    icon: '💳',
    color: '#FF6B35',
    category: 'fintech',
    description: 'Cartão de crédito digital'
  },
  {
    id: 'stone',
    name: 'Stone',
    fullName: 'Stone Pagamentos S.A.',
    deepLink: 'stone://',
    webUrl: 'https://www.stone.com.br',
    icon: '🗿',
    color: '#00C851',
    category: 'fintech',
    description: 'Soluções de pagamento'
  }
];

class BankAppsManager {
  constructor() {
    this.storageKey = 'bankApps';
    this.userApps = this.loadUserApps();
  }

  // Carregar apps do usuário
  loadUserApps() {
    try {
      const stored = localStorage.getItem(this.storageKey);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Erro ao carregar apps bancários:', error);
      return [];
    }
  }

  // Salvar apps do usuário
  saveUserApps() {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.userApps));
      return true;
    } catch (error) {
      console.error('Erro ao salvar apps bancários:', error);
      return false;
    }
  }

  // Adicionar app bancário
  addBankApp(bankData) {
    const newApp = {
      id: bankData.id || `custom_${Date.now()}`,
      name: bankData.name,
      deepLink: bankData.deepLink,
      webUrl: bankData.webUrl || '',
      icon: bankData.icon || '🏦',
      color: bankData.color || '#1e90ff',
      category: bankData.category || 'custom',
      isCustom: !bankData.id || !BRAZILIAN_BANKS.find(b => b.id === bankData.id),
      addedAt: new Date().toISOString()
    };

    // Verificar se já existe
    const existingIndex = this.userApps.findIndex(app => app.id === newApp.id);
    
    if (existingIndex >= 0) {
      // Atualizar existente
      this.userApps[existingIndex] = { ...this.userApps[existingIndex], ...newApp };
    } else {
      // Adicionar novo
      this.userApps.push(newApp);
    }

    this.saveUserApps();
    return newApp;
  }

  // Remover app bancário
  removeBankApp(appId) {
    const initialLength = this.userApps.length;
    this.userApps = this.userApps.filter(app => app.id !== appId);
    
    if (this.userApps.length < initialLength) {
      this.saveUserApps();
      return true;
    }
    return false;
  }

  // Obter apps do usuário
  getUserApps() {
    return [...this.userApps];
  }

  // Obter bancos disponíveis (não adicionados pelo usuário)
  getAvailableBanks() {
    const userAppIds = this.userApps.map(app => app.id);
    return BRAZILIAN_BANKS.filter(bank => !userAppIds.includes(bank.id));
  }

  // Obter banco por ID
  getBankById(bankId) {
    return BRAZILIAN_BANKS.find(bank => bank.id === bankId);
  }

  // Buscar bancos
  searchBanks(query) {
    const searchTerm = query.toLowerCase();
    return BRAZILIAN_BANKS.filter(bank => 
      bank.name.toLowerCase().includes(searchTerm) ||
      bank.fullName.toLowerCase().includes(searchTerm) ||
      bank.category.toLowerCase().includes(searchTerm)
    );
  }

  // Obter bancos por categoria
  getBanksByCategory(category) {
    return BRAZILIAN_BANKS.filter(bank => bank.category === category);
  }

  // Abrir app bancário
  async openBankApp(app) {
    try {
      console.log(`Tentando abrir ${app.name} via deep link: ${app.deepLink}`);
      
      // Tentar abrir via deep link
      const success = await this.tryDeepLink(app.deepLink);
      
      if (!success && app.alternativeDeepLinks) {
        // Tentar deep links alternativos
        for (const altLink of app.alternativeDeepLinks) {
          const altSuccess = await this.tryDeepLink(altLink);
          if (altSuccess) return { success: true, method: 'alternative_deeplink' };
        }
      }

      if (!success) {
        // Fallback: abrir site do banco
        if (app.webUrl) {
          window.open(app.webUrl, '_blank');
          return { success: true, method: 'web_fallback' };
        } else {
          throw new Error('App não instalado e URL web não disponível');
        }
      }

      return { success: true, method: 'deeplink' };

    } catch (error) {
      console.error(`Erro ao abrir ${app.name}:`, error);
      return { 
        success: false, 
        error: error.message,
        suggestions: this.getOpeningSuggestions(app)
      };
    }
  }

  // Tentar abrir deep link
  async tryDeepLink(deepLink) {
    return new Promise((resolve) => {
      const startTime = Date.now();
      
      // Detectar se o app foi aberto (usuário saiu da página)
      const handleVisibilityChange = () => {
        if (document.hidden) {
          resolve(true);
          document.removeEventListener('visibilitychange', handleVisibilityChange);
        }
      };

      const handleBlur = () => {
        resolve(true);
        window.removeEventListener('blur', handleBlur);
        document.removeEventListener('visibilitychange', handleVisibilityChange);
      };

      // Adicionar listeners
      document.addEventListener('visibilitychange', handleVisibilityChange);
      window.addEventListener('blur', handleBlur);

      // Tentar abrir o deep link
      window.location.href = deepLink;

      // Timeout para detectar falha
      setTimeout(() => {
        const timeElapsed = Date.now() - startTime;
        
        // Se passou pouco tempo e ainda estamos na página, provavelmente falhou
        if (timeElapsed < 2000 && !document.hidden) {
          resolve(false);
        } else {
          resolve(true);
        }
        
        // Limpar listeners
        document.removeEventListener('visibilitychange', handleVisibilityChange);
        window.removeEventListener('blur', handleBlur);
      }, 2500);
    });
  }

  // Obter sugestões quando app não abre
  getOpeningSuggestions(app) {
    return [
      `Certifique-se de que o app ${app.name} está instalado no seu dispositivo`,
      'Verifique se o app está atualizado na loja de aplicativos',
      'Tente abrir o app manualmente primeiro',
      app.webUrl ? `Como alternativa, você pode acessar: ${app.webUrl}` : null
    ].filter(Boolean);
  }

  // Validar deep link personalizado
  validateCustomDeepLink(deepLink) {
    const errors = [];

    if (!deepLink) {
      errors.push('Deep link é obrigatório');
    } else {
      // Verificar formato básico
      if (!deepLink.includes('://')) {
        errors.push('Deep link deve conter "://" (ex: meubanco://)');
      }

      // Verificar se não é URL web comum
      if (deepLink.startsWith('http://') || deepLink.startsWith('https://')) {
        errors.push('Use URLs web no campo "Site do Banco", não no deep link');
      }

      // Verificar se já existe
      const existing = this.userApps.find(app => app.deepLink === deepLink);
      if (existing) {
        errors.push(`Deep link já usado pelo ${existing.name}`);
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  // Exportar configuração dos apps
  exportAppsConfig() {
    return {
      apps: this.userApps,
      exportedAt: new Date().toISOString(),
      version: '1.0'
    };
  }

  // Importar configuração dos apps
  importAppsConfig(config) {
    try {
      if (config.apps && Array.isArray(config.apps)) {
        this.userApps = config.apps;
        this.saveUserApps();
        return { success: true };
      } else {
        throw new Error('Formato de configuração inválido');
      }
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Limpar todos os apps
  clearAllApps() {
    this.userApps = [];
    this.saveUserApps();
  }

  // Obter estatísticas
  getStats() {
    const categories = {};
    this.userApps.forEach(app => {
      categories[app.category] = (categories[app.category] || 0) + 1;
    });

    return {
      totalApps: this.userApps.length,
      customApps: this.userApps.filter(app => app.isCustom).length,
      predefinedApps: this.userApps.filter(app => !app.isCustom).length,
      categories,
      lastAdded: this.userApps.length > 0 ? 
        Math.max(...this.userApps.map(app => new Date(app.addedAt).getTime())) : null
    };
  }
}

// Instância singleton
const bankAppsManager = new BankAppsManager();

// Hook para usar o gerenciador de apps bancários
export const useBankApps = () => {
  const addApp = (bankData) => {
    return bankAppsManager.addBankApp(bankData);
  };

  const removeApp = (appId) => {
    return bankAppsManager.removeBankApp(appId);
  };

  const getUserApps = () => {
    return bankAppsManager.getUserApps();
  };

  const getAvailableBanks = () => {
    return bankAppsManager.getAvailableBanks();
  };

  const openApp = async (app) => {
    return await bankAppsManager.openBankApp(app);
  };

  const searchBanks = (query) => {
    return bankAppsManager.searchBanks(query);
  };

  const validateDeepLink = (deepLink) => {
    return bankAppsManager.validateCustomDeepLink(deepLink);
  };

  const exportConfig = () => {
    return bankAppsManager.exportAppsConfig();
  };

  const importConfig = (config) => {
    return bankAppsManager.importAppsConfig(config);
  };

  const clearAll = () => {
    bankAppsManager.clearAllApps();
  };

  const getStats = () => {
    return bankAppsManager.getStats();
  };

  return {
    addApp,
    removeApp,
    getUserApps,
    getAvailableBanks,
    openApp,
    searchBanks,
    validateDeepLink,
    exportConfig,
    importConfig,
    clearAll,
    getStats,
    BANKS: BRAZILIAN_BANKS
  };
};

export default bankAppsManager;

