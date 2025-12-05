export interface IPostCart {
    user_id: number,
    kode_varian: string,
    qty: number,
    harga: number,
}

export interface ICartByIdUser{
    id: number,
    id_jenis: number,
    user_id: number,
    kode_varian: string,
    harga: number
}