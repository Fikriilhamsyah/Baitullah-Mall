export interface IPostXendit {
  external_id: string;
  amount: number;
  payer_email: string;
  description?: string;
  user_id: number;
}

export interface IXenditInvoice {
  id: string;
  external_id: string;
  amount: number;
  status: string;
  invoice_url: string;
  expiry_date?: string;
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
