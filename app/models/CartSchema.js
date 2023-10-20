const CartSchema = {
  name: 'Cart',
  primaryKey: 'id',
  properties: {
    id: 'string',
    id_transaksi: 'string',
    item: 'string',
    nama_barang: 'string',
    jumlah: {type: 'int', default: 0},
    satuan: 'string',
    harga_beli: {type: 'int', default: 0},
    harga_jual: {type: 'int', default: 0},
    subtotal: {type: 'int', default: 0},
    ppn: {type: 'int', default: 0},
    status: {type: 'int', default: 0},
  },
};

export default CartSchema;
