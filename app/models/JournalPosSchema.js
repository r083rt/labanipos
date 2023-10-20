const JournalPosSchema = {
  name: 'JournalPos',
  primaryKey: 'akun_id',
  properties: {
    akun_id: 'string',
    tipe: 'string',
    nama: 'string?',
  },
};

export default JournalPosSchema;
