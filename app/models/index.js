import Realm from 'realm';
import CustomerSchema from './CustomerSchema';
import ProductSchema from './ProductSchema';
import TransactionHeaderSchema from './TransactionHeaderSchema';
import TransactionDetailSchema from './TransactionDetailSchema';
import CartSchema from './CartSchema';
import PrinterSettingSchema from './PrinterSettingSchema';
import StoreSchema from './StoreSchema';
import EDCSchema from './EDCSchema';
import ClosingSchema from './ClosingSchema';
import CashJournalSchema from './CashJournalSchema';
import TransMethodSchema from './TransMethod.Schema';
import JournalPosSchema from './JournalPosSchema';
import JournalHeader from './JournalHeaderSchema';

const realm = new Realm({
  schema: [
    CashJournalSchema,
    ClosingSchema,
    EDCSchema,
    PrinterSettingSchema,
    CustomerSchema,
    ProductSchema,
    TransactionHeaderSchema,
    TransactionDetailSchema,
    CartSchema,
    StoreSchema,
    TransMethodSchema,
    JournalPosSchema,
    JournalHeader,
  ],
  schemaVersion: 27,
});

export default realm;
