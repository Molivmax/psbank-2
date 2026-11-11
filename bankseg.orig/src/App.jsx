import { useState, useEffect } from 'react';
import { Geolocation } from '@capacitor/geolocation';
import Register from './components/Register';
import Login from './components/Login';
import BankAppsFolder from './components/BankAppsFolder';
import './App.css';

function App() {
  const [currentView, setCurrentView] = useState('loading');
  const [isEmergencyMode, setIsEmergencyMode] = useState(false);
  const [userData, setUserData] = useState(null);

  const N8N_WEBHOOK_URL = 'https://jh23268419.app.n8n.cloud/webhook/banco-seguro-alerta';

  // Solicita permissão nativa de GPS na primeira utilização ou cadastro
  const solicitarPermissaoGPS = async () => {
    try {
      const status = await Geolocation.checkPermissions();
      if (status.location !== 'granted') {
        await Geolocation.requestPermissions();
      }
    } catch (err) {
      console.warn('Ambiente web ou permissão não suportada de imediato:', err);
    }
  };

  useEffect(() => {
    const storedUser = localStorage.getItem('pastaSeguraUser');
    if (storedUser) {
      setUserData(JSON.parse(storedUser));
      setCurrentView('login');
    } else {
      setCurrentView('register');
    }
    solicitarPermissaoGPS();
  }, []);

  // Bloqueio automático imediato ao ir para segundo plano (ao minimizar ou abrir um banco)
  useEffect(() => {
    const handleLockOnBackground = () => {
      if (document.hidden) {
        setIsEmergencyMode(false);
        const storedUser = localStorage.getItem('pastaSeguraUser');
        if (storedUser) {
          setCurrentView('login');
        }
      }
    };

    document.addEventListener('visibilitychange', handleLockOnBackground);
    window.addEventListener('blur', handleLockOnBackground);

    return () => {
      document.removeEventListener('visibilitychange', handleLockOnBackground);
      window.removeEventListener('blur', handleLockOnBackground);
    };
  }, []);

  const handleRegisterSuccess = () => {
    solicitarPermissaoGPS();
    const storedUser = localStorage.getItem('pastaSeguraUser');
    if (storedUser) {
      setUserData(JSON.parse(storedUser));
      setCurrentView('login');
    }
  };

  const enviarAlertaParaN8N = async (localizacao) => {
    try {
      const currentUser = JSON.parse(localStorage.getItem('pastaSeguraUser') || '{}');
      const contactosList = [];

      for (let i = 1; i <= 3; i++) {
        const contact = currentUser[`emergencyContact${i}`];
        if (contact && contact.phone) {
          contactosList.push({
            nome: contact.name || `Contato ${i}`,
            telefone: contact.phone.replace(/\D/g, '')
          });
        }
      }

      const payload = {
        tipo_evento: "SENHA_COACAO",
        usuario: currentUser.fullName || currentUser.name || "Usuário Pasta Segura",
        data_hora: new Date().toISOString(),
        localizacao: localizacao,
        contactos: contactosList
      };

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

      console.log('Alerta emitido ao n8n com sucesso.');
    } catch (error) {
      console.error('Falha de envio ao n8n:', error);
    }
  };

  const handleEmergencyActivated = async () => {
    const fallbackLocation = {
      latitude: -23.55052,
      longitude: -46.633308,
      link_maps: 'https://maps.google.com/maps?q=-23.55052,-46.633308'
    };

    try {
      const position = await Promise.race([
        Geolocation.getCurrentPosition({ enableHighAccuracy: true, timeout: 5000 }),
        new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout GPS')), 4000))
      ]);

      const { latitude, longitude } = position.coords;
      await enviarAlertaParaN8N({
        latitude,
        longitude,
        link_maps: `https://maps.google.com/maps?q=${latitude},${longitude}`
      });
    } catch {
      await enviarAlertaParaN8N(fallbackLocation);
    }
  };

  const handleLoginSuccess = (loginType) => {
    if (loginType === 'emergency') {
      setIsEmergencyMode(true);
      handleEmergencyActivated();
    } else {
      setIsEmergencyMode(false);
    }
    setCurrentView('folder');
  };

  const handleLogout = () => {
    setIsEmergencyMode(false);
    setCurrentView('login');
  };

  const handleResetApp = () => {
    if (confirm('Tem a certeza de que deseja apagar todos os dados?')) {
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
