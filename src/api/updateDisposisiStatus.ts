import { z } from 'zod';
import { createEndpoint, Disposisi, LogProses, ZiteError } from 'zite-integrations-backend-sdk';

export default createEndpoint({
  description: 'Update disposisi status with validation',
  inputSchema: z.object({
    idDisposisi: z.string(),
    rowId: z.number(),
    newStatus: z.string(),
    userEmail: z.string(),
    userName: z.string(),
    buktiSelesai: z.string().optional(),
  }),
  outputSchema: z.object({
    success: z.boolean(),
    message: z.string(),
  }),
  execute: async ({ input }) => {
    // Validation: Cannot set to SELESAI without buktiSelesai
    if (input.newStatus === 'SELESAI' && !input.buktiSelesai) {
      throw new Error('Status SELESAI tidak dapat diatur tanpa Bukti Selesai');
    }

    const disposisiList = await Disposisi.findAll({});
    const disposisi = disposisiList?.find(d => d.idDisposisi === input.idDisposisi);

    if (!disposisi) {
      throw new Error('Disposisi tidak ditemukan');
    }

    const oldStatus = disposisi.status || '';
    const now = new Date().toISOString();

    // Update disposisi
    const updateData: any = {
      status: input.newStatus,
      updatedBy: input.userEmail,
      updatedAt: now,
    };

    if (input.newStatus === 'SELESAI') {
      updateData.tanggalSelesai = now;
      if (input.buktiSelesai) {
        updateData.buktiSelesai = input.buktiSelesai;
      }
    }

    await Disposisi.update({
      rowId: input.rowId,
      row: updateData,
    });

    // Create log entry
    const logId = `LOG-${Date.now()}`;
    await LogProses.create({
      row: {
        idLog: logId,
        idDisposisi: input.idDisposisi,
        aksi: 'UPDATE_STATUS',
        statusLama: oldStatus,
        statusBaru: input.newStatus,
        tanggal: now,
        user: input.userName,
        catatan: `Status diubah dari ${oldStatus} ke ${input.newStatus}`,
      },
    });

    return {
      success: true,
      message: 'Status berhasil diperbarui',
    };
  },
});