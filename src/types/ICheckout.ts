// export interface IPostXendit {
//   external_id: string;
//   amount: number;
//   payer_email: string;
//   description?: string;
//   user_id: number;
// }

export interface IPostCheckout<T = unknown> {
  user_id: number;
  metode_pembayaran: string;
  alamat: string;
  ongkir: number;
  items: T;
}

export interface ICheckoutInvoice<TOrder = unknown, TDetails = unknown> {
  order: TOrder;
  details: TDetails;
}

export type IXenditPaymentMethod = {
  code: "VA" | "EWALLET" | "QRIS";
  label: string;
  description: string;
};

export const PAYMENT_METHODS: IXenditPaymentMethod[] = [
  {
    code: "VA",
    label: "Transfer Bank",
    description: "BCA, BNI, Mandiri, dll",
  },
  {
    code: "EWALLET",
    label: "E-Wallet",
    description: "OVO, DANA, ShopeePay",
  },
  {
    code: "QRIS",
    label: "QRIS",
    description: "Scan dengan aplikasi bank / e-wallet",
  },
];
