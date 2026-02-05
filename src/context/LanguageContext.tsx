import { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'id' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations = {
  id: {
    // Login Page
    'login.title': 'Sistem Manajemen Disposisi',
    'login.subtitle': 'Bagian Layanan dan Pembinaan SDM Aparatur, Organisasi dan Ketatalaksanaan',
    'login.email': 'NIP',
    'login.emailPlaceholder': 'Masukkan NIP',
    'login.password': 'Password',
    'login.passwordPlaceholder': 'Masukkan password',
    'login.submit': 'Masuk',
    'login.processing': 'Memproses...',
    'login.errorNotFound': 'Email tidak ditemukan',
    'login.errorGeneral': 'Terjadi kesalahan saat login',
    'login.success': 'Login berhasil',
    
    // Dashboard
    'dashboard.title': 'Dashboard',
    'dashboard.logout': 'Keluar',
    'dashboard.newDisposition': 'Disposisi Baru',
    'dashboard.total': 'Total',
    'dashboard.received': 'Diterima',
    'dashboard.inProgress': 'Diproses',
    'dashboard.completed': 'Selesai',
    'dashboard.deadline': 'Deadline',
    'dashboard.deadlineNote': '≤ 3 hari',
    'dashboard.listTitle': 'Daftar Disposisi',
    'dashboard.noData': 'Tidak ada disposisi',
    
    // Table
    'table.letterNumber': 'No. Surat',
    'table.subject': 'Hal',
    'table.from': 'Asal Surat',
    'table.deadline': 'Deadline',
    'table.status': 'Status',
    'table.priority': 'Prioritas',
    'table.pic': 'PIC',
    'table.action': 'Aksi',
    'table.notAssigned': 'Belum ditugaskan',
    
    // Detail Page
    'detail.back': 'Kembali',
    'detail.title': 'Detail Disposisi',
    'detail.letterInfo': 'Informasi Surat',
    'detail.letterNumber': 'Nomor Surat',
    'detail.letterDate': 'Tanggal Surat',
    'detail.from': 'Asal Surat',
    'detail.deadline': 'Deadline',
    'detail.subject': 'Hal',
    'detail.excerpt': 'Kutipan Surat',
    'detail.link': 'Link Disposisi',
    'detail.updateStatus': 'Update Status',
    'detail.assignPIC': 'Tugaskan PIC',
    'detail.picTitle': 'Penanggung Jawab (PIC)',
    'detail.noPIC': 'Belum ada PIC yang ditugaskan',
    'detail.progressTitle': 'Progres Pekerjaan',
    'detail.addProgress': 'Tambah Progres',
    'detail.noProgress': 'Belum ada progres',
    'detail.viewAttachment': 'Lihat Lampiran',
    'detail.logTitle': 'Log Proses',
    'detail.noLog': 'Belum ada log',
    'detail.by': 'oleh',
    'detail.notFound': 'Disposisi tidak ditemukan',
    'detail.backToDashboard': 'Kembali ke Dashboard',
    
    // Create Page
    'create.title': 'Buat Disposisi Baru',
    'create.back': 'Kembali',
    'create.formTitle': 'Form Disposisi Surat',
    'create.letterNumber': 'Nomor Surat',
    'create.letterDate': 'Tanggal Surat',
    'create.from': 'Asal Surat',
    'create.deadline': 'Deadline',
    'create.priority': 'Prioritas',
    'create.link': 'Link Disposisi',
    'create.subject': 'Hal',
    'create.excerpt': 'Kutipan Surat',
    'create.excerptPlaceholder': 'Isi ringkasan atau kutipan surat (opsional)',
    'create.cancel': 'Batal',
    'create.submit': 'Buat Disposisi',
    'create.saving': 'Menyimpan...',
    'create.success': 'Disposisi berhasil dibuat',
    'create.error': 'Gagal membuat disposisi',
    
    // Status Dialog
    'status.title': 'Update Status Disposisi',
    'status.current': 'Status Saat Ini',
    'status.new': 'Status Baru',
    'status.selectStatus': 'Pilih status',
    'status.proof': 'Link Bukti Selesai',
    'status.proofNote': 'Scan dokumen yang sudah ditandatangani Kepala Biro',
    'status.proofRequired': 'Bukti Selesai wajib diisi untuk status SELESAI',
    'status.cancel': 'Batal',
    'status.save': 'Simpan',
    'status.saving': 'Menyimpan...',
    'status.success': 'Status berhasil diperbarui',
    'status.error': 'Gagal memperbarui status',
    
    // Assign PIC Dialog
    'assign.title': 'Tugaskan Penanggung Jawab',
    'assign.selectUser': 'Pilih User',
    'assign.role': 'Peran',
    'assign.roleInCharge': 'Penanggung Jawab',
    'assign.roleDelegation': 'Delegasi',
    'assign.cancel': 'Batal',
    'assign.submit': 'Tugaskan',
    'assign.saving': 'Menyimpan...',
    'assign.success': 'PIC berhasil ditugaskan',
    'assign.error': 'Gagal menugaskan PIC',
    'assign.alreadyAssigned': 'User sudah ditugaskan pada disposisi ini',
    
    // Progress Dialog
    'progress.title': 'Tambah Progres Pekerjaan',
    'progress.progress': 'Progres',
    'progress.progressPlaceholder': 'Misal: Draft surat selesai',
    'progress.notes': 'Catatan',
    'progress.notesPlaceholder': 'Catatan tambahan (opsional)',
    'progress.attachment': 'Link Lampiran',
    'progress.cancel': 'Batal',
    'progress.save': 'Simpan',
    'progress.saving': 'Menyimpan...',
    'progress.success': 'Progres berhasil ditambahkan',
    'progress.error': 'Gagal menambahkan progres',
    
    // Priority
    'priority.high': 'Tinggi',
    'priority.medium': 'Sedang',
    'priority.normal': 'Normal',
    
    // Status
    'status.DITERIMA': 'DITERIMA',
    'status.DIPROSES': 'DIPROSES',
    'status.SELESAI': 'SELESAI',
    
    // User Management
    'users.title': 'Manajemen User',
    'users.addUser': 'Tambah User',
    'users.name': 'Nama',
    'users.email': 'NIP',
    'users.password': 'Password',
    'users.role': 'Role',
    'users.unit': 'Unit Kerja',
    'users.cancel': 'Batal',
    'users.save': 'Simpan',
    'users.saving': 'Menyimpan...',
    'users.success': 'User berhasil ditambahkan',
    'users.error': 'Gagal menambahkan user',
    'users.passwordMin': 'Password minimal 6 karakter',
    
    // Account Page
    'account.title': 'Informasi Akun',
    'account.myAccount': 'Akun Saya',
    'account.name': 'Nama',
    'account.nip': 'NIP',
    'account.password': 'Password',
    'account.newPassword': 'Password Baru',
    'account.passwordPlaceholder': 'Kosongkan jika tidak ingin mengubah',
    'account.unit': 'Unit Kerja',
    'account.role': 'Role',
    'account.save': 'Simpan Perubahan',
    'account.saving': 'Menyimpan...',
    'account.success': 'Akun berhasil diperbarui',
    'account.error': 'Gagal memperbarui akun',
    'account.back': 'Kembali',
    'account.adminOnly': 'Hanya Administrator yang dapat mengubah NIP dan Unit Kerja',
  },
  en: {
    // Login Page
    'login.title': 'Disposition Management System',
    'login.subtitle': 'Human Resources Services and Development, Organization and Governance Division',
    'login.email': 'NIP',
    'login.emailPlaceholder': 'Enter NIP',
    'login.password': 'Password',
    'login.passwordPlaceholder': 'Enter password',
    'login.submit': 'Login',
    'login.processing': 'Processing...',
    'login.errorNotFound': 'Email not found',
    'login.errorGeneral': 'An error occurred during login',
    'login.success': 'Login successful',
    
    // Dashboard
    'dashboard.title': 'Dashboard',
    'dashboard.logout': 'Logout',
    'dashboard.newDisposition': 'New Disposition',
    'dashboard.total': 'Total',
    'dashboard.received': 'Received',
    'dashboard.inProgress': 'In Progress',
    'dashboard.completed': 'Completed',
    'dashboard.deadline': 'Deadline',
    'dashboard.deadlineNote': '≤ 3 days',
    'dashboard.listTitle': 'Disposition List',
    'dashboard.noData': 'No dispositions',
    
    // Table
    'table.letterNumber': 'Letter No.',
    'table.subject': 'Subject',
    'table.from': 'From',
    'table.deadline': 'Deadline',
    'table.status': 'Status',
    'table.priority': 'Priority',
    'table.pic': 'PIC',
    'table.action': 'Action',
    'table.notAssigned': 'Not assigned',
    
    // Detail Page
    'detail.back': 'Back',
    'detail.title': 'Disposition Detail',
    'detail.letterInfo': 'Letter Information',
    'detail.letterNumber': 'Letter Number',
    'detail.letterDate': 'Letter Date',
    'detail.from': 'From',
    'detail.deadline': 'Deadline',
    'detail.subject': 'Subject',
    'detail.excerpt': 'Letter Excerpt',
    'detail.link': 'Disposition Link',
    'detail.updateStatus': 'Update Status',
    'detail.assignPIC': 'Assign PIC',
    'detail.picTitle': 'Person In Charge (PIC)',
    'detail.noPIC': 'No PIC assigned yet',
    'detail.progressTitle': 'Work Progress',
    'detail.addProgress': 'Add Progress',
    'detail.noProgress': 'No progress yet',
    'detail.viewAttachment': 'View Attachment',
    'detail.logTitle': 'Process Log',
    'detail.noLog': 'No logs yet',
    'detail.by': 'by',
    'detail.notFound': 'Disposition not found',
    'detail.backToDashboard': 'Back to Dashboard',
    
    // Create Page
    'create.title': 'Create New Disposition',
    'create.back': 'Back',
    'create.formTitle': 'Letter Disposition Form',
    'create.letterNumber': 'Letter Number',
    'create.letterDate': 'Letter Date',
    'create.from': 'From',
    'create.deadline': 'Deadline',
    'create.priority': 'Priority',
    'create.link': 'Disposition Link',
    'create.subject': 'Subject',
    'create.excerpt': 'Letter Excerpt',
    'create.excerptPlaceholder': 'Enter summary or letter excerpt (optional)',
    'create.cancel': 'Cancel',
    'create.submit': 'Create Disposition',
    'create.saving': 'Saving...',
    'create.success': 'Disposition created successfully',
    'create.error': 'Failed to create disposition',
    
    // Status Dialog
    'status.title': 'Update Disposition Status',
    'status.current': 'Current Status',
    'status.new': 'New Status',
    'status.selectStatus': 'Select status',
    'status.proof': 'Completion Proof Link',
    'status.proofNote': 'Scan of document signed by Bureau Chief',
    'status.proofRequired': 'Completion proof is required for COMPLETED status',
    'status.cancel': 'Cancel',
    'status.save': 'Save',
    'status.saving': 'Saving...',
    'status.success': 'Status updated successfully',
    'status.error': 'Failed to update status',
    
    // Assign PIC Dialog
    'assign.title': 'Assign Person In Charge',
    'assign.selectUser': 'Select User',
    'assign.role': 'Role',
    'assign.roleInCharge': 'Person In Charge',
    'assign.roleDelegation': 'Delegation',
    'assign.cancel': 'Cancel',
    'assign.submit': 'Assign',
    'assign.saving': 'Saving...',
    'assign.success': 'PIC assigned successfully',
    'assign.error': 'Failed to assign PIC',
    'assign.alreadyAssigned': 'User already assigned to this disposition',
    
    // Progress Dialog
    'progress.title': 'Add Work Progress',
    'progress.progress': 'Progress',
    'progress.progressPlaceholder': 'E.g.: Draft letter completed',
    'progress.notes': 'Notes',
    'progress.notesPlaceholder': 'Additional notes (optional)',
    'progress.attachment': 'Attachment Link',
    'progress.cancel': 'Cancel',
    'progress.save': 'Save',
    'progress.saving': 'Saving...',
    'progress.success': 'Progress added successfully',
    'progress.error': 'Failed to add progress',
    
    // Priority
    'priority.high': 'High',
    'priority.medium': 'Medium',
    'priority.normal': 'Normal',
    
    // Status
    'status.DITERIMA': 'RECEIVED',
    'status.DIPROSES': 'IN PROGRESS',
    'status.SELESAI': 'COMPLETED',
    
    // User Management
    'users.title': 'User Management',
    'users.addUser': 'Add User',
    'users.name': 'Name',
    'users.email': 'NIP',
    'users.password': 'Password',
    'users.role': 'Role',
    'users.unit': 'Work Unit',
    'users.cancel': 'Cancel',
    'users.save': 'Save',
    'users.saving': 'Saving...',
    'users.success': 'User added successfully',
    'users.error': 'Failed to add user',
    'users.passwordMin': 'Password minimum 6 characters',
    
    // Account Page
    'account.title': 'Account Information',
    'account.myAccount': 'My Account',
    'account.name': 'Name',
    'account.nip': 'NIP',
    'account.password': 'Password',
    'account.newPassword': 'New Password',
    'account.passwordPlaceholder': 'Leave blank if you don\'t want to change',
    'account.unit': 'Work Unit',
    'account.role': 'Role',
    'account.save': 'Save Changes',
    'account.saving': 'Saving...',
    'account.success': 'Account updated successfully',
    'account.error': 'Failed to update account',
    'account.back': 'Back',
    'account.adminOnly': 'Only Administrator can change NIP and Work Unit',
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('id');

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
