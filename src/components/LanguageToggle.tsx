import { Button } from '@/components/ui/button';
import { useLanguage } from '@/context/LanguageContext';
import { Languages } from 'lucide-react';

export default function LanguageToggle() {
  const { language, setLanguage } = useLanguage();

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={() => setLanguage(language === 'id' ? 'en' : 'id')}
      className="gap-2"
    >
      <Languages className="h-4 w-4" />
      {language === 'id' ? 'EN' : 'ID'}
    </Button>
  );
}
