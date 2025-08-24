// Utilitário para protocolo de emergência e geolocalização

class EmergencyProtocol {
  constructor() {
    this.isActive = false;
    this.lastActivation = null;
    this.locationOptions = {
      enableHighAccuracy: true,
      timeout: 15000,
      maximumAge: 0
    };
  }

  // Ativar protocolo de emergência
  async activate(userData) {
    try {
      console.log('🚨 Ativando protocolo de emergência...');
      this.isActive = true;
      this.lastActivation = new Date();

      // Obter localização
      const location = await this.getCurrentLocation();
      
      // Preparar e enviar mensagens
      await this.sendEmergencyMessages(userData, location);
      
      // Registrar ativação
      this.logEmergencyActivation(userData, location);

      return {
        success: true,
        location,
        timestamp: this.lastActivation
      };

    } catch (error) {
      console.error('Erro no protocolo de emergência:', error);
      
      // Tentar enviar mensagem sem localização
      await this.sendEmergencyMessages(userData, null);
      
      return {
        success: false,
        error: error.message,
        timestamp: this.lastActivation
      };
    }
  }

  // Obter localização atual
  async getCurrentLocation() {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocalização não suportada pelo navegador'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude, accuracy } = position.coords;
          
          resolve({
            latitude,
            longitude,
            accuracy,
            timestamp: new Date(position.timestamp),
            googleMapsUrl: `https://maps.google.com/maps?q=${latitude},${longitude}`,
            wazeUrl: `https://waze.com/ul?ll=${latitude},${longitude}`,
            coordinates: `${latitude}, ${longitude}`
          });
        },
        (error) => {
          let errorMessage = 'Erro ao obter localização';
          
          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = 'Permissão de localização negada';
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage = 'Localização indisponível';
              break;
            case error.TIMEOUT:
              errorMessage = 'Timeout ao obter localização';
              break;
          }
          
          reject(new Error(errorMessage));
        },
        this.locationOptions
      );
    });
  }

  // Enviar mensagens de emergência via WhatsApp
  async sendEmergencyMessages(userData, location) {
    if (!userData) {
      throw new Error('Dados do usuário não encontrados');
    }

    const messages = this.prepareEmergencyMessages(userData, location);
    const results = [];

    // Enviar para cada contato de emergência
    for (let i = 1; i <= 3; i++) {
      const contact = userData[`emergencyContact${i}`];
      
      if (contact && contact.phone && contact.name) {
        try {
          const result = await this.sendWhatsAppMessage(contact, messages.whatsapp);
          results.push({
            contact: contact.name,
            phone: contact.phone,
            success: result.success,
            error: result.error
          });
          
          // Delay entre envios para evitar spam
          await this.delay(1500);
          
        } catch (error) {
          console.error(`Erro ao enviar para ${contact.name}:`, error);
          results.push({
            contact: contact.name,
            phone: contact.phone,
            success: false,
            error: error.message
          });
        }
      }
    }

    return results;
  }

  // Preparar mensagens de emergência
  prepareEmergencyMessages(userData, location) {
    const timestamp = new Date().toLocaleString('pt-BR', {
      timeZone: 'America/Sao_Paulo',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });

    const userName = userData.name.split(' ')[0];
    
    let locationText = '';
    if (location) {
      locationText = `\n\n📍 *Localização:*\n${location.coordinates}\n\n🗺️ *Ver no Google Maps:*\n${location.googleMapsUrl}\n\n🚗 *Abrir no Waze:*\n${location.wazeUrl}`;
    } else {
      locationText = '\n\n⚠️ *Localização não disponível*\nNão foi possível obter a localização automática.';
    }

    const whatsappMessage = `🚨 *ALERTA DE EMERGÊNCIA* 🚨

*${userName}* ativou o protocolo de emergência!

⚠️ *ESTOU EM PERIGO, AVISE A POLÍCIA*

🕐 *Horário:* ${timestamp}${locationText}

📱 *Mensagem enviada automaticamente pela Pasta Segura Bancária*

🚔 *LIGUE 190 IMEDIATAMENTE*`;

    return {
      whatsapp: whatsappMessage,
      sms: `EMERGÊNCIA: ${userName} está em perigo. Avise a polícia. ${location ? location.googleMapsUrl : 'Localização indisponível'}`,
      timestamp
    };
  }

  // Enviar mensagem via WhatsApp
  async sendWhatsAppMessage(contact, message) {
    try {
      // Formatar número para WhatsApp (remover formatação)
      const phoneNumber = contact.phone.replace(/\D/g, '');
      
      // Verificar se o número tem o formato correto
      if (phoneNumber.length < 10 || phoneNumber.length > 11) {
        throw new Error('Número de telefone inválido');
      }

      // Adicionar código do país (55 para Brasil)
      const fullNumber = phoneNumber.startsWith('55') ? phoneNumber : `55${phoneNumber}`;
      
      // Criar URL do WhatsApp
      const whatsappUrl = `https://wa.me/${fullNumber}?text=${encodeURIComponent(message)}`;
      
      // Abrir WhatsApp em nova aba
      const newWindow = window.open(whatsappUrl, '_blank');
      
      if (!newWindow) {
        throw new Error('Popup bloqueado. Permita popups para enviar mensagens de emergência.');
      }

      return {
        success: true,
        url: whatsappUrl,
        contact: contact.name
      };

    } catch (error) {
      console.error('Erro ao enviar WhatsApp:', error);
      return {
        success: false,
        error: error.message,
        contact: contact.name
      };
    }
  }

  // Registrar ativação de emergência
  logEmergencyActivation(userData, location) {
    try {
      const logEntry = {
        userId: userData.id,
        userName: userData.name,
        timestamp: new Date().toISOString(),
        location: location ? {
          coordinates: location.coordinates,
          accuracy: location.accuracy,
          googleMapsUrl: location.googleMapsUrl
        } : null,
        contacts: [
          userData.emergencyContact1,
          userData.emergencyContact2,
          userData.emergencyContact3
        ].filter(contact => contact.name && contact.phone)
      };

      // Salvar no localStorage para histórico
      const existingLogs = JSON.parse(localStorage.getItem('emergencyLogs') || '[]');
      existingLogs.push(logEntry);
      
      // Manter apenas os últimos 10 registros
      if (existingLogs.length > 10) {
        existingLogs.splice(0, existingLogs.length - 10);
      }
      
      localStorage.setItem('emergencyLogs', JSON.stringify(existingLogs));
      
      console.log('📝 Ativação de emergência registrada:', logEntry);
      
    } catch (error) {
      console.error('Erro ao registrar ativação:', error);
    }
  }

  // Verificar se protocolo está ativo
  isProtocolActive() {
    return this.isActive;
  }

  // Desativar protocolo
  deactivate() {
    this.isActive = false;
    console.log('✅ Protocolo de emergência desativado');
  }

  // Obter histórico de ativações
  getEmergencyHistory() {
    try {
      return JSON.parse(localStorage.getItem('emergencyLogs') || '[]');
    } catch (error) {
      console.error('Erro ao obter histórico:', error);
      return [];
    }
  }

  // Limpar histórico
  clearHistory() {
    localStorage.removeItem('emergencyLogs');
  }

  // Testar localização
  async testLocation() {
    try {
      const location = await this.getCurrentLocation();
      return {
        success: true,
        location,
        message: 'Localização obtida com sucesso'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: 'Erro ao obter localização'
      };
    }
  }

  // Delay helper
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Verificar suporte a geolocalização
  static isGeolocationSupported() {
    return 'geolocation' in navigator;
  }

  // Verificar permissões de localização
  static async checkLocationPermission() {
    if (!navigator.permissions) {
      return 'unsupported';
    }

    try {
      const permission = await navigator.permissions.query({ name: 'geolocation' });
      return permission.state; // 'granted', 'denied', 'prompt'
    } catch (error) {
      return 'error';
    }
  }
}

// Instância singleton
const emergencyProtocol = new EmergencyProtocol();

// Hook para usar o protocolo de emergência
export const useEmergencyProtocol = () => {
  const activate = async (userData) => {
    return await emergencyProtocol.activate(userData);
  };

  const testLocation = async () => {
    return await emergencyProtocol.testLocation();
  };

  const getHistory = () => {
    return emergencyProtocol.getEmergencyHistory();
  };

  const clearHistory = () => {
    emergencyProtocol.clearHistory();
  };

  const isActive = () => {
    return emergencyProtocol.isProtocolActive();
  };

  const deactivate = () => {
    emergencyProtocol.deactivate();
  };

  return {
    activate,
    testLocation,
    getHistory,
    clearHistory,
    isActive,
    deactivate,
    isSupported: EmergencyProtocol.isGeolocationSupported(),
    checkPermission: EmergencyProtocol.checkLocationPermission
  };
};

export default emergencyProtocol;

