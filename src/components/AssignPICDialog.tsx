import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { assignPIC, getUsers, GetUsersOutputType } from 'zite-endpoints-sdk';
import { useUser } from '@/context/UserContext';
import { UserPlus } from 'lucide-react';

interface AssignPICDialogProps {
  idDisposisi: string;
  onSuccess: () => void;
}

export default function AssignPICDialog({ idDisposisi, onSuccess }: AssignPICDialogProps) {
  const { user } = useUser();
  const [open, setOpen] = useState(false);
  const [users, setUsers] = useState<GetUsersOutputType>([]);
  const [selectedUser, setSelectedUser] = useState('');
  const [peran, setPeran] = useState('Delegasi');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      loadUsers();
    }
  }, [open]);

  const loadUsers = async () => {
    try {
      const data = await getUsers({});
      setUsers(data);
    } catch (error) {
      console.error('Error loading users:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !selectedUser) return;

    setLoading(true);
    try {
      const result = await assignPIC({
        idDisposisi,
        idUser: selectedUser,
        peran,
        userName: user.nama,
      });

      if (result.success) {
        toast.success(result.message);
        setOpen(false);
        setSelectedUser('');
        onSuccess();
      } else {
        toast.error(result.message);
      }
    } catch (error: any) {
      toast.error(error.message || 'Gagal menugaskan PIC');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <UserPlus className="h-4 w-4 mr-2" />
          Tugaskan PIC
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Tugaskan Penanggung Jawab</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="user">Pilih User</Label>
            <Select value={selectedUser} onValueChange={setSelectedUser}>
              <SelectTrigger>
                <SelectValue placeholder="Pilih user" />
              </SelectTrigger>
              <SelectContent>
                {users.map((u) => (
                  <SelectItem key={u.id} value={u.idUser || ''}>
                    {u.nama} - {u.roleName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="peran">Peran</Label>
            <Select value={peran} onValueChange={setPeran}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Penanggung Jawab">Penanggung Jawab</SelectItem>
                <SelectItem value="Delegasi">Delegasi</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Batal
            </Button>
            <Button type="submit" disabled={loading || !selectedUser}>
              {loading ? 'Menyimpan...' : 'Tugaskan'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
