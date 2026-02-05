import { z } from 'zod';
import { createEndpoint, Akun } from 'zite-integrations-backend-sdk';

export default createEndpoint({
  description: 'Debug endpoint to check user data',
  inputSchema: z.object({}),
  outputSchema: z.object({
    users: z.array(z.object({
      idUser: z.string().optional(),
      nama: z.string().optional(),
      email: z.any(),
      emailType: z.string(),
      emailAsString: z.string(),
      password: z.any(),
      passwordType: z.string(),
      passwordAsString: z.string(),
      aktif: z.string().optional(),
    })),
    totalUsers: z.number(),
  }),
  execute: async () => {
    const users = await Akun.findAll({});
    
    const debugUsers = users?.map(u => ({
      idUser: u.idUser || '',
      nama: u.nama || '',
      email: u.email,
      emailType: typeof u.email,
      emailAsString: String(u.email || ''),
      password: u.password,
      passwordType: typeof u.password,
      passwordAsString: String(u.password || ''),
      aktif: u.aktif || '',
    })) || [];

    console.log('=== DEBUG USERS ===');
    console.log('Total users:', users?.length || 0);
    debugUsers.forEach((u, i) => {
      console.log(`User ${i + 1}:`, u);
    });

    return {
      users: debugUsers,
      totalUsers: users?.length || 0,
    };
  },
});
