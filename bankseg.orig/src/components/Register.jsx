import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, User, Mail, Lock, Phone, AlertTriangle } from 'lucide-react';

const Register = ({ onRegisterSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    normalPassword: '',
    securityPassword: '',
    emergencyContact1: { name: '', phone: '' },
    emergencyContact2: { name: '', phone: '' },
    emergencyContact3: { name: '', phone: '' }
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    // Limpar erro quando usuário começar a digitar
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleContactChange = (contactIndex, field, value) => {
    const contactKey = `emergencyContact${contactIndex}`;
    setFormData(prev => ({
      ...prev,
      [contactKey]: {
        ...prev[contactKey],
        [field]: value
      }
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    // Validar campos obrigatórios
    if (!formData.name.trim()) newErrors.name = 'Nome é obrigatório';
    if (!formData.email.trim()) newErrors.email = 'E-mail é obrigatório';
    if (!formData.normalPassword) newErrors.normalPassword = 'Senha normal é obrigatória';
    if (!formData.securityPassword) newErrors.securityPassword = 'Senha de segurança é obrigatória';

    // Validar formato do e-mail
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email)) {
      newErrors.email = 'E-mail inválido';
    }

    // Validar senhas (4 dígitos)
    if (formData.normalPassword && formData.normalPassword.length !== 4) {
      newErrors.normalPassword = 'Senha deve ter 4 dígitos';
    }
    if (formData.securityPassword && formData.securityPassword.length !== 4) {
      newErrors.securityPassword = 'Senha deve ter 4 dígitos';
    }

    // Validar se as senhas são diferentes
    if (formData.normalPassword && formData.securityPassword && 
        formData.normalPassword === formData.securityPassword) {
      newErrors.securityPassword = 'Senhas devem ser diferentes';
    }

    // Validar contatos de emergência
    for (let i = 1; i <= 3; i++) {
      const contact = formData[`emergencyContact${i}`];
      if (!contact.name.trim()) {
        newErrors[`contact${i}Name`] = `Nome do contato ${i} é obrigatório`;
      }
      if (!contact.phone.trim()) {
        newErrors[`contact${i}Phone`] = `Telefone do contato ${i} é obrigatório`;
      } else if (!/^\(\d{2}\)\s\d{4,5}-\d{4}$/.test(contact.phone)) {
        newErrors[`contact${i}Phone`] = 'Formato: (11) 99999-9999';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    
    try {
      // Simular delay de processamento
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Salvar dados no localStorage (criptografados na implementação real)
      const userData = {
        ...formData,
        registeredAt: new Date().toISOString()
      };
      
      localStorage.setItem('pastaSeguraUser', JSON.stringify(userData));
      
      onRegisterSuccess();
    } catch (error) {
      console.error('Erro no cadastro:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatPhoneNumber = (value) => {
    // Remove tudo que não é dígito
    const numbers = value.replace(/\D/g, '');
    
    // Aplica a máscara (11) 99999-9999
    if (numbers.length <= 2) return `(${numbers}`;
    if (numbers.length <= 7) return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`;
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
            Crie sua conta para proteger seus apps bancários
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Dados Pessoais */}
            <div className="space-y-2">
              <Label htmlFor="name" className="flex items-center gap-2">
                <User className="w-4 h-4" />
                Nome Completo
              </Label>
              <Input
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className={errors.name ? 'border-destructive' : ''}
                placeholder="Seu nome completo"
              />
              {errors.name && <p className="text-destructive text-sm">{errors.name}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                E-mail
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className={errors.email ? 'border-destructive' : ''}
                placeholder="seu@email.com"
              />
              {errors.email && <p className="text-destructive text-sm">{errors.email}</p>}
            </div>

            {/* Senhas */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="normalPassword" className="flex items-center gap-2">
                  <Lock className="w-4 h-4" />
                  Senha Normal
                </Label>
                <Input
                  id="normalPassword"
                  type="password"
                  maxLength="4"
                  value={formData.normalPassword}
                  onChange={(e) => handleInputChange('normalPassword', e.target.value.replace(/\D/g, ''))}
                  className={`security-input ${errors.normalPassword ? 'border-destructive' : ''}`}
                  placeholder="0000"
                />
                {errors.normalPassword && <p className="text-destructive text-sm">{errors.normalPassword}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="securityPassword" className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4" />
                  Senha Emergência
                </Label>
                <Input
                  id="securityPassword"
                  type="password"
                  maxLength="4"
                  value={formData.securityPassword}
                  onChange={(e) => handleInputChange('securityPassword', e.target.value.replace(/\D/g, ''))}
                  className={`security-input ${errors.securityPassword ? 'border-destructive' : ''}`}
                  placeholder="0000"
                />
                {errors.securityPassword && <p className="text-destructive text-sm">{errors.securityPassword}</p>}
              </div>
            </div>

            {/* Contatos de Emergência */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Phone className="w-5 h-5" />
                Contatos de Emergência
              </h3>
              
              {[1, 2, 3].map((i) => (
                <div key={i} className="space-y-2 p-3 border border-border rounded-lg">
                  <Label className="text-sm font-medium">Contato {i}</Label>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Input
                        type="text"
                        value={formData[`emergencyContact${i}`].name}
                        onChange={(e) => handleContactChange(i, 'name', e.target.value)}
                        className={errors[`contact${i}Name`] ? 'border-destructive' : ''}
                        placeholder="Nome"
                      />
                      {errors[`contact${i}Name`] && <p className="text-destructive text-xs mt-1">{errors[`contact${i}Name`]}</p>}
                    </div>
                    <div>
                      <Input
                        type="tel"
                        value={formData[`emergencyContact${i}`].phone}
                        onChange={(e) => handleContactChange(i, 'phone', formatPhoneNumber(e.target.value))}
                        className={errors[`contact${i}Phone`] ? 'border-destructive' : ''}
                        placeholder="(11) 99999-9999"
                        maxLength="15"
                      />
                      {errors[`contact${i}Phone`] && <p className="text-destructive text-xs mt-1">{errors[`contact${i}Phone`]}</p>}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <Button 
              type="submit" 
              className="w-full" 
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="loading-spinner w-4 h-4"></div>
                  Criando conta...
                </div>
              ) : (
                'Criar Conta'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Register;

