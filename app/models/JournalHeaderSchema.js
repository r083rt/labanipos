const JournalHeader = {
  name: 'JournalHeader',
  primaryKey: 'tanggal',
  properties: {
    tanggal: 'string',
    detail: 'CashJournal[]',
  },
};

export default JournalHeader;
