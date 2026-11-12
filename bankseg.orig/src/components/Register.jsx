import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, User, Mail, Lock, MessageCircle, AlertTriangle, CheckCircle2 } from 'lucide-react';

const Register = ({ onRegisterSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    normalPassword: '',
    securityPassword: '',
    emergencyContact1: { name: '', phone: '', verified: false },
    emergencyContact2: { name: '', phone: '', verified: false },
    emergencyContact3: { name: '', phone: '', verified: false }
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
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
        [field]: value,
        ...(field === 'phone' ? { verified: false } : {})
      }
    }));
    if (errors[`contact${contactIndex}Phone`]) {
      setErrors(prev => ({
        ...prev,
        [`contact${contactIndex}Phone`]: ''
      }));
    }
  };

  const handleTestarWhatsApp = (contactIndex) => {
    const contact = formData[`emergencyContact${contactIndex}`];
    const numbers = contact.phone.replace(/\D/g, '');

    if (numbers.length < 10) {
      setErrors(prev => ({
        ...prev,
        [`contact${contactIndex}Phone`]: 'Digite o DDD + número antes de validar'
      }));
      return;
    }

    const userName = formData.name.trim() || 'um usuário';
    const message = encodeURIComponent(
      `Olá! Você foi cadastrado como contato de emergência de *${userName}* no sistema *Pasta Segura*. Caso receba um alerta automático deste sistema com localização em tempo real, acione ajuda imediatamente. Responda "OK" para confirmar o recebimento.`
    );

    const whatsappUrl = `https://wa.me/55${numbers}?text=${message}`;
    
    const contactKey = `emergencyContact${contactIndex}`;
    setFormData(prev => ({
      ...prev,
      [contactKey]: {
        ...prev[contactKey],
        verified: true
      }
    }));

    window.location.href = whatsappUrl;
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = 'Nome é obrigatório';
    if (!formData.email.trim()) newErrors.email = 'E-mail é obrigatório';
    if (!formData.normalPassword) newErrors.normalPassword = 'Senha normal é obrigatória';
    if (!formData.securityPassword) newErrors.securityPassword = 'Senha de segurança é obrigatória';

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email)) {
      newErrors.email = 'E-mail inválido';
    }

    if (formData.normalPassword && formData.normalPassword.length !== 4) {
      newErrors.normalPassword = 'Senha deve ter 4 dígitos';
    }
    if (formData.securityPassword && formData.securityPassword.length !== 4) {
      newErrors.securityPassword = 'Senha deve ter 4 dígitos';
    }

    if (
      formData.normalPassword &&
      formData.securityPassword &&
      formData.normalPassword === formData.securityPassword
    ) {
      newErrors.securityPassword = 'Senhas devem ser diferentes';
    }

    for (let i = 1; i <= 3; i++) {
      const contact = formData[`emergencyContact${i}`];
      const hasPhone = contact.phone.trim().length > 0;

      if (i === 1 && !hasPhone) {
        newErrors[`contact${i}Phone`] = 'WhatsApp principal é obrigatório';
      } else if (hasPhone && !/^\(\d{2}\)\s\d{4,5}-\d{4}$/.test(contact.phone)) {
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
      await new Promise(resolve => setTimeout(resolve, 800));

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
    const numbers = value.replace(/\D/g, '');
    if (numbers.length === 0) return '';
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
            Crie sua conta e vincule o WhatsApp de emergência
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="flex items-center gap-2">
                <User className="w-4 h-4" />
                Seu Nome Completo
              </Label>
              <Input
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className={errors.name ? 'border-destructive' : ''}
                placeholder="Ex: João Silva"
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
                  Senha Coação
                </Label>
                <Input
                  id="securityPassword"
                  type="password"
                  maxLength="4"
                  value={formData.securityPassword}
                  onChange={(e) => handleInputChange('securityPassword', e.target.value.replace(/\D/g, ''))}
                  className={`security-input ${errors.securityPassword ? 'border-destructive' : ''}`}
                  placeholder="9999"
                />
                {errors.securityPassword && <p className="text-destructive text-sm">{errors.securityPassword}</p>}
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <div>
                <h3 className="text-base font-semibold flex items-center gap-2">
                  <MessageCircle className="w-5 h-5 text-green-500" />
                  WhatsApp para Alertas de Emergência
                </h3>
                <p className="text-xs text-muted-foreground mt-1">
                  Informe o celular com WhatsApp que receberá sua localização. Clique no botão verde para enviar o aviso de autorização.
                </p>
              </div>

              {[1, 2, 3].map((i) => {
                const contact = formData[`emergencyContact${i}`];
                return (
                  <div key={i} className="space-y-2 p-3 border border-border rounded-lg bg-card/50">
                    <div className="flex items-center justify-between">
                      <Label className="text-sm font-medium">
                        {i === 1 ? 'WhatsApp Principal (Obrigatório)' : `WhatsApp Reserva ${i - 1} (Opcional)`}
                      </Label>
                      {contact.verified && (
                        <span className="text-xs text-green-500 flex items-center gap-1 font-medium">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Testado
                        </span>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <Input
                        type="text"
                        value={contact.name}
                        onChange={(e) => handleContactChange(i, 'name', e.target.value)}
                        placeholder="Nome (ex: Esposa)"
                      />
                      <div>
                        <Input
                          type="tel"
                          value={contact.phone}
                          onChange={(e) => handleContactChange(i, 'phone', formatPhoneNumber(e.target.value))}
                          className={errors[`contact${i}Phone`] ? 'border-destructive' : ''}
                          placeholder="(11) 99999-9999"
                          maxLength="15"
                        />
                      </div>
                    </div>

                    {errors[`contact${i}Phone`] && (
                      <p className="text-destructive text-xs">{errors[`contact${i}Phone`]}</p>
                    )}

                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => handleTestarWhatsApp(i)}
                      className="w-full text-xs border-green-600/40 text-green-600 hover:bg-green-600/10 flex items-center justify-center gap-1.5"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      Enviar autorização pelo WhatsApp
                    </Button>
                  </div>
                );
              })}
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="loading-spinner w-4 h-4"></div>
                  Salvando cadastro...
                </div>
              ) : (
                'Concluir Cadastro'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Register;
