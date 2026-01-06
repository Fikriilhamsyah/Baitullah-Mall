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