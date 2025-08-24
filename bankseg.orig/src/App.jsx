import { useState, useEffect } from 'react';
import Register from './components/Register';
import Login from './components/Login';
import BankAppsFolder from './components/BankAppsFolder';
import './App.css';

function App() {
  const [currentView, setCurrentView] = useState('loading');
  const [isEmergencyMode, setIsEmergencyMode] = useState(false);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    // Verificar se usuário já está cadastrado
    const storedUser = localStorage.getItem('pastaSeguraUser');
    if (storedUser) {
      setUserData(JSON.parse(storedUser));
      setCurrentView('login');
    } else {
      setCurrentView('register');
    }
  }, []);

  const handleRegisterSuccess = () => {
    // Recarregar dados do usuário após cadastro
    const storedUser = localStorage.getItem('pastaSeguraUser');
    if (storedUser) {
      setUserData(JSON.parse(storedUser));
      setCurrentView('login');
    }
  };

  const handleLoginSuccess = (loginType) => {
    if (loginType === 'emergency') {
      setIsEmergencyMode(true);
    }
    setCurrentView('folder');
  };

  const handleEmergencyActivated = async () => {
    try {
      // Obter localização do usuário
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const { latitude, longitude } = position.coords;
            const locationUrl = `https://maps.google.com/maps?q=${latitude},${longitude}`;
            
            // Preparar mensagem de emergência
            const emergencyMessage = `🚨 EMERGÊNCIA 🚨\n\nEstou em perigo, avise a polícia. Esta é minha localização:\n\n${locationUrl}\n\nMensagem enviada automaticamente pela Pasta Segura Bancária às ${new Date().toLocaleString('pt-BR')}`;
            
            // Enviar para contatos de emergência via WhatsApp
            if (userData) {
              for (let i = 1; i <= 3; i++) {
                const contact = userData[`emergencyContact${i}`];
                if (contact && contact.phone) {
                  // Formatar número para WhatsApp (remover formatação)
                  const phoneNumber = contact.phone.replace(/\D/g, '');
                  const whatsappUrl = `https://wa.me/55${phoneNumber}?text=${encodeURIComponent(emergencyMessage)}`;
                  
                  // Abrir WhatsApp em nova aba
                  window.open(whatsappUrl, '_blank');
                  
                  // Delay entre envios para não sobrecarregar
                  await new Promise(resolve => setTimeout(resolve, 1000));
                }
              }
            }
          },
          (error) => {
            console.error('Erro ao obter localização:', error);
            // Enviar mensagem sem localização específica
            const emergencyMessage = `🚨 EMERGÊNCIA 🚨\n\nEstou em perigo, avise a polícia.\n\nNão foi possível obter localização automática.\n\nMensagem enviada automaticamente pela Pasta Segura Bancária às ${new Date().toLocaleString('pt-BR')}`;
            
            if (userData) {
              for (let i = 1; i <= 3; i++) {
                const contact = userData[`emergencyContact${i}`];
                if (contact && contact.phone) {
                  const phoneNumber = contact.phone.replace(/\D/g, '');
                  const whatsappUrl = `https://wa.me/55${phoneNumber}?text=${encodeURIComponent(emergencyMessage)}`;
                  window.open(whatsappUrl, '_blank');
                }
              }
            }
          },
          {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0
          }
        );
      }
    } catch (error) {
      console.error('Erro no protocolo de emergência:', error);
    }
  };

  const handleLogout = () => {
    setIsEmergencyMode(false);
    setCurrentView('login');
  };

  const handleResetApp = () => {
    if (confirm('Tem certeza que deseja apagar todos os dados? Esta ação não pode ser desfeita.')) {
      localStorage.removeItem('pastaSeguraUser');
      localStorage.removeItem('bankApps');
      setUserData(null);
      setIsEmergencyMode(false);
      setCurrentView('register');
    }
  };

  if (currentView === 'loading') {
    return (
      <div className="app-container flex items-center justify-center">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <div className="app-container">
      {currentView === 'register' && (
        <Register onRegisterSuccess={handleRegisterSuccess} />
      )}
      
      {currentView === 'login' && (
        <Login 
          onLoginSuccess={handleLoginSuccess}
          onEmergencyActivated={handleEmergencyActivated}
        />
      )}
      
      {currentView === 'folder' && (
        <BankAppsFolder 
          isEmergencyMode={isEmergencyMode}
          onLogout={handleLogout}
        />
      )}

      {/* Botão de reset (apenas em desenvolvimento) */}
      {process.env.NODE_ENV === 'development' && (
        <button
          onClick={handleResetApp}
          style={{
            position: 'fixed',
            bottom: '10px',
            left: '10px',
            background: '#ff4444',
            color: 'white',
            border: 'none',
            padding: '8px 12px',
            borderRadius: '4px',
            fontSize: '12px',
            cursor: 'pointer',
            zIndex: 1000
          }}
        >
          Reset App
        </button>
      )}
    </div>
  );
}

export default App;
