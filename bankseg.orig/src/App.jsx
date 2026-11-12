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

  const solicitarPermissaoGPS = async () => {
    try {
      const status = await Geolocation.checkPermissions();
      if (status.location !== 'granted') {
        await Geolocation.requestPermissions();
      }
    } catch (err) {
      console.warn('Erro ao checar permissão de GPS:', err);
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

  // Extrai os números limpos (DDD + número, sem o 55, pois o n8n já adiciona "55" na frente)
  const extrairContatosParaN8N = (user) => {
    const lista = [];
    const candidatos = [
      user?.emergencyContact1?.phone,
      user?.emergencyContact2?.phone,
      user?.emergencyContact3?.phone
    ];

    for (const tel of candidatos) {
      if (tel) {
        let limpo = tel.replace(/\D/g, '');
        if (limpo.startsWith('55') && limpo.length >= 12) {
          limpo = limpo.slice(2);
        }
        if (limpo.length >= 10) {
          lista.push(limpo);
        }
      }
    }
    return [...new Set(lista)];
  };

  const enviarAlertaParaN8N = async (linkMaps) => {
    try {
      const rawUser = localStorage.getItem('pastaSeguraUser') || '{}';
      const currentUser = JSON.parse(rawUser);
      const contactos = extrairContatosParaN8N(currentUser);

      // Envia exatamente no formato que o nó MegaAPI do seu n8n espera
      const payload = {
        usuario: currentUser.name || 'Usuário Pasta Segura',
        contactos: contactos,
        localizacao: linkMaps,
        data_hora: new Date().toISOString()
      };

      await fetch(N8N_WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });
    } catch (error) {
      console.error('Falha de envio ao n8n:', error);
    }
  };

  const handleEmergencyActivated = async () => {
    const fallbackLink = 'https://maps.google.com/maps?q=-23.55052,-46.633308';

    try {
      const position = await Promise.race([
        Geolocation.getCurrentPosition({ enableHighAccuracy: true, timeout: 4000 }),
        new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout GPS')), 3500))
      ]);

      const { latitude, longitude } = position.coords;
      await enviarAlertaParaN8N(`https://maps.google.com/maps?q=${latitude},${longitude}`);
    } catch {
      await enviarAlertaParaN8N(fallbackLink);
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
    </div>
  );
}

export default App;
