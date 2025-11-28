import { IProduct } from "./IProduct";

export interface IReviewReply {
  admin_id: number;
  admin_name: string;
  reply_text: string;
  created_at: string;
}

export interface IProductReview {
  id: number;
  product: IProduct;      // relasi langsung
  user_name: string;
  user_avatar: string | null;

  rating: number;         // 1–5
  review_text: string;

  warna: string | null;   // varian yang dipilih user
  ukuran: string | null;

  media: {
    images: string[];
    videos: string[];
  };

  created_at: string; // ISO date string

  admin_reply?: IReviewReply | null;
}
