import { z } from 'zod';
import {
  createEndpoint,
  Disposisi,
  DisposisiPic,
  DisposisiProgres,
  LogProses,
  Akun,
} from 'zite-integrations-backend-sdk';

export default createEndpoint({
  description: 'Get detailed information for a specific disposisi',
  inputSchema: z.object({
    idDisposisi: z.string(),
  }),
  outputSchema: z.object({
    disposisi: z
      .object({
        id: z.number().optional(),
        idDisposisi: z.string().optional(),
        nomorSurat: z.string().optional(),
        tanggalSurat: z.string().optional(),
        asalSurat: z.string().optional(),
        hal: z.string().optional(),
        kutipanSurat: z.string().optional(),
        tanggalDisposisi: z.string().optional(),
        deadLine: z.string().optional(),
        status: z.string().optional(),
        priority: z.string().optional(),
        linkDisposisi: z.string().optional(),
        tanggalSelesai: z.string().optional(),
        buktiSelesai: z.string().optional(),
        createdBy: z.string().optional(),
        createdAt: z.string().optional(),
        updatedBy: z.string().optional(),
        updatedAt: z.string().optional(),
      })
      .optional(),
    pics: z
      .array(
        z.object({
          idUser: z.string().optional(),
          nama: z.string().optional(),
          email: z.string().optional(),
          peran: z.string().optional(),
        })
      )
      .optional(),
    progres: z
      .array(
        z.object({
          idProgres: z.string().optional(),
          idDisposisi: z.string().optional(),
          tanggal: z.string().optional(),
          progres: z.string().optional(),
          catatan: z.string().optional(),
          dibuatOleh: z.string().optional(),
          role: z.string().optional(),
          lampiran: z.string().optional(),
          id: z.number(),
        })
      )
      .optional(),
    logs: z
      .array(
        z.object({
          idLog: z.string().optional(),
          idDisposisi: z.string().optional(),
          aksi: z.string().optional(),
          statusLama: z.string().optional(),
          statusBaru: z.string().optional(),
          tanggal: z.string().optional(),
          user: z.string().optional(),
          catatan: z.string().optional(),
          id: z.number(),
        })
      )
      .optional(),
  }),
  execute: async ({ input }) => {
    const disposisiList = await Disposisi.findAll({});
    const disposisi = disposisiList?.find(
      (d) => d.idDisposisi === input.idDisposisi
    );

    if (!disposisi) {
      return {
        disposisi: undefined,
        pics: [],
        progres: [],
        logs: [],
      };
    }

    const picList = await DisposisiPic.findAll({});
    const userList = await Akun.findAll({});
    const pics = picList
      ?.filter(
        (pic) => pic.idDisposisi === input.idDisposisi && pic.aktif === 'Ya'
      )
      .map((pic) => {
        const user = userList?.find((u) => u.idUser === pic.idUser);
        return {
          idUser: pic.idUser,
          nama: user?.nama,
          email: String(user?.email),
          peran: pic.peran,
        };
      });

    const progresList = await DisposisiProgres.findAll({});
    const progres = progresList?.filter(
      (p) => p.idDisposisi === input.idDisposisi
    );

    const logList = await LogProses.findAll({});
    const logs = logList?.filter((l) => l.idDisposisi === input.idDisposisi);

    return {
      disposisi,
      pics,
      progres,
      logs,
    };
  },
});