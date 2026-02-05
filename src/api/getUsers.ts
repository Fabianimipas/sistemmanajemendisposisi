import { z } from 'zod';
import { createEndpoint, Akun, JenisAkun } from 'zite-integrations-backend-sdk';

export default createEndpoint({
  description: 'Get all active users with their roles',
  inputSchema: z.object({}),
  outputSchema: z.array(
    z.object({
      id: z.number().optional(),
      idUser: z.string().optional(),
      nama: z.string().optional(),
      email: z.string().optional(),
      idRole: z.string().optional(),
      unitKerja: z.string().optional(),
      aktif: z.string().optional(),
      roleName: z.string().optional(),
    })
  ),
  execute: async () => {
    const users = await Akun.findAll({});
    const roles = await JenisAkun.findAll({});

    return (
      users
        ?.filter((u) => u.aktif === 'Ya')
        .map((user) => {
          const role = roles?.find((r) => r.idRole === user.idRole);
          return {
            id: user.id,
            idUser: user.idUser,
            nama: user.nama,
            email: String(user.email),
            idRole: user.idRole,
            unitKerja: user.unitKerja,
            aktif: user.aktif,
            roleName: role?.namaRole || '',
          };
        }) || []
    );
  },
});