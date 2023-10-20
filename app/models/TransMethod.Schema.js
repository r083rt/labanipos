const TransMethodSchema = {
  name: 'TransMethod',
  primaryKey: 'akun_id',
  properties: {
    akun_id: 'string',
    akun_group: 'string',
    nama: 'string?',
  },
};

export default TransMethodSchema;
