import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { addProgres } from 'zite-endpoints-sdk';
import { useUser } from '@/context/UserContext';
import { Plus } from 'lucide-react';

interface AddProgresDialogProps {
  idDisposisi: string;
  onSuccess: () => void;
}

export default function AddProgresDialog({ idDisposisi, onSuccess }: AddProgresDialogProps) {
  const { user } = useUser();
  const [open, setOpen] = useState(false);
  const [progres, setProgres] = useState('');
  const [catatan, setCatatan] = useState('');
  const [lampiran, setLampiran] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      await addProgres({
        idDisposisi,
        progres,
        catatan,
        userName: user.nama,
        userRole: user.roleName,
        lampiran: lampiran || undefined,
      });
      toast.success('Progres berhasil ditambahkan');
      setOpen(false);
      setProgres('');
      setCatatan('');
      setLampiran('');
      onSuccess();
    } catch (error: any) {
      toast.error(error.message || 'Gagal menambahkan progres');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Tambah Progres
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Tambah Progres Pekerjaan</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="progres">Progres *</Label>
            <Input
              id="progres"
              value={progres}
              onChange={(e) => setProgres(e.target.value)}
              placeholder="Misal: Draft surat selesai"
              required
            />
          </div>

          <div>
            <Label htmlFor="catatan">Catatan</Label>
            <Textarea
              id="catatan"
              value={catatan}
              onChange={(e) => setCatatan(e.target.value)}
              placeholder="Catatan tambahan (opsional)"
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="lampiran">Link Lampiran</Label>
            <Input
              id="lampiran"
              value={lampiran}
              onChange={(e) => setLampiran(e.target.value)}
              placeholder="https://..."
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Batal
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Menyimpan...' : 'Simpan'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
