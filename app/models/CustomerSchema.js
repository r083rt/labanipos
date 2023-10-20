const CustomerSchema = {
  name: "Customer",
  primaryKey: "id_pelanggan",
  properties: {
    id_pelanggan: "string",
    nama: "string",
    alamat: "string",
    telp: "string",
    email: "string",
    tipe: "string",
    fax: "string",
  },
};

export default CustomerSchema;
