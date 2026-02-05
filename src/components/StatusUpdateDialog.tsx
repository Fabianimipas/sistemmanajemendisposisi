import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { updateDisposisiStatus, GetDisposisiDetailOutputType } from 'zite-endpoints-sdk';
import { useUser } from '@/context/UserContext';
import { RefreshCw } from 'lucide-react';

interface StatusUpdateDialogProps {
  disposisi: NonNullable<GetDisposisiDetailOutputType['disposisi']>;
  onSuccess: () => void;
}

export default function StatusUpdateDialog({ disposisi, onSuccess }: StatusUpdateDialogProps) {
  const { user } = useUser();
  const [open, setOpen] = useState(false);
  const [newStatus, setNewStatus] = useState(disposisi.status || '');
  const [buktiSelesai, setBuktiSelesai] = useState(disposisi.buktiSelesai || '');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    if (newStatus === 'SELESAI' && !buktiSelesai) {
      toast.error('Bukti Selesai wajib diisi untuk status SELESAI');
      return;
    }

    setLoading(true);
    try {
      await updateDisposisiStatus({
        idDisposisi: disposisi.idDisposisi || '',
        rowId: disposisi.id,
        newStatus,
        userEmail: user.email,
        userName: user.nama,
        buktiSelesai: newStatus === 'SELESAI' ? buktiSelesai : undefined,
      });
      toast.success('Status berhasil diperbarui');
      setOpen(false);
      onSuccess();
    } catch (error: any) {
      toast.error(error.message || 'Gagal memperbarui status');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default">
          <RefreshCw className="h-4 w-4 mr-2" />
          Update Status
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update Status Disposisi</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>Status Saat Ini</Label>
            <p className="text-sm font-medium mt-1">{disposisi.status}</p>
          </div>

          <div>
            <Label htmlFor="status">Status Baru</Label>
            <Select value={newStatus} onValueChange={setNewStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Pilih status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="DITERIMA">DITERIMA</SelectItem>
                <SelectItem value="DIPROSES">DIPROSES</SelectItem>
                <SelectItem value="SELESAI" disabled={!buktiSelesai && newStatus !== 'SELESAI'}>
                  SELESAI
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {(newStatus === 'SELESAI' || disposisi.status === 'SELESAI') && (
            <div>
              <Label htmlFor="bukti">Link Bukti Selesai *</Label>
              <Input
                id="bukti"
                value={buktiSelesai}
                onChange={(e) => setBuktiSelesai(e.target.value)}
                placeholder="https://..."
                required={newStatus === 'SELESAI'}
              />
              <p className="text-xs text-muted-foreground mt-1">
                Scan dokumen yang sudah ditandatangani Kepala Biro
              </p>
            </div>
          )}

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
