const ProductSchema = {
  name: 'Product',
  primaryKey: 'id_barang',
  properties: {
    id_barang: 'string',
    barcode: 'string',
    kategori_barang: 'string',
    nama: 'string',
    nama_barang: 'string',
    nama_kategori: 'string',
    satuan: 'string',
    rak: 'string',
    pabrik: 'string',
    minimal_stock: {type: 'int', default: 0},
    curr_stock: {type: 'int', default: 0},
    harga_beli: {type: 'int', default: 0},
    harga_jual: {type: 'int', default: 0},
    point: {type: 'int', default: 0},
    jlh_per_kemasan: {type: 'int', default: 0},
    deskripsi: 'string',
  },
};

export default ProductSchema;
