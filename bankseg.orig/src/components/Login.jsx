import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Lock, Eye, EyeOff } from 'lucide-react';

const Login = ({ onLoginSuccess, onEmergencyActivated }) => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('pastaSeguraUser');
    if (storedUser) {
      setUserData(JSON.parse(storedUser));
    }
  }, []);

  const handlePasswordChange = (value) => {
    const numericValue = value.replace(/\D/g, '').slice(0, 4);
    setPassword(numericValue);
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!password || password.length !== 4) {
      setError('Digite uma senha de 4 dígitos');
      return;
    }

    if (!userData) {
      setError('Usuário não encontrado.');
      return;
    }

    setIsLoading(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 600));
      
      if (password === userData.normalPassword) {
        onLoginSuccess('normal');
      } else if (password === userData.securityPassword) {
        if (onEmergencyActivated) onEmergencyActivated();
        onLoginSuccess('emergency');
      } else {
        setError('Senha incorreta');
      }
    } catch (err) {
      setError('Erro ao validar senha');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="app-container flex items-center justify-center p-4">
      <Card className="form-container w-full max-w-md">
        <CardHeader className="text-center">
          <div className="logo-container">
            <Shield className="w-16 h-16 mx-auto mb-4 text-primary" />
            <CardTitle className="logo-text text-2xl">Pasta Segura Bancária</CardTitle>
          </div>
          <CardDescription className="text-muted-foreground">
            {userData ? `Olá, ${userData.name.split(' ')[0]}! Digite sua senha de acesso:` : 'Digite sua senha'}
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
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
              {error && <p className="text-destructive text-sm text-center">{error}</p>}
            </div>

            <Button 
              type="submit" 
              className="w-full" 
              disabled={isLoading || password.length !== 4}
            >
              {isLoading ? 'Acessando...' : 'Acessar Pasta'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;