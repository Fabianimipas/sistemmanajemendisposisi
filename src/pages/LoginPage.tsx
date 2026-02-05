import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { login } from 'zite-endpoints-sdk';
import { useUser } from '@/context/UserContext';
import { useLanguage } from '@/context/LanguageContext';
import LanguageToggle from '@/components/LanguageToggle';
import ThemeToggle from '@/components/ThemeToggle';
import Footer from '@/components/Footer';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

export default function LoginPage() {
  const [nip, setNip] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [debugInfo, setDebugInfo] = useState('');
  const navigate = useNavigate();
  const { setUser } = useUser();
  const { t } = useLanguage();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setDebugInfo('');

    try {
      const result = await login({
        email: nip,
        password
      });

      if (!result.success || !result.user) {
        toast.error(result.message);
        if (result.debugInfo) {
          setDebugInfo(result.debugInfo);
        }
        return;
      }

      setUser({
        email: result.user.email || '',
        nama: result.user.nama || '',
        idUser: result.user.idUser || '',
        idRole: result.user.idRole || '',
        roleName: result.user.roleName || '',
        unitKerja: result.user.unitKerja || ''
      });

      toast.success(t('login.success'));
      navigate('/dashboard');
    } catch (error) {
      toast.error(t('login.errorGeneral'));
      setDebugInfo(String(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 dark:from-slate-900 dark:to-slate-800 p-4">
        <div className="absolute top-4 right-4 flex gap-2">
          <ThemeToggle />
          <LanguageToggle />
        </div>
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1 text-center">
            <div className="flex justify-center mb-4">
              <img 
                src="https://images.fillout.com/orgid-582077/flowpublicid-pw1znru4gq/widgetid-default/mvytWjhKcLbAar5Gmz7k4w/pasted-image-1770263604844.png" 
                alt="Logo Kementerian Imigrasi dan Pemasyarakatan" 
                className="w-24 h-24 object-contain" 
              />
            </div>
            <CardTitle className="text-lg sm:text-2xl font-heading font-bold uppercase text-primary tracking-wide">
              {t('login.title')}
            </CardTitle>
            <CardDescription className="text-sm font-body">
              {t('login.subtitle')}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {debugInfo && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="text-xs font-mono">
                  {debugInfo}
                </AlertDescription>
              </Alert>
            )}
            
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="nip" className="font-body font-semibold text-muted-foreground">
                  {t('login.email')}
                </Label>
                <Input 
                  id="nip" 
                  type="text" 
                  placeholder={t('login.emailPlaceholder')} 
                  value={nip} 
                  onChange={e => setNip(e.target.value)} 
                  required 
                  className="font-mono" 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="font-body font-semibold text-muted-foreground">
                  {t('login.password')}
                </Label>
                <Input 
                  id="password" 
                  type="password" 
                  placeholder={t('login.passwordPlaceholder')} 
                  value={password} 
                  onChange={e => setPassword(e.target.value)} 
                  required 
                  className="font-body" 
                />
              </div>
              <Button 
                type="submit" 
                className="w-full font-body font-semibold bg-accent text-accent-foreground hover:bg-accent/90" 
                disabled={loading}
              >
                {loading ? t('login.processing') : t('login.submit')}
              </Button>
            </form>
            
            <div className="text-center">
              <Button
                variant="link"
                onClick={() => navigate('/initialize')}
                className="text-xs font-body text-muted-foreground"
              >
                Butuh bantuan? Klik di sini untuk inisialisasi/debug
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
      <Footer />
    </div>
  );
}
