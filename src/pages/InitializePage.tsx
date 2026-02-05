import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useUser } from '@/context/UserContext';
import { useLanguage } from '@/context/LanguageContext';
import { updateAccount } from 'zite-endpoints-sdk';
import { ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';
import ThemeToggle from '@/components/ThemeToggle';
import LanguageToggle from '@/components/LanguageToggle';
import Footer from '@/components/Footer';

export default function AccountPage() {
  const { user, setUser } = useUser();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    nama: '',
    nip: '',
    password: '',
    unitKerja: '',
  });

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    setFormData({
      nama: user.nama || '',
      nip: user.email || '',
      password: '',
      unitKerja: user.unitKerja || '',
    });
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      const result = await updateAccount({
        idUser: user.idUser,
        nama: formData.nama,
        nip: formData.nip,
        password: formData.password || undefined,
        unitKerja: formData.unitKerja,
        isAdmin: user.roleName === 'Administrator',
      });

      if (result.success) {
        toast.success(t('account.success'));
        setUser({
          ...user,
          nama: formData.nama,
          email: formData.nip,
          unitKerja: formData.unitKerja,
        });
        setFormData({ ...formData, password: '' });
      } else {
        toast.error(result.message || t('account.error'));
      }
    } catch (error) {
      toast.error(t('account.error'));
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Skeleton className="h-96 w-full max-w-2xl" />
      </div>
    );
  }

  const isAdmin = user.roleName === 'Administrator';

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="border-b bg-card shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <img
              src="https://images.fillout.com/orgid-582077/flowpublicid-pw1znru4gq/widgetid-default/mvytWjhKcLbAar5Gmz7k4w/pasted-image-1770263604844.png"
              alt="Logo"
              className="w-12 h-12 object-contain"
            />
            <div>
              <h1 className="text-xl sm:text-2xl font-heading font-bold uppercase text-primary tracking-wide">
                {t('account.title')}
              </h1>
              <p className="text-sm font-body text-muted-foreground mt-1">{user.nama} - {user.roleName}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <ThemeToggle />
            <LanguageToggle />
          </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-6">
        <Button
          variant="ghost"
          onClick={() => navigate('/dashboard')}
          className="mb-4 font-body"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          {t('account.back')}
        </Button>

        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="font-heading">{t('account.myAccount')}</CardTitle>
            <CardDescription className="font-body">
              {!isAdmin && t('account.adminOnly')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="nama" className="font-body font-semibold text-muted-foreground">
                  {t('account.name')}
                </Label>
                <Input
                  id="nama"
                  value={formData.nama}
                  onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                  required
                  className="font-body"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="nip" className="font-body font-semibold text-muted-foreground">
                  {t('account.nip')}
                </Label>
                <Input
                  id="nip"
                  value={formData.nip}
                  onChange={(e) => setFormData({ ...formData, nip: e.target.value })}
                  disabled={!isAdmin}
                  required
                  className="font-mono"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="unitKerja" className="font-body font-semibold text-muted-foreground">
                  {t('account.unit')}
                </Label>
                <Input
                  id="unitKerja"
                  value={formData.unitKerja}
                  onChange={(e) => setFormData({ ...formData, unitKerja: e.target.value })}
                  disabled={!isAdmin}
                  required
                  className="font-body"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="role" className="font-body font-semibold text-muted-foreground">
                  {t('account.role')}
                </Label>
                <Input
                  id="role"
                  value={user.roleName}
                  disabled
                  className="font-body bg-muted"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="font-body font-semibold text-muted-foreground">
                  {t('account.newPassword')}
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder={t('account.passwordPlaceholder')}
                  className="font-body"
                />
              </div>

              <Button
                type="submit"
                className="w-full font-body font-semibold bg-accent text-accent-foreground hover:bg-accent/90"
                disabled={loading}
              >
                {loading ? t('account.saving') : t('account.save')}
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>

      <Footer />
    </div>
  );
}
