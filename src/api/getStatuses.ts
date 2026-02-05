import { z } from 'zod';
import { createEndpoint, Status } from 'zite-integrations-backend-sdk';

export default createEndpoint({
  description: 'Get all status options',
  inputSchema: z.object({}),
  outputSchema: z.array(z.object({
    id: z.number(),
    kodeStatus: z.string().optional(),
    namaStatus: z.string().optional(),
    urutan: z.number().optional(),
    final: z.string().optional(),
  })),
  execute: async () => {
    const statuses = await Status.findAll({});
    return statuses || [];
  },
});
