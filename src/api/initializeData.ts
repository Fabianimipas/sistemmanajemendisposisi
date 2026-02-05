import { z } from 'zod';
import { createEndpoint, Status, JenisAkun, Akun } from 'zite-integrations-backend-sdk';

export default createEndpoint({
  description: 'Initialize default data for Status, Jenis_Akun, and default user',
  inputSchema: z.object({
    forceReset: z.boolean().optional(),
  }),
  outputSchema: z.object({
    success: z.boolean(),
    message: z.string(),
    details: z.string().optional(),
  }),
  execute: async ({ input }) => {
    try {
      console.log('=== INITIALIZATION STARTED ===');
      
      // Check if data already exists
      const existingStatuses = await Status.findAll({});
      const existingRoles = await JenisAkun.findAll({});
      const existingUsers = await Akun.findAll({});

      console.log('Existing data:', {
        statuses: existingStatuses?.length || 0,
        roles: existingRoles?.length || 0,
        users: existingUsers?.length || 0,
      });

      let statusCreated = false;
      let rolesCreated = false;
      let userCreated = false;

      // Add Status data if empty
      if (!existingStatuses || existingStatuses.length === 0) {
        await Status.create({
          row: {
            kodeStatus: 'DITERIMA',
            namaStatus: 'Diterima',
            urutan: 1 as any,
            final: 'Tidak',
          },
        });
        await Status.create({
          row: {
            kodeStatus: 'DIPROSES',
            namaStatus: 'Dalam Proses',
            urutan: 2 as any,
            final: 'Tidak',
          },
        });
        await Status.create({
          row: {
            kodeStatus: 'SELESAI',
            namaStatus: 'Selesai',
            urutan: 3 as any,
            final: 'Ya',
          },
        });
        statusCreated = true;
        console.log('✓ Status created');
      }

      // Add Jenis_Akun data if empty
      if (!existingRoles || existingRoles.length === 0) {
        await JenisAkun.create({
          row: {
            idRole: 'ROLE001',
            namaRole: 'Administrator',
          },
        });
        await JenisAkun.create({
          row: {
            idRole: 'ROLE002',
            namaRole: 'Ketua Tim',
          },
        });
        await JenisAkun.create({
          row: {
            idRole: 'ROLE003',
            namaRole: 'Anggota',
          },
        });
        rolesCreated = true;
        console.log('✓ Roles created');
      }

      // Use string for NIP to avoid scientific notation issues
      const nipString = '199702242025061006';
      const passwordString = '199702242025061006';
      
      // Check if user already exists
      const existingUserWithNIP = existingUsers?.find(u => {
        const emailStr = String(u.email || '');
        console.log('Checking user:', { idUser: u.idUser, email: u.email, emailStr, match: emailStr === nipString });
        return emailStr === nipString || u.idUser === 'USER001';
      });

      if (existingUserWithNIP && !input.forceReset) {
        console.log('User already exists:', existingUserWithNIP);
        userCreated = false;
      } else {
        // Delete old user if force reset
        if (existingUserWithNIP && input.forceReset) {
          console.log('Force reset - would delete old user');
        }
        
        // Create new user - store as TEXT to prevent scientific notation
        const newUser = await Akun.create({
          row: {
            idUser: 'USER001',
            nama: 'Fabian M. Luthfie',
            email: nipString as any, // Store as string/text
            password: passwordString as any, // Store as string/text
            idRole: 'ROLE001',
            unitKerja: 'Pengembangan Karier dan Kompetensi ASN',
            aktif: 'Ya',
          },
        });
        userCreated = true;
        console.log('✓ User created:', newUser);
      }

      // Verify the user was created
      const allUsers = await Akun.findAll({});
      const createdUser = allUsers?.find(u => u.idUser === 'USER001');
      
      console.log('=== VERIFICATION ===');
      console.log('Total users:', allUsers?.length);
      console.log('USER001 found:', createdUser);
      if (createdUser) {
        console.log('USER001 details:', {
          idUser: createdUser.idUser,
          nama: createdUser.nama,
          email: createdUser.email,
          emailType: typeof createdUser.email,
          emailAsString: String(createdUser.email),
          password: createdUser.password,
          passwordType: typeof createdUser.password,
          passwordAsString: String(createdUser.password),
          aktif: createdUser.aktif,
        });
      }

      const details = `Status: ${statusCreated ? 'dibuat' : 'sudah ada'}, Roles: ${rolesCreated ? 'dibuat' : 'sudah ada'}, User: ${userCreated ? 'dibuat' : 'sudah ada'}. Total users: ${allUsers?.length || 0}`;

      return {
        success: true,
        message: 'Data berhasil diinisialisasi',
        details,
      };
    } catch (error) {
      console.error('Initialization error:', error);
      return {
        success: false,
        message: 'Gagal menginisialisasi data: ' + (error as Error).message,
        details: (error as Error).stack,
      };
    }
  },
});
