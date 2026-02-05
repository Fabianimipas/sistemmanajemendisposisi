import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useUser } from '@/context/UserContext';
import { useLanguage } from '@/context/LanguageContext';
import { getDisposisi, GetDisposisiOutputType } from 'zite-endpoints-sdk';
import { FileText, Clock, CheckCircle, AlertCircle, Plus, LogOut, User } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import DisposisiTable from '@/components/DisposisiTable';
import LanguageToggle from '@/components/LanguageToggle';
import ThemeToggle from '@/components/ThemeToggle';
import Footer from '@/components/Footer';
import AddUserDialog from '@/components/AddUserDialog';

type DisposisiType = GetDisposisiOutputType[0];

export default function Dashboard() {
  const { user, setUser } = useUser();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [disposisiList, setDisposisiList] = useState<DisposisiType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    loadDisposisi();
  }, [user, navigate]);

  const loadDisposisi = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const data = await getDisposisi({
        userEmail: user.email,
        userRole: user.roleName,
      });
      setDisposisiList(data);
    } catch (error) {
      console.error('Error loading disposisi:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    setUser(null);
    navigate('/login');
  };

  const stats = {
    total: disposisiList.length,
    diterima: disposisiList.filter(d => d.status === 'DITERIMA').length,
    diproses: disposisiList.filter(d => d.status === 'DIPROSES').length,
    selesai: disposisiList.filter(d => d.status === 'SELESAI').length,
    deadline: disposisiList.filter(d => {
      if (!d.deadLine || d.status === 'SELESAI') return false;
      const deadline = new Date(d.deadLine);
      const today = new Date();
      const diffDays = Math.ceil((deadline.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      return diffDays <= 3 && diffDays >= 0;
    }).length,
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="border-b bg-card shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-start mb-3">
            <div className="flex items-center gap-4">
              <img
                src="https://images.fillout.com/orgid-582077/flowpublicid-pw1znru4gq/widgetid-default/mvytWjhKcLbAar5Gmz7k4w/pasted-image-1770263604844.png"
                alt="Logo"
                className="w-16 h-16 object-contain"
              />
              <div>
                <h1 className="text-xl sm:text-2xl font-heading font-bold uppercase text-primary tracking-wide">
                  {t('login.title')}
                </h1>
                <div className="mt-1 space-y-0.5">
                  <p className="text-sm font-body font-semibold text-foreground">{user?.nama}</p>
                  <p className="text-xs font-body text-muted-foreground">
                    {user?.roleName} • {user?.unitKerja || 'Unit Kerja tidak tersedia'}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <ThemeToggle />
              <LanguageToggle />
              <Button variant="outline" onClick={() => navigate('/account')} className="font-body">
                <User className="h-4 w-4 mr-2" />
                {t('account.myAccount')}
              </Button>
              <Button variant="outline" onClick={handleLogout} className="font-body">
                <LogOut className="h-4 w-4 mr-2" />
                {t('dashboard.logout')}
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-6 space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-lg sm:text-xl font-heading font-semibold text-foreground">
            {t('dashboard.title')}
          </h2>
          <div className="flex gap-2">
            {user?.roleName === 'Administrator' && (
              <AddUserDialog onSuccess={loadDisposisi} />
            )}
            {(user?.roleName === 'Administrator' || user?.roleName === 'Ketua Tim') && (
              <Button onClick={() => navigate('/disposisi/baru')} className="bg-accent text-accent-foreground hover:bg-accent/90 font-body font-semibold">
                <Plus className="h-4 w-4 mr-2" />
                {t('dashboard.newDisposition')}
              </Button>
            )}
          </div>
        </div>

        {loading ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
            {[...Array(5)].map((_, i) => (
              <Card key={i}>
                <CardHeader className="pb-2">
                  <Skeleton className="h-4 w-20" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-8 w-12" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
            <Card className="shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-body font-semibold text-muted-foreground flex items-center">
                  <FileText className="h-4 w-4 mr-2" />
                  {t('dashboard.total')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-heading font-bold text-foreground">{stats.total}</div>
              </CardContent>
            </Card>

            <Card className="shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-body font-semibold text-muted-foreground flex items-center">
                  <AlertCircle className="h-4 w-4 mr-2" />
                  {t('dashboard.received')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-heading font-bold" style={{ color: 'hsl(45 95% 50%)' }}>{stats.diterima}</div>
              </CardContent>
            </Card>

            <Card className="shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-body font-semibold text-muted-foreground flex items-center">
                  <Clock className="h-4 w-4 mr-2" />
                  {t('dashboard.inProgress')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-heading font-bold text-primary">{stats.diproses}</div>
              </CardContent>
            </Card>

            <Card className="shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-body font-semibold text-muted-foreground flex items-center">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  {t('dashboard.completed')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-heading font-bold text-green-600">{stats.selesai}</div>
              </CardContent>
            </Card>

            <Card className="shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-body font-semibold text-muted-foreground flex items-center">
                  <AlertCircle className="h-4 w-4 mr-2" />
                  {t('dashboard.deadline')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-heading font-bold text-destructive">{stats.deadline}</div>
                <p className="text-xs font-body text-muted-foreground mt-1">{t('dashboard.deadlineNote')}</p>
              </CardContent>
            </Card>
          </div>
        )}

        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="font-heading font-semibold text-foreground">{t('dashboard.listTitle')}</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-2">
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            ) : (
              <DisposisiTable data={disposisiList} onRefresh={loadDisposisi} />
            )}
          </CardContent>
        </Card>
      </main>

      <Footer />
    </div>
  );
}
