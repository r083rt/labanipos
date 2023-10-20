const ClosingSchema = {
  name: 'Closing',
  properties: {
    tanggal: 'string',
    masuk_kas: {type: 'int', default: 0},
    masuk_bank: {type: 'int', default: 0},
    keluar_kas: {type: 'int', default: 0},
    keluar_bank: {type: 'int', default: 0},
    saldo_kas: {type: 'int', default: 0},
    saldo_bank: {type: 'int', default: 0},
    is_success: {type: 'int', default: 0},
  },
};

export default ClosingSchema;
