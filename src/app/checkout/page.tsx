"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

// Components
import { Button } from "@/components/ui/Button";
import { InputField } from "@/components/ui/InputField";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { useToast } from "@/components/ui/Toast";
import { useModal } from "@/context/ModalContext";
import AddressList from "@/components/features/address/AddressList";

// Utils
import { formatPrice } from "@/utils/formatters";
import { formatDecimal } from "@/utils/formatDecimal";

// Hooks
import { useAddress } from "@/hooks/useAddress";
import { useRajaOngkirCalculate } from "@/hooks/useRajaOngkirCalculate";
import { useXenditPost } from "@/hooks/useXenditPost";

// Context
import { useAuth } from "@/context/AuthContext";
import AddressForm from "@/components/features/address/AddressForm";

interface CheckoutItem {
  product_id: number;
  nama_produk: string;
  kode_varian: string;
  warna: string | null;
  ukuran: string | null;
  qty: number;
  unit_price: number;
  subtotal: number;
  gambar?: string | null;
  stok_varian?: number;
  jenis?: string;
  // asumsi: berat per unit (gram)
  total_berat?: number;
}

/**
 * CheckoutPage
 * - otomatis menghitung ongkir ketika ada alamat & items
 * - menampilkan opsi jasa kirim, memungkinkan user memilih
 * - memperhitungkan biaya kirim ke total akhir
 *
 * Catatan:
 * - Status courier (active/nonactive) nanti seharusnya berasal dari database.
 * - Karena saat ini belum ada data, kita gunakan DUMMY_COURIER_STATUS (contoh) untuk simulasi.
 * - Format dummy: { code: "active" | "nonactive" }
 */
export default function CheckoutPage() {
  const router = useRouter();

  const { showToast } = useToast();
  const openModal = useModal((s) => s.openModal);
  const closeModal = useModal((s) => s.closeModal);

  const { address, loading: loadingAddress, error: errorAddress } = useAddress();
  const { postCalculateOngkir, data: calculatedOngkirData, loading: loadingOngkir, error: errorOngkir } = useRajaOngkirCalculate();
  const { postXendit, loading: loadingXendit } = useXenditPost();

  const [invoiceUrl, setInvoiceUrl] = useState<string | null>(null);

  const [items, setItems] = useState<CheckoutItem[] | null>(null);

  const [loading, setLoading] = useState(true);
  const [notes, setNotes] = useState("");
  const user = useAuth((s) => s.user);

  // selectedAddress will hold the currently chosen address object
  const [selectedAddress, setSelectedAddress] = useState<any | null>(null);

  // shipping options returned from API (flat array of normalized options)
  const [shippingOptions, setShippingOptions] = useState<any[] | null>(null);
  const [selectedShipping, setSelectedShipping] = useState<any | null>(null);
  const [shippingCost, setShippingCost] = useState<number>(0);

  useEffect(() => {
    // read from sessionStorage
    try {
      const raw = sessionStorage.getItem("checkout_items");
      const at = sessionStorage.getItem("checkout_items_at");
      if (!raw) {
        setItems(null);
        setLoading(false);
        return;
      }
      const parsed = JSON.parse(raw) as CheckoutItem[];
      // small validation
      if (!Array.isArray(parsed) || parsed.length === 0) {
        setItems(null);
        setLoading(false);
        return;
      }
      setItems(parsed);
      setLoading(false);
    } catch (e) {
      console.error("Failed to read checkout_items:", e);
      setItems(null);
      setLoading(false);
    }
  }, []);

  // Initialize selectedAddress from `address` (first address if available)
  useEffect(() => {
    if (Array.isArray(address) && address.length > 0) {
      // if no selectedAddress yet, set default to first address
      setSelectedAddress((prev: any | null) => (prev ?? address[0]));
    } else {
      setSelectedAddress(null);
    }
  }, [address]);

  // Listen for address:selected events from AddressList (or anywhere else)
  useEffect(() => {
    const handler = (ev: Event) => {
      try {
        const custom = ev as CustomEvent<any>;
        const payload = custom.detail;
        if (!payload) return;
        // payload should be the selected address object
        setSelectedAddress(payload);
      } catch (e) {
        // ignore
      }
    };

    if (typeof window !== "undefined") {
      window.addEventListener("address:selected", handler as EventListener);
    }

    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("address:selected", handler as EventListener);
      }
    };
  }, []);

  // compute totals
  const isAllPoin = items ? items.every((it) => String(it.jenis ?? "").toLowerCase() === "poin") : false;
  const totalPoints = items ? items.reduce((s, it) => s + (Number(it.subtotal) || 0), 0) : 0;
  const subtotalMoney = items ? items.reduce((s, it) => s + ((Number(it.unit_price) || 0) * (Number(it.qty) || 0)), 0) : 0;

  // compute total weight (gram) — asumsi: item.total_berat adalah berat per unit (gram)
  const computeTotalWeight = (): number => {
    if (!items) return 0;
    const weight = items.reduce((sum, it) => {
      const perUnit = Number(it.total_berat ?? 0);
      return sum + perUnit * (Number(it.qty) || 0);
    }, 0);
    // return integer grams, minimal 1 gram to avoid zero-weight edge case
    return Math.max(1, Math.ceil(weight));
  };

  // ---------------------------
  // Courier groups mapping
  // ---------------------------
  const ALL_COURIERS = [
    "jne", "sicepat", "ide", "sap", "jnt", "ninja", "tiki", "lion",
    "anteraja", "pos", "ncs", "rex", "rpx", "sentral", "star", "wahana", "dse"
  ];

  const COURIER_GROUPS: Record<string, string> = {
    "jne": "JNE",
    "jnt": "J&T",
    "sicepat": "SiCepat",
    "anteraja": "Anteraja",
    "ninja": "Ninja",
    "tiki": "TIKI",
    "pos": "POS Indonesia",
    "lion": "Lion Parcel",
    "rex": "REX",
    "rpx": "RPX",
    "ncs": "NCS",
    "sentral": "Sentral",
    "star": "Star",
    "wahana": "Wahana",
    "dse": "DSE",
    "ide": "IDE",
    "sap": "SAP",
  };

  // ---------------------------
  // DUMMY: courier status from "database"
  // Format: { code: "active" | "nonactive" }
  // Replace this with API call to your backend later.
  // ---------------------------
  const DUMMY_COURIER_STATUS: Record<string, "active" | "nonactive"> = {
    // simulate some services active, some not
    jne: "active",
    jnt: "active",
    sicepat: "nonactive",
    anteraja: "nonactive",
    ninja: "nonactive",
    tiki: "nonactive",
    pos: "nonactive",
    lion: "nonactive",
    rex: "nonactive",
    rpx: "nonactive",
    ncs: "nonactive",
    sentral: "nonactive",
    star: "nonactive",
    wahana: "nonactive",
    dse: "nonactive",
    ide: "nonactive",
    sap: "nonactive",
    // "other" handles unknown couriers in responses
    other: "nonactive",
  };

  // courierStatus boolean map derived from DUMMY_COURIER_STATUS
  const [courierStatus, setCourierStatus] = useState<Record<string, boolean>>({});

  // apply dummy status on mount (simulate fetching from DB)
  useEffect(() => {
    const mapped: Record<string, boolean> = {};
    Object.keys(DUMMY_COURIER_STATUS).forEach((k) => {
      mapped[k] = DUMMY_COURIER_STATUS[k] === "active";
    });
    setCourierStatus(mapped);
  }, []);

  // track open/closed state for collapse groups; default collapsed
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({});

  // toggle helper
  const toggleGroup = (group: string) => {
    setOpenGroups((prev) => ({ ...prev, [group]: !prev[group] }));
  };

  // Call calculate ongkir whenever selectedAddress changes (and items exist)
  useEffect(() => {
    const shouldCalculate = selectedAddress && items && items.length > 0;
    console.log("[checkout] shouldCalculate ongkir?", shouldCalculate);
    if (!shouldCalculate) {
      setShippingOptions(null);
      setSelectedShipping(null);
      setShippingCost(0);
      return;
    }

    // extract destination: id kecamatan (prefer kecamatan_id)
    let kecamatanId = Number(selectedAddress?.kecamatan_id ?? selectedAddress?.kecamatan ?? 0);

    // fallback to kelurahan/kelurahan_id if kecamatan not present
    if (!kecamatanId || kecamatanId <= 0) {
      const fallback = Number(selectedAddress?.kelurahan_id ?? selectedAddress?.kelurahan ?? 0);
      if (fallback && fallback > 0) kecamatanId = fallback;
    }

    if (!kecamatanId || kecamatanId <= 0) {
      showToast("Tidak dapat menemukan ID kecamatan pada alamat. Tidak bisa menghitung ongkir.", "warning");
      return;
    }

    console.log("[checkout] kecamatanId:", kecamatanId);

    const weight = computeTotalWeight();

    console.log("[checkout] weight (grams):", weight);

    // Helper: normalisasi satu respons menjadi array opsi (safely)
    const parseOptionsFromData = (raw: any): any[] => {
      const data: any = raw?.data ?? raw;
      if (!data) return [];

      // If data is array -> use directly
      if (Array.isArray(data)) return data;

      // nested shapes
      if (Array.isArray(data.results)) return data.results;
      if (Array.isArray(data.services)) return data.services;
      if (Array.isArray(data.response?.results)) return data.response.results;

      // RajaOngkir shape
      if (Array.isArray(data.rajaongkir?.results)) {
        const results = data.rajaongkir.results;
        return results.flatMap((r: any) => {
          if (Array.isArray(r.costs)) {
            return r.costs.map((c: any) => ({
              ...c,
              courier_name: r.name ?? r.courier ?? r.code,
              courier_code: r.code ?? r.courier,
            }));
          }
          return [];
        });
      }

      // If unknown object but has some array prop that looks like services/costs
      for (const k of Object.keys(data)) {
        if (Array.isArray(data[k])) return data[k];
      }

      return [];
    };

    // Helper: normalize a single option entry to common shape, attach group if possible
    const normalizeOption = (o: any, parentCourier?: string) => {
      const svc = o;
      // If svc has 'cost' array (rajaongkir inner)
      if (Array.isArray(svc.cost)) {
        const val = Number(svc.cost?.[0]?.value ?? 0);
        const etd = svc.cost?.[0]?.etd ?? svc.etd ?? svc.estimated_time ?? "";
        const code = (svc.courier_code ?? svc.code ?? parentCourier ?? "").toLowerCase();
        const group = COURIER_GROUPS[code] ?? COURIER_GROUPS[(parentCourier ?? "").toLowerCase()] ?? "Other";
        return {
          name: svc.courier_name ?? svc.name ?? parentCourier ?? "",
          code,
          service: svc.service ?? svc.service_name ?? svc.name ?? "",
          description: svc.description ?? "",
          cost: Number(val || 0),
          etd,
          group,
          raw: svc,
        };
      }

      // If cost is number or string numeric
      const costVal = Number(svc.cost ?? svc.price ?? svc.value ?? 0);
      const code = (svc.code ?? svc.courier ?? parentCourier ?? "").toLowerCase();
      const group = COURIER_GROUPS[code] ?? COURIER_GROUPS[(parentCourier ?? "").toLowerCase()] ?? "Other";

      return {
        name: svc.name ?? svc.courier_name ?? parentCourier ?? "",
        code,
        service: svc.service ?? svc.service_name ?? svc.name ?? "",
        description: svc.description ?? "",
        cost: Number(!Number.isNaN(costVal) ? costVal : 0),
        etd: svc.etd ?? svc.eta ?? svc.estimated_time ?? "",
        group,
        raw: svc,
      };
    };

    // build payload base (we will override courier per-call)
    const basePayload = {
      origin: 1358,
      destination: kecamatanId,
      weight: weight,
      price: "lowest",
    };

    // Core: call postCalculateOngkir for each courier in ALL_COURIERS, aggregate results
    (async () => {
      try {
        setShippingOptions(null);
        // do NOT auto-clear selectedShipping here -- preserve if possible
        setShippingCost(0);

        const aggregatedOptions: any[] = [];

        // Helper: promise timeout wrapper
        const withTimeout = <T,>(p: Promise<T>, ms: number, onTimeoutMsg?: string) =>
          new Promise<T>((resolve, reject) => {
            const timer = setTimeout(() => {
              const msg = onTimeoutMsg ?? `Request timed out after ${ms}ms`;
              // reject with a specific error so we can ignore later
              const err: any = new Error(msg);
              err.__timedout = true;
              reject(err);
            }, ms);
            p
              .then((v) => {
                clearTimeout(timer);
                resolve(v);
              })
              .catch((e) => {
                clearTimeout(timer);
                reject(e);
              });
          });

        // 1) Try a single combined request first (many RajaOngkir adapters accept semicolon list)
        const combinedCourierList = ALL_COURIERS.join(";");
        try {
          console.log("[checkout] trying combined courier request:", combinedCourierList);
          const combinedRes = await withTimeout(postCalculateOngkir({
            ...basePayload,
            courier: combinedCourierList,
          }), 8000, "Combined courier request timeout");

          const entries = parseOptionsFromData(combinedRes);
          if (Array.isArray(entries) && entries.length > 0) {
            const normalizedForCourier = entries.flatMap((e: any) => {
              const norm = normalizeOption(e, e?.courier ?? e?.code ?? undefined);
              // ensure code/name normalized
              if (!norm.code) norm.code = (e?.courier ?? e?.code ?? "").toLowerCase();
              if (!norm.name) norm.name = norm.name || (norm.code ?? "").toUpperCase();
              norm.cost = Number(norm.cost ?? 0);
              return norm;
            });
            aggregatedOptions.push(...normalizedForCourier);
          } else {
            console.log("[checkout] combined call returned no entries, will try per-courier.");
          }
        } catch (errCombined) {
          // Combined call failed/timeouts -> fallback to per-courier parallel with concurrency
          console.warn("[checkout] combined courier call failed, falling back to per-courier:", errCombined);
        }

        // If combined didn't populate aggregatedOptions, run per-courier requests with concurrency
        if (aggregatedOptions.length === 0) {
          // concurrency helper (chunking)
          const CONCURRENCY = 4;
          const chunks: string[][] = [];
          for (let i = 0; i < ALL_COURIERS.length; i += CONCURRENCY) {
            chunks.push(ALL_COURIERS.slice(i, i + CONCURRENCY));
          }

          for (const chunk of chunks) {
            // map chunk -> promises with timeout
            const promises = chunk.map((courier) => {
              const payload = { ...basePayload, courier };
              console.log(`[checkout] requesting ongkir for courier="${courier}" payload:`, payload);
              return withTimeout(postCalculateOngkir(payload), 8000, `Courier ${courier} timeout`)
                .then((res) => ({ courier, res }))
                .catch((err) => {
                  // annotate but don't throw to break all
                  console.warn(`[checkout] courier ${courier} failed/timeout:`, err?.message ?? err);
                  return { courier, res: null, err };
                });
            });

            const settled = await Promise.all(promises);
            // process results from this chunk
            for (const s of settled) {
              if (!s || !s.res) continue;
              const entries = parseOptionsFromData(s.res);
              if (!Array.isArray(entries) || entries.length === 0) continue;

              const normalizedForCourier = entries.flatMap((e: any) => {
                const norm = normalizeOption(e, s.courier);
                if (!norm.code) norm.code = s.courier;
                if (!norm.name) norm.name = norm.name || s.courier.toUpperCase();
                norm.cost = Number(norm.cost ?? 0);
                return norm;
              });

              aggregatedOptions.push(...normalizedForCourier);
            }

            // small delay between chunks to be polite (optional)
            await new Promise((r) => setTimeout(r, 150));
          }
        }

        // fallback: if nothing from per-courier calls, try previous calculatedOngkirData (hook state)
        if (aggregatedOptions.length === 0 && Array.isArray(calculatedOngkirData) && calculatedOngkirData.length > 0) {
          console.log("[checkout] falling back to calculatedOngkirData");
          const fallback = calculatedOngkirData.flatMap((e: any) => {
            const norm = normalizeOption(e, e?.courier ?? e?.code ?? undefined);
            if (!norm.code) norm.code = (e?.courier ?? e?.code ?? "").toLowerCase();
            if (!norm.name) norm.name = e?.name ?? e?.courier ?? "";
            return norm;
          });
          aggregatedOptions.push(...fallback);
        }

        console.log("[checkout] aggregatedOptions (before dedupe/sort):", aggregatedOptions.length, aggregatedOptions);

        if (!aggregatedOptions || aggregatedOptions.length === 0) {
          setShippingOptions([]);
          setSelectedShipping(null);
          setShippingCost(0);
          showToast("Tidak ditemukan opsi pengiriman untuk tujuan ini. (cek console untuk response lengkap)", "info");
          return;
        }

        // Deduplicate by carrier+service, keep lowest cost per pair
        const mapKey = (o: any) => `${String(o.code ?? "").toLowerCase()}|${String(o.service ?? "").toLowerCase()}`;
        const dedupMap = new Map<string, any>();
        for (const opt of aggregatedOptions) {
          const key = mapKey(opt);
          if (!dedupMap.has(key)) dedupMap.set(key, opt);
          else {
            const existing = dedupMap.get(key);
            if ((Number(opt.cost) || 0) < (Number(existing.cost) || 0)) dedupMap.set(key, opt);
          }
        }
        const deduped = Array.from(dedupMap.values());

        // sort by cost ascending
        const sorted = [...deduped].sort((a, b) => (Number(a.cost) || 0) - (Number(b.cost) || 0));

        // set shipping options (flat list with group property)
        setShippingOptions(sorted);

        // initialize collapse state: collapsed by default; expand first group (cheery UX)
        const groups = Array.from(new Set(sorted.map((s) => s.group ?? COURIER_GROUPS[(s.code ?? "").toLowerCase()] ?? "Other")));
        const initOpenState: Record<string, boolean> = {};
        groups.forEach((g, idx) => {
          initOpenState[g] = idx === 0;
        });
        setOpenGroups(initOpenState);

        // IMPORTANT: preserve existing selection if it still exists, otherwise clear
        const currentSelected = selectedShipping;
        if (currentSelected) {
          const currentKey = mapKey(currentSelected);
          const preserved = sorted.find((s) => mapKey(s) === currentKey);
          if (preserved) {
            setSelectedShipping(preserved);
            setShippingCost(Number(preserved.cost ?? 0));
          } else {
            setSelectedShipping(null);
            setShippingCost(0);
          }
        } else {
          // leave unselected until user picks
          setSelectedShipping(null);
          setShippingCost(0);
        }

        console.log("[checkout] final shippingOptions count:", sorted.length, "selectedShipping:", selectedShipping);
      } catch (err: any) {
        console.error("Calculate ongkir failed (aggregated):", err);
        const message = err?.message ?? "Gagal menghitung ongkir.";
        showToast(message, "error");
        setShippingOptions(null);
        setSelectedShipping(null);
        setShippingCost(0);
      }
    })();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedAddress, items, courierStatus]); // include courierStatus so filter changes applied if you swap dummy later

  // whenever selectedShipping changes, update shippingCost
  useEffect(() => {
    setShippingCost(selectedShipping?.cost ?? 0);
  }, [selectedShipping]);

  const placeOrder = async () => {
    if (!user) {
      showToast("Harap login", "error");
      return;
    }

    if (!selectedAddress || !selectedShipping) {
      showToast("Lengkapi alamat & pengiriman", "warning");
      return;
    }

    try {
      setLoading(true);

      const orderId = `ORD-${Date.now()}`;

      // 1️⃣ SIMPAN ORDER KE BACKEND (WAJIB IDEALNYA)
      // await api.createOrder({ ... })

      // 2️⃣ BUAT INVOICE SESUAI METODE
      const xenditPayload = {
        external_id: orderId,
        amount: subtotalMoney + shippingCost,
        payer_email: user.email,
        description: `Pembayaran Order ${orderId}`,
        user_id: user.id,
      };

      const res = await postXendit(xenditPayload);

      window.location.href = res?.data?.invoice_url;

      const url = res?.data?.invoice_url;

      if (!url) {
        throw new Error("Invoice URL tidak tersedia");
      }

      // ✅ SIMPAN URL
      setInvoiceUrl(url);

      showToast("Invoice berhasil dibuat", "success");
    } catch (err: any) {
      showToast(err.message || "Gagal memproses pembayaran", "error");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  if (!items || items.length === 0) {
    return (
      <div className="pt-[80px] md:pt-[89px] lg:pt-[92px]">
        <div className="container mx-auto px-4 md:px-6 py-12">
            <h1 className="text-2xl font-bold mb-4">Checkout</h1>
            <p className="text-gray-600 mb-6">Tidak ada item untuk dibayar. Silakan pilih produk terlebih dahulu.</p>
            <div className="flex gap-2">
                <Link href="/"><Button label="Kembali ke Beranda" color="secondary" /></Link>
                <Link href="/productlist"><Button label="Telusuri Produk" color="primary" /></Link>
            </div>
        </div>
      </div>
    );
  }

  // ---------------------------
  // Filter shippingOptions based on courierStatus (from dummy DB), then group
  // ---------------------------
  const filteredOptions = (shippingOptions ?? []).filter((opt) => {
    const code = (opt.code ?? "").toLowerCase();
    if (!code) {
      return courierStatus["other"] ?? true;
    }
    // if known courier present in status map, use it; otherwise fallback to 'other'
    if (Object.prototype.hasOwnProperty.call(courierStatus, code)) {
      return courierStatus[code];
    }
    return courierStatus["other"] ?? true;
  });

  // Build grouped options for rendering: { groupLabel: string, items: any[] }[]
  const groupedOptions = filteredOptions.reduce((acc: any[], opt: any) => {
    const grp = opt.group ?? COURIER_GROUPS[(opt.code ?? "").toLowerCase()] ?? "Other";
    let bucket = acc.find((g) => g.group === grp);
    if (!bucket) {
      bucket = { group: grp, items: [] as any[] };
      acc.push(bucket);
    }
    bucket.items.push(opt);
    return acc;
  }, [] as { group: string; items: any[] }[]);

  // disable "Buat Pesanan" when:
  // - no address selected OR
  // - not all poin and no shipping selected (or shippingCost === 0)
  const disableCreateOrder =
    !selectedAddress ||
    !selectedShipping ||
    shippingCost === 0 ||
    loading ||
    loadingXendit;

  return (
    <div className="pt-[80px] md:pt-[89px] lg:pt-[92px]">
      <div className="container mx-auto px-4 md:px-6 py-12">
          <h1 className="text-2xl font-bold mb-4">Pembayaran</h1>

          <div className="grid md:grid-cols-3 gap-6">
              <div className="md:col-span-2 space-y-4">
                  {/* Items */}
                  {items.map((it, idx) => (
                      <div key={idx} className="bg-white rounded-xl p-4 flex gap-4 items-center shadow">
                          <div className="w-20 h-20 rounded overflow-hidden flex-shrink-0 bg-gray-50">
                              {it.gambar ? <img src={`${it.gambar}`} alt={it.nama_produk} className="w-full h-full object-cover"/> : <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">No image</div>}
                          </div>

                          <div className="flex-1">
                              <div className="flex justify-between items-start">
                              <div>
                                  <div className="text-xs md:text-sm lg:text-md font-semibold leading-tight overflow-hidden text-ellipsis line-clamp-2">{it.nama_produk}</div>
                                  <div className="text-sm text-gray-600">{it.warna || ""} {it.ukuran ? `• ${it.ukuran}` : ""}</div>
                                  <div className="text-sm text-gray-600">Kode: {it.kode_varian}</div>
                              </div>
                              <div className="text-right">
                                  <div className="font-semibold">
                                    {String(it.jenis ?? "").toLowerCase() === "poin"
                                      ? `${formatDecimal(Number(it.unit_price || 0))} Poin`
                                      : formatPrice(it.unit_price)}
                                  </div>
                                  <div className="text-sm text-gray-600">x{it.qty}</div>
                              </div>
                              </div>

                              <div className="mt-3 text-sm text-gray-700">
                                  Subtotal: {String(it.jenis ?? "").toLowerCase() === "poin" ? `${formatDecimal(Number(it.subtotal || 0))} Poin` : formatPrice(it.subtotal)}
                              </div>
                          </div>
                      </div>
                  ))}

                  {/* Address */}
                  <div className="bg-white rounded-xl p-4 shadow space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="text-sm md:text-md lg:text-lg font-semibold">Alamat</div>
                        <button
                            className="text-sm md:text-md lg:text-lg font-semibold text-primary-500 cursor-pointer"
                            onClick={() => {
                                if (address.length === 0) {
                                  openModal({
                                    title: "Alamat",
                                    size: "md",
                                    mobileMode: "full",
                                    content: (<AddressForm />),
                                  });
                                } else {
                                  openModal({
                                    title: "Alamat",
                                    size: "md",
                                    mobileMode: "full",
                                    content: (<AddressList />),
                                  });
                                }
                            }}
                        >
                            {address.length === 0 ? "Tambah Alamat" : "Pilih Alamat"}
                        </button>
                    </div>
                    <div className="space-y-1">
                        {selectedAddress ? (
                          <>
                            <div className="text-sm text-black">{selectedAddress.nama_lengkap} • {selectedAddress.nomor_telepon}</div>
                            <div className="text-sm text-gray-600">{`${selectedAddress.detail_alamat}, ${selectedAddress.kelurahan ? `Des. ${selectedAddress.kelurahan}, ` : ""}${selectedAddress.kecamatan ? `Kec. ${selectedAddress.kecamatan}, ` : ""}${selectedAddress.kabupaten ? `Kab. ${selectedAddress.kabupaten}, ` : ""}${selectedAddress.provinsi ?? ""}`}</div>
                          </>
                        ) : (
                          <>
                            <div className="text-sm text-black">Belum ada alamat</div>
                            <div className="text-sm text-gray-600">Silakan tambah atau pilih alamat.</div>
                          </>
                        )}
                    </div>

                    {/* Ongkir */}
                    <div className="mt-2">
                      <div className="text-sm font-medium mb-2">Pilih Jasa Pengiriman</div>

                      <>
                        {loadingOngkir ? (
                          <div className="text-sm text-gray-600">Menghitung ongkir...</div>
                        ) : errorOngkir ? (
                          <div className="text-sm text-red-500">Gagal menghitung ongkir: {errorOngkir}</div>
                        ) : !shippingOptions || shippingOptions.length === 0 ? (
                          <div className="text-sm text-gray-600">Pilih alamat untuk melihat opsi pengiriman.</div>
                        ) : groupedOptions.length === 0 ? (
                          <div className="text-sm text-gray-600">Tidak ada layanan aktif berdasarkan status di database (dummy data saat ini).</div>
                        ) : (
                          <div className="space-y-3">
                            {groupedOptions.map((grp, gi) => {
                              const isOpen = !!openGroups[grp.group];
                              return (
                                <div key={gi} className="border border-neutral-200 rounded overflow-hidden">
                                  <button
                                    type="button"
                                    onClick={() => toggleGroup(grp.group)}
                                    className="w-full flex items-center justify-between px-3 py-2 bg-gray-100 hover:bg-gray-200"
                                    aria-expanded={isOpen}
                                    aria-controls={`group-${gi}`}
                                  >
                                    <div className="flex items-center gap-2">
                                      <div className="text-sm font-semibold text-gray-800">{grp.group}</div>
                                      <div className="text-xs text-gray-500">({grp.items.length} layanan)</div>
                                    </div>
                                    <div className="text-sm text-gray-600">{isOpen ? "▾" : "▸"}</div>
                                  </button>

                                  <div
                                    id={`group-${gi}`}
                                    aria-hidden={!isOpen}
                                    className={`${isOpen ? "block" : "hidden"} p-3 bg-white`}
                                  >
                                    <div className="space-y-2">
                                      {grp.items.map((opt: any, i: number) => (
                                        <label key={i} className="flex items-center justify-between gap-3 p-2 border border-neutral-200 rounded bg-white">
                                          <div className="flex-1">
                                            <div className="font-medium text-sm">{opt.name} • {opt.service}</div>
                                            <div className="text-xs text-gray-500">{opt.description} {opt.etd ? `• ETA: ${opt.etd}` : ""}</div>
                                          </div>
                                          <div className="flex items-center gap-3">
                                            <div className="font-semibold">{formatPrice(opt.cost)}</div>
                                            <input
                                              type="radio"
                                              name="shippingOption"
                                              checked={selectedShipping?.service === opt.service && selectedShipping?.code === opt.code}
                                              onChange={() => {
                                                // when user explicitly chooses, set selection
                                                setSelectedShipping(opt);
                                                setShippingCost(opt.cost);
                                              }}
                                            />
                                          </div>
                                        </label>
                                      ))}
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </>

                      <div className="flex justify-between items-center mt-4">
                        <div className="text-base font-semibold">Ongkos Kirim</div>
                        <div className="text-lg font-extrabold text-[#299A4D]">
                          {shippingCost ? formatPrice(shippingCost) : "-"}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Note */}
                  <div className="bg-white rounded-xl p-4 shadow">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Catatan untuk penjual (opsional)</label>
                      <InputField value={notes} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNotes(e.target.value)} placeholder="Contoh: Kirim jam kerja saja" />
                  </div>
              </div>

              <aside className="hidden lg:block space-y-4">
                  <div className="lg:sticky lg:top-[92px]">
                      <div className="bg-white rounded-xl shadow p-4">
                          <div className="text-base md:text-lg lg:text-xl font-semibold text-black">Ringkasan Pembayaran</div>
                          <div className="flex justify-between items-center mt-2">
                              <div className="text-sm text-gray-700">Subtotal</div>
                              <div className="font-semibold">
                                {isAllPoin ? `${formatDecimal(totalPoints)} Poin` : formatPrice(subtotalMoney)}
                              </div>
                          </div>

                          {/* shipping */}
                          <div className="flex justify-between items-center mt-2">
                              <div className="text-sm text-gray-700">Ongkir</div>
                              <div className="font-semibold">
                                {shippingCost ? formatPrice(shippingCost) : "-"}
                              </div>
                          </div>

                          <div className="flex justify-between items-center mt-4">
                              <div className="text-base font-semibold">Total</div>
                              <div className="text-lg font-extrabold text-[#299A4D]">
                                {isAllPoin ? `${formatDecimal(totalPoints)} Poin` : formatPrice((subtotalMoney || 0) + (shippingCost || 0))}
                              </div>
                          </div>

                          <div className="mt-4">
                              {!invoiceUrl ? (
                                <Button
                                  label="Buat Pesanan"
                                  color="primary"
                                  fullWidth
                                  onClick={placeOrder}
                                  disabled={disableCreateOrder || loading}
                                />
                              ) : (
                                <Button
                                  label="Lanjutkan Pembayaran"
                                  color="primary"
                                  fullWidth
                                  onClick={() => {
                                    window.location.href = invoiceUrl;
                                  }}
                                />
                              )}
                          </div>

                          <div className="mt-2">
                              <Button label="Kembali" color="secondary" fullWidth onClick={() => router.back()} />
                          </div>
                      </div>
                  </div>
              </aside>
          </div>
      </div>

      {/* mobile bottom bar */}
      <div className="fixed bottom-0 left-0 right-0 z-50 lg:hidden">
          <div className="container mx-auto">
              <div className=" bg-white/95 backdrop-blur-md border-t border-gray-200 shadow-md py-3 px-3 flex items-center justify-between gap-3" style={{ boxShadow: "0 -6px 20px rgba(0,0,0,0.06)" }}>
                  <div>
                      <div className="text-base font-semibold">Total</div>
                      <div className="text-lg font-extrabold text-[#299A4D]">
                        {isAllPoin ? `${formatDecimal(totalPoints)} Poin` : formatPrice((subtotalMoney || 0) + (shippingCost || 0))}
                      </div>
                  </div>
                  {!invoiceUrl ? (
                    <Button
                      label="Buat Pesanan"
                      color="primary"
                      onClick={placeOrder}
                      disabled={disableCreateOrder || loading}
                    />
                  ) : (
                    <Button
                      label="Lanjutkan Pembayaran"
                      color="primary"
                      onClick={() => {
                        window.location.href = invoiceUrl;
                      }}
                    />
                  )}
              </div>
          </div>
      </div>
    </div>
  );
}
