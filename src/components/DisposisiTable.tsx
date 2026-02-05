import { useNavigate } from 'react-router-dom';
import { GetDisposisiOutputType } from 'zite-endpoints-sdk';
import { useLanguage } from '@/context/LanguageContext';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Eye } from 'lucide-react';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

type DisposisiType = GetDisposisiOutputType[0];

interface DisposisiTableProps {
  data: DisposisiType[];
  onRefresh: () => void;
}

export default function DisposisiTable({ data }: DisposisiTableProps) {
  const navigate = useNavigate();
  const { t, language } = useLanguage();

  const getStatusBadge = (status?: string) => {
    const statusText = t(`status.${status}`);
    switch (status) {
      case 'DITERIMA':
        return <Badge className="bg-accent text-accent-foreground font-body">{statusText}</Badge>;
      case 'DIPROSES':
        return <Badge className="bg-primary text-primary-foreground font-body">{statusText}</Badge>;
      case 'SELESAI':
        return <Badge className="bg-green-600 text-white font-body">{statusText}</Badge>;
      default:
        return <Badge variant="secondary" className="font-body">{statusText}</Badge>;
    }
  };

  const getPriorityBadge = (priority?: string) => {
    if (priority === 'Tinggi') {
      return <Badge variant="destructive" className="font-body">{t('priority.high')}</Badge>;
    }
    if (priority === 'Sedang') {
      return <Badge className="bg-accent text-accent-foreground font-body">{t('priority.medium')}</Badge>;
    }
    return <Badge variant="outline" className="font-body">{t('priority.normal')}</Badge>;
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '-';
    try {
      return format(new Date(dateStr), 'dd MMM yyyy', { locale: language === 'id' ? id : undefined });
    } catch {
      return dateStr;
    }
  };

  if (data.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground font-body">
        {t('dashboard.noData')}
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b">
            <th className="text-left p-3 font-body font-semibold text-muted-foreground">{t('table.letterNumber')}</th>
            <th className="text-left p-3 font-body font-semibold text-muted-foreground">{t('table.subject')}</th>
            <th className="text-left p-3 font-body font-semibold text-muted-foreground">{t('table.from')}</th>
            <th className="text-left p-3 font-body font-semibold text-muted-foreground">{t('table.deadline')}</th>
            <th className="text-left p-3 font-body font-semibold text-muted-foreground">{t('table.status')}</th>
            <th className="text-left p-3 font-body font-semibold text-muted-foreground">{t('table.priority')}</th>
            <th className="text-left p-3 font-body font-semibold text-muted-foreground">{t('table.pic')}</th>
            <th className="text-left p-3 font-body font-semibold text-muted-foreground">{t('table.action')}</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={item.id} className="border-b hover:bg-muted/50 transition-colors">
              <td className="p-3 font-mono text-sm">{item.nomorSurat}</td>
              <td className="p-3 max-w-xs truncate font-body">{item.hal}</td>
              <td className="p-3 font-body">{item.asalSurat}</td>
              <td className="p-3 font-body">{formatDate(item.deadLine)}</td>
              <td className="p-3">{getStatusBadge(item.status)}</td>
              <td className="p-3">{getPriorityBadge(item.priority)}</td>
              <td className="p-3">
                {item.pics.length > 0 ? (
                  <div className="text-sm font-body">
                    {item.pics.map((pic, idx) => (
                      <div key={idx}>
                        {pic.nama} ({pic.peran})
                      </div>
                    ))}
                  </div>
                ) : (
                  <span className="text-muted-foreground text-sm font-body">{t('table.notAssigned')}</span>
                )}
              </td>
              <td className="p-3">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => navigate(`/disposisi/${item.idDisposisi}`)}
                  className="font-body"
                >
                  <Eye className="h-4 w-4" />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
