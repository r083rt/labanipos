const CashJournalSchema = {
  name: 'CashJournal',
  primaryKey: 'id',
  properties: {
    id: 'string',
    tanggal: 'string',
    tipe: 'string',
    id_pos: 'string',
    pos: 'string',
    id_metode: 'string',
    metode: 'string',
    keterangan: 'string',
    nominal: {type: 'int', default: 0},
  },
};

export default CashJournalSchema;
