import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { createDisposisi } from 'zite-endpoints-sdk';
import { useUser } from '@/context/UserContext';
import { ArrowLeft } from 'lucide-react';

export default function CreateDisposisiPage() {
  const navigate = useNavigate();
  const { user } = useUser();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    nomorSurat: '',
    tanggalSurat: '',
    asalSurat: '',
    hal: '',
    kutipanSurat: '',
    deadLine: '',
    priority: 'Normal',
    linkDisposisi: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      const result = await createDisposisi({
        ...formData,
        userEmail: user.email,
        userName: user.nama,
      });
      toast.success(result.message);
      navigate(`/disposisi/${result.idDisposisi}`);
    } catch (error: any) {
      toast.error(error.message || 'Gagal membuat disposisi');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

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
            <h1 className="text-xl sm:text-2xl font-heading font-bold uppercase text-primary tracking-wide">Buat Disposisi Baru</h1>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        <Card>
          <CardHeader>
            <CardTitle>Form Disposisi Surat</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="nomorSurat">Nomor Surat *</Label>
                  <Input
                    id="nomorSurat"
                    value={formData.nomorSurat}
                    onChange={(e) => handleChange('nomorSurat', e.target.value)}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="tanggalSurat">Tanggal Surat *</Label>
                  <Input
                    id="tanggalSurat"
                    type="date"
                    value={formData.tanggalSurat}
                    onChange={(e) => handleChange('tanggalSurat', e.target.value)}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="asalSurat">Asal Surat *</Label>
                  <Input
                    id="asalSurat"
                    value={formData.asalSurat}
                    onChange={(e) => handleChange('asalSurat', e.target.value)}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="deadLine">Deadline *</Label>
                  <Input
                    id="deadLine"
                    type="date"
                    value={formData.deadLine}
                    onChange={(e) => handleChange('deadLine', e.target.value)}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="priority">Prioritas</Label>
                  <Select value={formData.priority} onValueChange={(val) => handleChange('priority', val)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Normal">Normal</SelectItem>
                      <SelectItem value="Sedang">Sedang</SelectItem>
                      <SelectItem value="Tinggi">Tinggi</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="linkDisposisi">Link Disposisi</Label>
                  <Input
                    id="linkDisposisi"
                    value={formData.linkDisposisi}
                    onChange={(e) => handleChange('linkDisposisi', e.target.value)}
                    placeholder="https://..."
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="hal">Hal *</Label>
                <Input
                  id="hal"
                  value={formData.hal}
                  onChange={(e) => handleChange('hal', e.target.value)}
                  required
                />
              </div>

              <div>
                <Label htmlFor="kutipanSurat">Kutipan Surat</Label>
                <Textarea
                  id="kutipanSurat"
                  value={formData.kutipanSurat}
                  onChange={(e) => handleChange('kutipanSurat', e.target.value)}
                  rows={4}
                  placeholder="Isi ringkasan atau kutipan surat (opsional)"
                />
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button type="button" variant="outline" onClick={() => navigate('/dashboard')}>
                  Batal
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? 'Menyimpan...' : 'Buat Disposisi'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
