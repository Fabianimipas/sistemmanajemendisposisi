import { z } from 'zod';
import { createEndpoint, Akun, JenisAkun } from 'zite-integrations-backend-sdk';

export default createEndpoint({
  description: 'Login with NIP and password',
  inputSchema: z.object({
    email: z.string(),
    password: z.string(),
  }),
  outputSchema: z.object({
    success: z.boolean(),
    message: z.string(),
    debugInfo: z.string().optional(),
    user: z.object({
      id: z.number(),
      idUser: z.string().optional(),
      nama: z.string().optional(),
      email: z.string().optional(),
      idRole: z.string().optional(),
      unitKerja: z.string().optional(),
      roleName: z.string().optional(),
    }).optional(),
  }),
  execute: async ({ input }) => {
    console.log('=== LOGIN ATTEMPT ===');
    console.log('Input NIP:', input.email);
    console.log('Input Password:', input.password);
    
    const users = await Akun.findAll({});
    console.log('Total users in database:', users?.length || 0);
    
    // Log all users for debugging
    users?.forEach((u, i) => {
      console.log(`User ${i + 1}:`, {
        idUser: u.idUser,
        nama: u.nama,
        email: u.email,
        emailType: typeof u.email,
        emailStr: String(u.email || ''),
        password: u.password,
        passwordType: typeof u.password,
        passwordStr: String(u.password || ''),
        aktif: u.aktif,
      });
    });
    
    // Find user with multiple comparison strategies
    const user = users?.find(u => {
      if (!u.aktif || u.aktif !== 'Ya') {
        return false;
      }
      
      const emailStr = String(u.email || '').trim();
      const inputEmailStr = String(input.email || '').trim();
      
      // Try different comparison methods
      const emailMatch = 
        emailStr === inputEmailStr ||
        (u.email as any) === input.email ||
        u.email === Number(input.email) ||
        emailStr === inputEmailStr.replace(/'/g, ''); // Remove apostrophe if exists
      
      console.log(`Checking user ${u.idUser}:`, {
        emailMatch,
        emailStr,
        inputEmailStr,
        rawEmail: u.email,
      });
      
      return emailMatch;
    });

    console.log('User found:', user ? 'YES' : 'NO');
    
    if (!user) {
      const debugInfo = `Checked ${users?.length || 0} users. Input NIP: ${input.email}`;
      console.log('Login failed - user not found');
      return {
        success: false,
        message: 'NIP tidak ditemukan atau akun tidak aktif',
        debugInfo,
      };
    }

    // Check password with multiple strategies
    const storedPasswordRaw = user.password;
    const storedPasswordStr = String(storedPasswordRaw || '').trim();
    const inputPasswordStr = String(input.password || '').trim();
    
    console.log('Password check:', {
      storedPasswordRaw,
      storedPasswordStr,
      inputPasswordStr,
      storedPasswordType: typeof storedPasswordRaw,
    });
    
    // Try different password comparison methods
    const passwordMatch = 
      storedPasswordStr === inputPasswordStr ||
      (storedPasswordRaw as any) === input.password ||
      storedPasswordRaw === Number(input.password) ||
      storedPasswordStr === inputPasswordStr.replace(/'/g, ''); // Remove apostrophe if exists
    
    if (!passwordMatch) {
      console.log('Login failed - wrong password');
      const debugInfo = `Password mismatch. Stored: ${storedPasswordStr}, Input: ${inputPasswordStr}`;
      return {
        success: false,
        message: 'Password salah',
        debugInfo,
      };
    }

    const roles = await JenisAkun.findAll({});
    const roleName = roles?.find(r => r.idRole === user.idRole)?.namaRole;

    console.log('Login successful for user:', user.idUser);

    return {
      success: true,
      message: 'Login berhasil',
      user: {
        id: user.id,
        idUser: user.idUser,
        nama: user.nama,
        email: String(user.email),
        idRole: user.idRole,
        unitKerja: user.unitKerja,
        roleName,
      },
    };
  },
});
