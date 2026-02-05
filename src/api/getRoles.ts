import { z } from 'zod';
import { createEndpoint, JenisAkun } from 'zite-integrations-backend-sdk';

export default createEndpoint({
  description: 'Get all roles',
  inputSchema: z.object({}),
  outputSchema: z.array(z.object({
    id: z.number(),
    idRole: z.string().optional(),
    namaRole: z.string().optional(),
  })),
  execute: async () => {
    const roles = await JenisAkun.findAll({});
    return roles || [];
  },
});