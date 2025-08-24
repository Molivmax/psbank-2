import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Shield, 
  Plus, 
  LogOut, 
  Settings, 
  Smartphone, 
  ExternalLink,
  AlertTriangle,
  MapPin,
  Clock
} from 'lucide-react';

const BankAppsFolder = ({ isEmergencyMode, onLogout }) => {
  const [bankApps, setBankApps] = useState([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newApp, setNewApp] = useState({ name: '', deepLink: '', icon: '' });
  const [userData, setUserData] = useState(null);

  // Lista de bancos pré-definidos com deep links
  const predefinedBanks = [
    { name: 'Itaú', deepLink: 'itau://', icon: '🏦', color: '#FF6600' },
    { name: 'Bradesco', deepLink: 'bradesco://', icon: '🏛️', color: '#CC092F' },
    { name: 'Banco do Brasil', deepLink: 'bb://', icon: '🏦', color: '#FFFF00' },
    { name: 'Caixa', deepLink: 'caixa://', icon: '🏛️', color: '#0066CC' },
    { name: 'Santander', deepLink: 'santander://', icon: '🏦', color: '#EC0000' },
    { name: 'Nubank', deepLink: 'nubank://', icon: '💜', color: '#8A05BE' },
    { name: 'Inter', deepLink: 'inter://', icon: '🧡', color: '#FF7A00' },
    { name: 'PicPay', deepLink: 'picpay://', icon: '💚', color: '#11C76F' },
    { name: 'Mercado Pago', deepLink: 'mercadopago://', icon: '💙', color: '#009EE3' },
    { name: 'PagBank', deepLink: 'pagbank://', icon: '💛', color: '#FFCC00' },
    { name: 'Original', deepLink: 'original://', icon: '🖤', color: '#000000' },
    { name: 'C6 Bank', deepLink: 'c6bank://', icon: '⚫', color: '#000000' },
    { name: 'XP Investimentos', deepLink: 'xp://', icon: '📈', color: '#000000' }
  ];

  useEffect(() => {
    // Carregar dados do usuário
    const storedUser = localStorage.getItem('pastaSeguraUser');
    if (storedUser) {
      setUserData(JSON.parse(storedUser));
    }

    // Carregar apps bancários salvos
    const storedApps = localStorage.getItem('bankApps');
    if (storedApps) {
      setBankApps(JSON.parse(storedApps));
    }
  }, []);

  const saveBankApps = (apps) => {
    localStorage.setItem('bankApps', JSON.stringify(apps));
    setBankApps(apps);
  };

  const handleAddPredefinedBank = (bank) => {
    const newApps = [...bankApps, { ...bank, id: Date.now() }];
    saveBankApps(newApps);
    setIsAddDialogOpen(false);
  };

  const handleAddCustomApp = () => {
    if (!newApp.name || !newApp.deepLink) return;

    const customApp = {
      id: Date.now(),
      name: newApp.name,
      deepLink: newApp.deepLink,
      icon: newApp.icon || '🏦',
      color: '#1e90ff',
      isCustom: true
    };

    const newApps = [...bankApps, customApp];
    saveBankApps(newApps);
    setNewApp({ name: '', deepLink: '', icon: '' });
    setIsAddDialogOpen(false);
  };

  const handleRemoveApp = (appId) => {
    const newApps = bankApps.filter(app => app.id !== appId);
    saveBankApps(newApps);
  };

  const handleOpenApp = (app) => {
    try {
      // Tentar abrir o app nativo via deep link
      window.location.href = app.deepLink;
      
      // Fallback: se não conseguir abrir o app nativo, mostrar mensagem
      setTimeout(() => {
        const userConfirm = confirm(
          `Não foi possível abrir o app ${app.name} automaticamente. ` +
          `Certifique-se de que o app está instalado no seu dispositivo. ` +
          `Deseja tentar novamente?`
        );
        
        if (userConfirm) {
          window.location.href = app.deepLink;
        }
      }, 2000);
    } catch (error) {
      console.error('Erro ao abrir app:', error);
      alert(`Erro ao abrir ${app.name}. Verifique se o app está instalado.`);
    }
  };

  const formatTime = (date) => {
    return new Intl.DateTimeFormat('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    }).format(date);
  };

  return (
    <div className="app-container min-h-screen p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Shield className="w-8 h-8 text-primary" />
          <div>
            <h1 className="text-xl font-bold">Pasta Segura</h1>
            <p className="text-sm text-muted-foreground">
              {userData?.name.split(' ')[0]} • {bankApps.length} apps
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {isEmergencyMode && (
            <div className="emergency-indicator flex items-center gap-1">
              <AlertTriangle className="w-4 h-4" />
              <span>Modo Emergência</span>
            </div>
          )}
          <Button variant="outline" size="sm" onClick={onLogout}>
            <LogOut className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Status de Emergência */}
      {isEmergencyMode && (
        <Card className="mb-6 border-destructive bg-destructive/10">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-destructive mt-0.5" />
              <div className="flex-1">
                <h3 className="font-semibold text-destructive">Protocolo de Emergência Ativado</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Sua localização foi enviada para os contatos de emergência às {formatTime(new Date())}
                </p>
                <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    <span>Localização enviada</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>Contatos notificados</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Grid de Apps Bancários */}
      <div className="bank-app-grid">
        {bankApps.map((app) => (
          <div key={app.id} className="relative group">
            <div
              className="bank-app-icon"
              style={{ background: `linear-gradient(135deg, ${app.color}, ${app.color}dd)` }}
              onClick={() => handleOpenApp(app)}
            >
              <span className="text-2xl">{app.icon}</span>
            </div>
            <p className="text-xs text-center mt-2 text-muted-foreground truncate">
              {app.name}
            </p>
            
            {/* Botão de remover (aparece no hover) */}
            <Button
              variant="destructive"
              size="sm"
              className="absolute -top-2 -right-2 w-6 h-6 rounded-full p-0 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={(e) => {
                e.stopPropagation();
                handleRemoveApp(app.id);
              }}
            >
              ×
            </Button>
          </div>
        ))}

        {/* Botão Adicionar App */}
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <div className="bank-app-icon bg-muted border-2 border-dashed border-border hover:border-primary">
              <Plus className="w-8 h-8 text-muted-foreground" />
            </div>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Adicionar App Bancário</DialogTitle>
              <DialogDescription>
                Escolha um banco da lista ou adicione um app personalizado
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              {/* Bancos Pré-definidos */}
              <div>
                <Label className="text-sm font-medium">Bancos Populares</Label>
                <div className="grid grid-cols-3 gap-2 mt-2">
                  {predefinedBanks
                    .filter(bank => !bankApps.some(app => app.name === bank.name))
                    .slice(0, 9)
                    .map((bank) => (
                    <Button
                      key={bank.name}
                      variant="outline"
                      className="h-auto p-2 flex flex-col gap-1"
                      onClick={() => handleAddPredefinedBank(bank)}
                    >
                      <span className="text-lg">{bank.icon}</span>
                      <span className="text-xs">{bank.name}</span>
                    </Button>
                  ))}
                </div>
              </div>

              {/* App Personalizado */}
              <div className="border-t pt-4">
                <Label className="text-sm font-medium">App Personalizado</Label>
                <div className="space-y-3 mt-2">
                  <div>
                    <Label htmlFor="appName" className="text-xs">Nome do App</Label>
                    <Input
                      id="appName"
                      value={newApp.name}
                      onChange={(e) => setNewApp(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Ex: Meu Banco"
                    />
                  </div>
                  <div>
                    <Label htmlFor="deepLink" className="text-xs">Deep Link</Label>
                    <Input
                      id="deepLink"
                      value={newApp.deepLink}
                      onChange={(e) => setNewApp(prev => ({ ...prev, deepLink: e.target.value }))}
                      placeholder="Ex: meubanco://"
                    />
                  </div>
                  <div>
                    <Label htmlFor="icon" className="text-xs">Ícone (emoji)</Label>
                    <Input
                      id="icon"
                      value={newApp.icon}
                      onChange={(e) => setNewApp(prev => ({ ...prev, icon: e.target.value }))}
                      placeholder="🏦"
                      maxLength="2"
                    />
                  </div>
                  <Button 
                    onClick={handleAddCustomApp}
                    disabled={!newApp.name || !newApp.deepLink}
                    className="w-full"
                  >
                    Adicionar App
                  </Button>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Mensagem quando não há apps */}
      {bankApps.length === 0 && (
        <Card className="mt-8">
          <CardContent className="p-6 text-center">
            <Smartphone className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">Nenhum app bancário adicionado</h3>
            <p className="text-muted-foreground mb-4">
              Adicione seus apps bancários para acessá-los de forma segura
            </p>
            <Button onClick={() => setIsAddDialogOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Adicionar Primeiro App
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Informações de Uso */}
      <Card className="mt-6">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <ExternalLink className="w-5 h-5 text-primary mt-0.5" />
            <div>
              <h4 className="font-medium">Como funciona</h4>
              <p className="text-sm text-muted-foreground mt-1">
                Toque no ícone de qualquer banco para abrir o app nativo instalado no seu dispositivo. 
                Os apps são abertos diretamente, mantendo toda a segurança original.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BankAppsFolder;

