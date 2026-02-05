import { z } from 'zod';
import { createEndpoint, Akun } from 'zite-integrations-backend-sdk';

export default createEndpoint({
  description: 'Create a new user account',
  inputSchema: z.object({
    nama: z.string(),
    email: z.string(),
    password: z.string(),
    idRole: z.string(),
    unitKerja: z.string(),
  }),
  outputSchema: z.object({
    success: z.boolean(),
    message: z.string(),
  }),
  execute: async ({ input }) => {
    try {
      const users = await Akun.findAll({});
      const existingUser = users?.find(u => String(u.email) === input.email);

      if (existingUser) {
        return {
          success: false,
          message: 'NIP sudah terdaftar',
        };
      }

      const newUserId = `USER${String(Date.now()).slice(-6)}`;

      await Akun.create({
        row: {
          idUser: newUserId,
          nama: input.nama,
          email: String(input.email) as any,
          password: String(input.password) as any,
          idRole: input.idRole,
          unitKerja: input.unitKerja,
          aktif: 'Ya',
        },
      });

      return {
        success: true,
        message: 'User berhasil ditambahkan',
      };
    } catch (error) {
      return {
        success: false,
        message: 'Gagal menambahkan user',
      };
    }
  },
});