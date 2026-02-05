import { z } from 'zod';
import { createEndpoint, DisposisiPic, LogProses } from 'zite-integrations-backend-sdk';

export default createEndpoint({
  description: 'Assign PIC to disposisi',
  inputSchema: z.object({
    idDisposisi: z.string(),
    idUser: z.string(),
    peran: z.string(),
    userName: z.string(),
  }),
  outputSchema: z.object({
    success: z.boolean(),
    message: z.string(),
  }),
  execute: async ({ input }) => {
    // Check if already assigned
    const existingPics = await DisposisiPic.findAll({});
    const existing = existingPics?.find(p => 
      p.idDisposisi === input.idDisposisi && 
      p.idUser === input.idUser && 
      p.aktif === 'Ya'
    );

    if (existing) {
      return {
        success: false,
        message: 'User sudah ditugaskan pada disposisi ini',
      };
    }

    await DisposisiPic.create({
      row: {
        idDisposisi: input.idDisposisi,
        idUser: input.idUser,
        peran: input.peran,
        aktif: 'Ya',
      },
    });

    // Create log
    const logId = `LOG-${Date.now()}`;
    await LogProses.create({
      row: {
        idLog: logId,
        idDisposisi: input.idDisposisi,
        aksi: 'ASSIGN_PIC',
        tanggal: new Date().toISOString(),
        user: input.userName,
        catatan: `${input.idUser} ditugaskan sebagai ${input.peran}`,
      },
    });

    return {
      success: true,
      message: 'PIC berhasil ditugaskan',
    };
  },
});