import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { useUser } from '@/context/UserContext';
import { getDisposisiDetail, GetDisposisiDetailOutputType } from 'zite-endpoints-sdk';
import { ArrowLeft, Users, Clock, FileText } from 'lucide-react';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import StatusUpdateDialog from '@/components/StatusUpdateDialog';
import AssignPICDialog from '@/components/AssignPICDialog';
import AddProgresDialog from '@/components/AddProgresDialog';

export default function DisposisiDetailPage() {
  const { id: idDisposisi } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useUser();
  const [data, setData] = useState<GetDisposisiDetailOutputType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    if (idDisposisi) {
      loadDetail();
    }
  }, [user, idDisposisi, navigate]);

  const loadDetail = async () => {
    if (!idDisposisi) return;
    setLoading(true);
    try {
      const result = await getDisposisiDetail({ idDisposisi });
      setData(result);
    } catch (error) {
      console.error('Error loading detail:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '-';
    try {
      return format(new Date(dateStr), 'dd MMMM yyyy HH:mm', { locale: id });
    } catch {
      return dateStr;
    }
  };

  const isKetuaTim = user?.roleName === 'Ketua Tim' || user?.roleName === 'Administrator';

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <header className="border-b bg-card">
          <div className="container mx-auto px-4 py-4">
            <Skeleton className="h-8 w-64" />
          </div>
        </header>
        <main className="container mx-auto px-4 py-6 space-y-6">
          <Skeleton className="h-64 w-full" />
        </main>
      </div>
    );
  }

  if (!data?.disposisi) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">Disposisi tidak ditemukan</p>
          <Button onClick={() => navigate('/dashboard')}>Kembali ke Dashboard</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <Button variant="ghost" onClick={() => navigate('/dashboard')} className="mb-3 font-body">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Kembali
          </Button>
          <div className="flex items-center gap-4">
            <img
              src="https://images.fillout.com/orgid-582077/flowpublicid-pw1znru4gq/widgetid-default/mvytWjhKcLbAar5Gmz7k4w/pasted-image-1770263604844.png"
              alt="Logo"
              className="w-12 h-12 object-contain"
            />
            <h1 className="text-xl sm:text-2xl font-heading font-bold uppercase text-primary tracking-wide">Detail Disposisi</h1>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 space-y-6">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle>Informasi Surat</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">{data.disposisi.idDisposisi}</p>
              </div>
              <div className="flex gap-2">
                <Badge className={data.disposisi.status === 'SELESAI' ? 'bg-green-500' : data.disposisi.status === 'DIPROSES' ? 'bg-blue-500' : 'bg-orange-500'}>
                  {data.disposisi.status}
                </Badge>
                {data.disposisi.priority === 'Tinggi' && (
                  <Badge variant="destructive">Prioritas Tinggi</Badge>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Nomor Surat</p>
                <p className="font-medium">{data.disposisi.nomorSurat}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Tanggal Surat</p>
                <p className="font-medium">{formatDate(data.disposisi.tanggalSurat)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Asal Surat</p>
                <p className="font-medium">{data.disposisi.asalSurat}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Deadline</p>
                <p className="font-medium">{formatDate(data.disposisi.deadLine)}</p>
              </div>
              <div className="md:col-span-2">
                <p className="text-sm text-muted-foreground">Hal</p>
                <p className="font-medium">{data.disposisi.hal}</p>
              </div>
              {data.disposisi.kutipanSurat && (
                <div className="md:col-span-2">
                  <p className="text-sm text-muted-foreground">Kutipan Surat</p>
                  <p className="font-medium">{data.disposisi.kutipanSurat}</p>
                </div>
              )}
              {data.disposisi.linkDisposisi && (
                <div className="md:col-span-2">
                  <p className="text-sm text-muted-foreground">Link Disposisi</p>
                  <a href={data.disposisi.linkDisposisi} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                    {data.disposisi.linkDisposisi}
                  </a>
                </div>
              )}
            </div>

            {isKetuaTim && (
              <div className="flex gap-2 pt-4">
                <StatusUpdateDialog disposisi={data.disposisi} onSuccess={loadDetail} />
                <AssignPICDialog idDisposisi={data.disposisi.idDisposisi || ''} onSuccess={loadDetail} />
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="h-5 w-5 mr-2" />
              Penanggung Jawab (PIC)
            </CardTitle>
          </CardHeader>
          <CardContent>
            {data.pics.length > 0 ? (
              <div className="space-y-2">
                {data.pics.map((pic, idx) => (
                  <div key={idx} className="flex justify-between items-center p-3 bg-muted rounded-lg">
                    <div>
                      <p className="font-medium">{pic.nama}</p>
                      <p className="text-sm text-muted-foreground">{pic.email}</p>
                    </div>
                    <Badge variant="outline">{pic.peran}</Badge>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-4">Belum ada PIC yang ditugaskan</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="flex items-center">
                <Clock className="h-5 w-5 mr-2" />
                Progres Pekerjaan
              </CardTitle>
              <AddProgresDialog idDisposisi={data.disposisi.idDisposisi || ''} onSuccess={loadDetail} />
            </div>
          </CardHeader>
          <CardContent>
            {data.progres.length > 0 ? (
              <div className="space-y-4">
                {data.progres.sort((a, b) => new Date(b.tanggal || '').getTime() - new Date(a.tanggal || '').getTime()).map((prog) => (
                  <div key={prog.id} className="border-l-4 border-primary pl-4 py-2">
                    <div className="flex justify-between items-start mb-2">
                      <p className="font-medium">{prog.progres}</p>
                      <p className="text-sm text-muted-foreground">{formatDate(prog.tanggal)}</p>
                    </div>
                    {prog.catatan && (
                      <p className="text-sm text-muted-foreground mb-2">{prog.catatan}</p>
                    )}
                    <div className="flex gap-2 text-xs">
                      <Badge variant="outline">{prog.dibuatOleh}</Badge>
                      <Badge variant="outline">{prog.role}</Badge>
                    </div>
                    {prog.lampiran && (
                      <a href={prog.lampiran} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline mt-2 inline-block">
                        Lihat Lampiran
                      </a>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-4">Belum ada progres</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileText className="h-5 w-5 mr-2" />
              Log Proses
            </CardTitle>
          </CardHeader>
          <CardContent>
            {data.logs.length > 0 ? (
              <div className="space-y-2">
                {data.logs.sort((a, b) => new Date(b.tanggal || '').getTime() - new Date(a.tanggal || '').getTime()).map((log) => (
                  <div key={log.id} className="p-3 bg-muted rounded-lg">
                    <div className="flex justify-between items-start mb-1">
                      <p className="font-medium text-sm">{log.aksi}</p>
                      <p className="text-xs text-muted-foreground">{formatDate(log.tanggal)}</p>
                    </div>
                    <p className="text-sm text-muted-foreground">{log.catatan}</p>
                    <p className="text-xs text-muted-foreground mt-1">oleh: {log.user}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-4">Belum ada log</p>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
