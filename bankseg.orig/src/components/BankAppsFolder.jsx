import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LogOut, ExternalLink, ShieldCheck } from 'lucide-react';
import { AppLauncher } from '@capacitor/app-launcher';

const BankAppsFolder = ({ isEmergencyMode, onLogout }) => {
  const [bankApps, setBankApps] = useState([]);

  const defaultBanks = [
    { id: 'bb', name: 'Banco do Brasil', pkg: 'br.com.bb.android', url: 'android-app://br.com.bb.android' },
    { id: 'itau', name: 'Itaú', pkg: 'com.itau', url: 'android-app://com.itau' },
    { id: 'bradesco', name: 'Bradesco', pkg: 'com.bradesco', url: 'android-app://com.bradesco' },
    { id: 'santander', name: 'Santander', pkg: 'com.santander.app', url: 'android-app://com.santander.app' },
    { id: 'caixa', name: 'Caixa', pkg: 'br.com.gabba.Caixa', url: 'android-app://br.com.gabba.Caixa' },
    { id: 'nubank', name: 'Nubank', pkg: 'com.nu.production', url: 'android-app://com.nu.production' },
    { id: 'inter', name: 'Inter', pkg: 'br.com.intermedium', url: 'android-app://br.com.intermedium' }
  ];

  useEffect(() => {
    const saved = localStorage.getItem('bankApps');
    if (saved) {
      try {
        setBankApps(JSON.parse(saved));
      } catch {
        setBankApps(defaultBanks);
      }
    } else {
      setBankApps(defaultBanks);
    }
  }, []);

  const abrirAplicativo = async (app) => {
    try {
      if (app.pkg) {
        const canOpen = await AppLauncher.canOpenUrl({ url: app.pkg });
        if (canOpen.value) {
          await AppLauncher.openUrl({ url: app.pkg });
          return;
        }
      }
      if (app.url) {
        window.location.href = app.url;
      }
    } catch {
      if (app.url) {
        window.location.href = app.url;
      }
    }
  };

  return (
    <div className="app-container p-4 max-w-md mx-auto min-h-screen flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-6 pt-2">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-7 h-7 text-primary" />
            <h1 className="text-xl font-bold">Pasta Segura</h1>
          </div>
          <Button variant="ghost" size="icon" onClick={onLogout} title="Bloquear pasta">
            <LogOut className="w-5 h-5 text-muted-foreground" />
          </Button>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {bankApps.map((app) => (
            <Card
              key={app.id || app.name}
              className="cursor-pointer hover:border-primary transition-all active:scale-95 shadow-sm"
              onClick={() => abrirAplicativo(app)}
            >
              <CardContent className="p-4 flex flex-col items-center justify-center text-center gap-2 min-h-[105px]">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-bold text-lg">
                  {app.name.charAt(0)}
                </div>
                <span className="text-xs font-medium text-foreground line-clamp-1">{app.name}</span>
                <ExternalLink className="w-3.5 h-3.5 text-muted-foreground" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div className="text-center py-4">
        <p className="text-[11px] text-muted-foreground">Ambiente Seguro Criptografado</p>
      </div>
    </div>
  );
};

export default BankAppsFolder;
