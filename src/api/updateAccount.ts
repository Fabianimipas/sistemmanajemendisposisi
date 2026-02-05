import { z } from 'zod';
import { createEndpoint, Akun } from 'zite-integrations-backend-sdk';

export default createEndpoint({
  description: 'Update user account information',
  inputSchema: z.object({
    idUser: z.string(),
    nama: z.string(),
    nip: z.string(),
    password: z.string().optional(),
    unitKerja: z.string(),
    isAdmin: z.boolean(),
  }),
  outputSchema: z.object({
    success: z.boolean(),
    message: z.string(),
  }),
  execute: async ({ input }) => {
    try {
      const users = await Akun.findAll({});
      const user = users?.find(u => u.idUser === input.idUser);

      if (!user) {
        return {
          success: false,
          message: 'User tidak ditemukan',
        };
      }

      const updateData: any = {
        nama: input.nama,
      };

      if (input.password) {
        updateData.password = input.password;
      }

      if (input.isAdmin) {
        updateData.email = input.nip;
        updateData.unitKerja = input.unitKerja;
      }

      await Akun.update({
        rowId: user.id,
        row: updateData,
      });

      return {
        success: true,
        message: 'Akun berhasil diperbarui',
      };
    } catch (error) {
      return {
        success: false,
        message: 'Gagal memperbarui akun',
      };
    }
  },
});
