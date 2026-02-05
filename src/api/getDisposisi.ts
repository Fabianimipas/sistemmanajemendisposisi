import { z } from 'zod';
import { createEndpoint, Disposisi, DisposisiPic, Akun } from 'zite-integrations-backend-sdk';

export default createEndpoint({
  description: 'Get disposisi list based on user role',
  inputSchema: z.object({
    userEmail: z.string(),
    userRole: z.string(),
  }),
  outputSchema: z.array(
    z.object({
      id: z.number(),
      idDisposisi: z.string().optional(),
      nomorSurat: z.string().optional(),
      tanggalSurat: z.string().optional(),
      asalSurat: z.string().optional(),
      hal: z.string().optional(),
      deadLine: z.string().optional(),
      status: z.string().optional(),
      priority: z.string().optional(),
      pics: z.array(
        z.object({
          idUser: z.string(),
          nama: z.string(),
          peran: z.string(),
        })
      ),
    })
  ),
  execute: async ({ input }) => {
    const disposisiList = await Disposisi.findAll({});
    const picList = await DisposisiPic.findAll({});
    const userList = await Akun.findAll({});

    if (!disposisiList) return [];

    let filteredDisposisi = disposisiList;

    if (input.userRole !== 'Administrator' && input.userRole !== 'Ketua Tim') {
      const currentUser = userList?.find(u => String(u.email) === input.userEmail);
      if (currentUser) {
        const userPics = picList?.filter(
          (pic) => pic.idUser === currentUser.idUser && pic.aktif === 'Ya'
        );
        const userDisposisiIds = userPics?.map((pic) => pic.idDisposisi) || [];
        filteredDisposisi = disposisiList.filter((d) =>
          userDisposisiIds.includes(d.idDisposisi)
        );
      }
    }

    return filteredDisposisi.map((disposisi) => {
      const pics = picList
        ?.filter(
          (pic) => pic.idDisposisi === disposisi.idDisposisi && pic.aktif === 'Ya'
        )
        .map((pic) => {
          const user = userList?.find((u) => u.idUser === pic.idUser);
          return {
            idUser: pic.idUser || '',
            nama: user?.nama || '',
            peran: pic.peran || '',
          };
        }) || [];

      return {
        id: disposisi.id,
        idDisposisi: disposisi.idDisposisi,
        nomorSurat: disposisi.nomorSurat,
        tanggalSurat: disposisi.tanggalSurat,
        asalSurat: disposisi.asalSurat,
        hal: disposisi.hal,
        deadLine: disposisi.deadLine,
        status: disposisi.status,
        priority: disposisi.priority,
        pics,
      };
    });
  },
});