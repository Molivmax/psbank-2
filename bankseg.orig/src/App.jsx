import { useState, useEffect } from 'react';
import Register from './components/Register';
import Login from './components/Login';
import BankAppsFolder from './components/BankAppsFolder';
import './App.css';

function App() {
  const [currentView, setCurrentView] = useState('loading');
  const [isEmergencyMode, setIsEmergencyMode] = useState(false);
  const [userData, setUserData] = useState(null);

  // Webhook de produção do n8n
  const N8N_WEBHOOK_URL = 'https://jh23268419.app.n8n.cloud/webhook/banco-seguro-alerta';

  useEffect(() => {
    const storedUser = localStorage.getItem('pastaSeguraUser');
    if (storedUser) {
      setUserData(JSON.parse(storedUser));
      setCurrentView('login');
    } else {
      setCurrentView('register');
    }
  }, []);

  const handleRegisterSuccess = () => {
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

  const enviarAlertaParaN8N = async (localizacao) => {
    try {
      const contactosList = [];
      if (userData) {
        for (let i = 1; i <= 3; i++) {
          const contact = userData[`emergencyContact${i}`];
          if (contact && contact.phone) {
            contactosList.push({
              nome: contact.name || `Contato ${i}`,
              telefone: contact.phone.replace(/\D/g, '')
            });
          }
        }
      }

      const payload = {
        tipo_evento: "SENHA_COACAO",
        usuario: userData?.fullName || userData?.name || "Usuário Pasta Segura",
        data_hora: new Date().toISOString(),
        localizacao: localizacao,
        contactos: contactosList
      };

      // Envio utilizando FormData/URLSearchParams para evitar preflight OPTIONS e bloqueio de CORS no Chrome
      const formData = new URLSearchParams();
      formData.append('data', JSON.stringify(payload));
      formData.append('tipo_evento', payload.tipo_evento);
      formData.append('usuario', payload.usuario);
      formData.append('localizacao_link', localizacao.link_maps || '');

      await fetch(N8N_WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
        },
        body: formData.toString()
      });

      console.log('Alerta de coação emitido ao n8n com sucesso.');
    } catch (error) {
      console.error('Erro de envio ao n8n:', error);
    }
  };

  const handleEmergencyActivated = async () => {
    const fallbackLocation = {
      latitude: -23.55052,
      longitude: -46.633308,
      link_maps: 'https://maps.google.com/maps?q=-23.55052,-46.633308'
    };

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          await enviarAlertaParaN8N({
            latitude,
            longitude,
            link_maps: `https://maps.google.com/maps?q=${latitude},${longitude}`
          });
        },
        async () => {
          await enviarAlertaParaN8N(fallbackLocation);
        },
        {
          enableHighAccuracy: false,
          timeout: 4000,
          maximumAge: 60000
        }
      );
    } else {
      await enviarAlertaParaN8N(fallbackLocation);
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