import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { createUser, getRoles, GetRolesOutputType } from 'zite-endpoints-sdk';
import { useLanguage } from '@/context/LanguageContext';
import { UserPlus } from 'lucide-react';

interface AddUserDialogProps {
  onSuccess: () => void;
}

export default function AddUserDialog({ onSuccess }: AddUserDialogProps) {
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);
  const [roles, setRoles] = useState<GetRolesOutputType>([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    nama: '',
    email: '',
    password: '',
    idRole: '',
    unitKerja: '',
  });

  useEffect(() => {
    if (open) {
      loadRoles();
    }
  }, [open]);

  const loadRoles = async () => {
    try {
      const data = await getRoles({});
      setRoles(data);
    } catch (error) {
      console.error('Error loading roles:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password.length < 6) {
      toast.error(t('users.passwordMin'));
      return;
    }

    setLoading(true);
    try {
      const result = await createUser(formData);
      
      if (result.success) {
        toast.success(t('users.success'));
        setOpen(false);
        setFormData({
          nama: '',
          email: '',
          password: '',
          idRole: '',
          unitKerja: '',
        });
        onSuccess();
      } else {
        toast.error(result.message);
      }
    } catch (error: any) {
      toast.error(error.message || t('users.error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <UserPlus className="h-4 w-4 mr-2" />
          {t('users.addUser')}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{t('users.addUser')}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="nama">{t('users.name')} *</Label>
            <Input
              id="nama"
              value={formData.nama}
              onChange={(e) => setFormData(prev => ({ ...prev, nama: e.target.value }))}
              required
            />
          </div>

          <div>
            <Label htmlFor="email">{t('users.email')} *</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              required
            />
          </div>

          <div>
            <Label htmlFor="password">{t('users.password')} *</Label>
            <Input
              id="password"
              type="password"
              value={formData.password}
              onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
              required
              minLength={6}
            />
            <p className="text-xs text-muted-foreground mt-1">{t('users.passwordMin')}</p>
          </div>

          <div>
            <Label htmlFor="role">{t('users.role')} *</Label>
            <Select value={formData.idRole} onValueChange={(val) => setFormData(prev => ({ ...prev, idRole: val }))}>
              <SelectTrigger>
                <SelectValue placeholder={t('users.role')} />
              </SelectTrigger>
              <SelectContent>
                {roles.map((role) => (
                  <SelectItem key={role.id} value={role.idRole || ''}>
                    {role.namaRole}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="unitKerja">{t('users.unit')} *</Label>
            <Input
              id="unitKerja"
              value={formData.unitKerja}
              onChange={(e) => setFormData(prev => ({ ...prev, unitKerja: e.target.value }))}
              required
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              {t('users.cancel')}
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? t('users.saving') : t('users.save')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
