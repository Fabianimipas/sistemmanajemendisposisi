import { ExternalLink } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t bg-card mt-auto">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-center md:text-left">
            <p className="text-sm font-body text-muted-foreground">
              © 2026 <span className="font-semibold">Prakom Tidak Dikenal</span>
            </p>
            <p className="text-xs font-body text-muted-foreground mt-1">
              Layanan dan Pembinaan SDM Aparatur, Organisasi dan Ketatalaksanaan
            </p>
          </div>
          
          <div className="flex gap-4">
            <a
              href="https://kemenimipas.go.id/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-body text-primary hover:text-accent flex items-center gap-1 transition-colors"
            >
              Kementerian Imigrasi dan Pemasyarakatan
              <ExternalLink className="h-3 w-3" />
            </a>
            <a
              href="https://star-asn.kemenimipas.go.id/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-body text-primary hover:text-accent flex items-center gap-1 transition-colors"
            >
              Star-ASN
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
