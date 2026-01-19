"use client";

import React, { useMemo, useRef, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

// Icons
import {
  // ClipboardClock,
  // BanknoteArrowUp,
  Package,
  Truck,
  CheckCircle,
  RotateCcw,
  ChevronLeft,
  Info,
} from "lucide-react";

// Components
import Pagination from "@/components/ui/Pagination";

// Types
import { OrderStatus } from "@/types/IOrder";

// Constants
import { ORDER_STATUS_MAP } from "@/constants/orderStatus";

// Context
import { useOrder } from "@/hooks/useOrder";
import { useOrderByIdUser } from "@/hooks/useOrderByIdUser";
import { useAuth } from "@/context/AuthContext";

// Utils
import { encryptOrderCode } from "@/utils/crypto";

const ITEMS_PER_PAGE = 8;

const OrdersPage = () => {
  const hydrated = useAuth((s) => s.hydrated);
  if (!hydrated) return null;

  const user = useAuth((state) => state.user);
  const { orders, loading: loadingOrders, error: errorOrders } = useOrder();
  const { ordersByIdUser, loading: loadingOrdersByIdUser, error: errorOrdersByIdUser } = useOrderByIdUser();

  const router = useRouter();
  const searchParams = useSearchParams();

  const statusKeys = Object.keys(
    ORDER_STATUS_MAP
  ) as OrderStatus[];
  
  const initialStatus =
    (searchParams.get("status") as OrderStatus) &&
    statusKeys.includes(searchParams.get("status") as OrderStatus)
      ? (searchParams.get("status") as OrderStatus)
      : "done";

  const [activeTab, setActiveTab] =
    useState<OrderStatus>(initialStatus);

  const [page, setPage] = useState(1);

  /** refs untuk auto-center tab */
  const tabRefs = useRef<Record<OrderStatus, HTMLButtonElement | null>>(
    {} as Record<OrderStatus, HTMLButtonElement | null>
  );

  /** auto scroll tab ke tengah */
  useEffect(() => {
    const el = tabRefs.current[activeTab];
    if (el) {
      el.scrollIntoView({
        behavior: "smooth",
        inline: "center",
        block: "nearest",
      });
    }
  }, [activeTab]);

  /** filter orders */
  const filteredOrders = useMemo(() => {
    if (!user) return [];

    return ordersByIdUser.filter(
      (order) =>
        order.user_id === user.id &&
        order.status === activeTab
    );
  }, [ordersByIdUser, activeTab, user]);

  /** pagination */
  const totalPages = Math.ceil(filteredOrders.length / ITEMS_PER_PAGE);

  const paginatedOrders = useMemo(() => {
    const start = (page - 1) * ITEMS_PER_PAGE;
    return filteredOrders.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredOrders, page]);

  const handleTabChange = (status: OrderStatus) => {
    setActiveTab(status);
    setPage(1);

    const params = new URLSearchParams(searchParams.toString());
    params.set("status", status);

    router.replace(`?${params.toString()}`, {
      scroll: false,
    });
  };

  useEffect(() => {
    const status = searchParams.get("status") as OrderStatus;

    if (status && statusKeys.includes(status)) {
      setActiveTab(status);
    }
  }, [searchParams]);

  return (
    <div className="pt-[80px] md:pt-[89px] lg:pt-[161px]">
      <div className="container mx-auto px-4 md:px-6 py-4 md:py-6 space-y-4">
        {/* Back */}
        <Link
          href="/profile"
          className="flex items-center text-sm font-medium text-neutral-600 hover:text-neutral-800"
        >
          <ChevronLeft className="h-5 w-5 mr-1" />
          Kembali ke Profil
        </Link>

        {/* HEADER */}
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold text-neutral-900">
            Pesanan Saya
          </h2>
        </div>

        {/* Tabs */}
        <div className="bg-white border-b border-neutral-200">
          <div className="flex overflow-x-auto no-scrollbar scroll-smooth">
            {statusKeys.map((key) => {
              const Icon = ORDER_STATUS_MAP[key].icon;
              const isActive = activeTab === key;

              return (
                <button
                  key={key}
                  ref={(el) => {
                    tabRefs.current[key] = el;
                  }}
                  onClick={() => handleTabChange(key)}
                  className={`flex-shrink-0 flex items-center px-4 py-3 text-sm font-medium whitespace-nowrap transition ${
                    isActive
                      ? "border-b-4 border-primary-500 text-primary-500"
                      : "text-gray-500 hover:bg-gray-100"
                  }`}
                >
                  <Icon className="mr-2 h-5 w-5" />
                  {ORDER_STATUS_MAP[key].label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Orders List */}
        <div className="space-y-3">
          {paginatedOrders.length === 0 ? (
            <p className="text-sm text-gray-500">Tidak ada pesanan</p>
          ) : (
            paginatedOrders.map((order) => {
              const encryptedOrder = encryptOrderCode(order.kode_order);
              return (
                <Link
                  href={`/orders/${encryptedOrder}`}
                  key={order.id}
                >
                  <div className="flex gap-4 p-4 border rounded-xl bg-white hover:shadow-sm transition cursor-pointer mb-4">
                    
                    {/* Thumbnail (fallback aman) */}
                    <img
                      src={`${process.env.NEXT_PUBLIC_API_BAITULLAH_MALL}/storage/${order.details[0].gambar}`}
                      alt={order.kode_order}
                      className="w-16 h-16 rounded-lg object-cover border"
                    />

                    {/* Info */}
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-neutral-900">
                        {order.kode_order}
                      </p>

                      <p className="text-xs text-neutral-500">
                        {order.details.length} item
                      </p>

                      <p className="text-xs text-neutral-400 mt-1">
                        {new Date(order.created_at).toLocaleDateString("id-ID")} •{" "}
                        {order.metode_pembayaran}
                      </p>
                    </div>

                    {/* Price & Status */}
                    <div className="text-right">
                      <p className="text-sm font-bold text-primary-500">
                        Rp{" "}
                        {order.final_harga.toLocaleString("id-ID")}
                      </p>

                      <span className="inline-block mt-1 text-xs px-2 py-1 rounded-full bg-neutral-100 text-neutral-600">
                        {ORDER_STATUS_MAP[order.status].label}
                      </span>
                    </div>
                  </div>
                </Link>
              )
            })
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        )}

        {/* Info */}
        <div className="flex items-start gap-3 rounded-lg bg-neutral-50 border border-neutral-200 p-4">
          <Info className="h-5 w-5 text-primary-500 mt-0.5 flex-shrink-0" />
          <p className="text-sm text-neutral-600 leading-relaxed">
            Ketuk salah satu pesanan untuk melihat detail lengkap, status pengiriman,
            serta informasi pembayaran dan alamat tujuan.
          </p>
        </div>
      </div>
    </div>
  );
};

export default OrdersPage;
