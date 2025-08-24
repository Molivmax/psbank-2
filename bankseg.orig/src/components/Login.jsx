import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Lock, AlertTriangle, Eye, EyeOff } from 'lucide-react';

const Login = ({ onLoginSuccess, onEmergencyActivated }) => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    // Carregar dados do usuário do localStorage
    const storedUser = localStorage.getItem('pastaSeguraUser');
    if (storedUser) {
      setUserData(JSON.parse(storedUser));
    }
  }, []);

  const handlePasswordChange = (value) => {
    // Permitir apenas números e limitar a 4 dígitos
    const numericValue = value.replace(/\D/g, '').slice(0, 4);
    setPassword(numericValue);
    
    // Limpar erro quando usuário começar a digitar
    if (error) {
      setError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!password || password.length !== 4) {
      setError('Digite uma senha de 4 dígitos');
      return;
    }

    if (!userData) {
      setError('Usuário não encontrado. Faça o cadastro primeiro.');
      return;
    }

    setIsLoading(true);
    
    try {
      // Simular delay de autenticação
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Verificar se é senha normal ou de emergência
      if (password === userData.normalPassword) {
        // Login normal
        onLoginSuccess('normal');
      } else if (password === userData.securityPassword) {
        // Login de emergência - ativar protocolo de segurança
        onEmergencyActivated();
        onLoginSuccess('emergency');
      } else {
        setError('Senha incorreta');
      }
    } catch (error) {
      console.error('Erro no login:', error);
      setError('Erro interno. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    // Permitir apenas números
    if (!/[0-9]/.test(e.key) && !['Backspace', 'Delete', 'Tab', 'Enter'].includes(e.key)) {
      e.preventDefault();
    }
  };

  if (!userData) {
    return (
      <div className="app-container flex items-center justify-center p-4">
        <Card className="form-container w-full max-w-md">
          <CardHeader className="text-center">
            <div className="logo-container">
              <Shield className="w-16 h-16 mx-auto mb-4 text-primary" />
              <CardTitle className="logo-text text-2xl">Pasta Segura Bancária</CardTitle>
            </div>
            <CardDescription className="text-muted-foreground">
              Nenhum usuário cadastrado encontrado
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-center text-muted-foreground mb-4">
              Você precisa fazer o cadastro primeiro para acessar a pasta segura.
            </p>
            <Button 
              onClick={() => window.location.reload()} 
              className="w-full"
            >
              Fazer Cadastro
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="app-container flex items-center justify-center p-4">
      <Card className="form-container w-full max-w-md">
        <CardHeader className="text-center">
          <div className="logo-container">
            <Shield className="w-16 h-16 mx-auto mb-4 text-primary" />
            <CardTitle className="logo-text text-2xl">Pasta Segura Bancária</CardTitle>
          </div>
          <CardDescription className="text-muted-foreground">
            Olá, {userData.name.split(' ')[0]}! Digite sua senha para acessar
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="password" className="flex items-center gap-2 justify-center">
                <Lock className="w-4 h-4" />
                Senha de Acesso
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => handlePasswordChange(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className={`security-input text-center ${error ? 'border-destructive' : ''}`}
                  placeholder="••••"
                  maxLength="4"
                  autoComplete="off"
                  autoFocus
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
              {error && <p className="text-destructive text-sm text-center">{error}</p>}
            </div>

            <div className="space-y-3">
              <Button 
                type="submit" 
                className="w-full" 
                disabled={isLoading || password.length !== 4}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="loading-spinner w-4 h-4"></div>
                    Verificando...
                  </div>
                ) : (
                  'Acessar Pasta'
                )}
              </Button>

              {/* Indicadores visuais das senhas */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="flex items-center gap-1 p-2 bg-muted rounded text-center">
                  <Lock className="w-3 h-3 text-primary" />
                  <span>Acesso Normal</span>
                </div>
                <div className="flex items-center gap-1 p-2 bg-muted rounded text-center">
                  <AlertTriangle className="w-3 h-3 text-destructive" />
                  <span>Emergência</span>
                </div>
              </div>
            </div>
          </form>

          {/* Informações de segurança */}
          <div className="mt-6 p-3 bg-muted rounded-lg">
            <p className="text-xs text-muted-foreground text-center">
              <AlertTriangle className="w-3 h-3 inline mr-1" />
              A senha de emergência ativa automaticamente o protocolo de segurança
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;

