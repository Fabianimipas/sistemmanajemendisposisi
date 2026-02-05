import { z } from 'zod';
import { createEndpoint, DisposisiProgres } from 'zite-integrations-backend-sdk';

export default createEndpoint({
  description: 'Add progress entry to disposisi',
  inputSchema: z.object({
    idDisposisi: z.string(),
    progres: z.string(),
    catatan: z.string().optional(),
    userName: z.string(),
    userRole: z.string(),
    lampiran: z.string().optional(),
  }),
  outputSchema: z.object({
    success: z.boolean(),
    message: z.string(),
  }),
  execute: async ({ input }) => {
    const progresId = `PROG-${Date.now()}`;
    
    await DisposisiProgres.create({
      row: {
        idProgres: progresId,
        idDisposisi: input.idDisposisi,
        tanggal: new Date().toISOString(),
        progres: input.progres,
        catatan: input.catatan,
        dibuatOleh: input.userName,
        role: input.userRole,
        lampiran: input.lampiran,
      },
    });

    return {
      success: true,
      message: 'Progres berhasil ditambahkan',
    };
  },
});