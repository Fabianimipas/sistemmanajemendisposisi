import { z } from 'zod';
import { createEndpoint, Disposisi, LogProses } from 'zite-integrations-backend-sdk';

export default createEndpoint({
  description: 'Create new disposisi',
  inputSchema: z.object({
    nomorSurat: z.string(),
    tanggalSurat: z.string(),
    asalSurat: z.string(),
    hal: z.string(),
    kutipanSurat: z.string().optional(),
    deadLine: z.string(),
    priority: z.string().optional(),
    linkDisposisi: z.string().optional(),
    userEmail: z.string(),
    userName: z.string(),
  }),
  outputSchema: z.object({
    success: z.boolean(),
    message: z.string(),
    idDisposisi: z.string(),
  }),
  execute: async ({ input }) => {
    const idDisposisi = `DISP-${Date.now()}`;
    const now = new Date().toISOString();

    await Disposisi.create({
      row: {
        idDisposisi,
        nomorSurat: input.nomorSurat,
        tanggalSurat: input.tanggalSurat,
        asalSurat: input.asalSurat,
        hal: input.hal,
        kutipanSurat: input.kutipanSurat,
        tanggalDisposisi: now,
        deadLine: input.deadLine,
        status: 'DITERIMA',
        priority: input.priority || 'Normal',
        linkDisposisi: input.linkDisposisi,
        createdBy: input.userEmail,
        createdAt: now,
        updatedBy: input.userEmail,
        updatedAt: now,
      },
    });

    // Create log
    const logId = `LOG-${Date.now()}`;
    await LogProses.create({
      row: {
        idLog: logId,
        idDisposisi,
        aksi: 'CREATE',
        statusBaru: 'DITERIMA',
        tanggal: now,
        user: input.userName,
        catatan: 'Disposisi dibuat',
      },
    });

    return {
      success: true,
      message: 'Disposisi berhasil dibuat',
      idDisposisi,
    };
  },
});