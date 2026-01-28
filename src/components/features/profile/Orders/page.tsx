"use client";

import React, {
  useMemo,
  useState,
  useRef,
  useEffect,
} from "react";
import Link from "next/link";

import { useRouter } from "next/router";

// Icons
import {
  // ClipboardClock,
  // BanknoteArrowUp,
  Package,
  Truck,
  CheckCircle,
  RotateCcw,
  Info,
} from "lucide-react";

// Components
import Pagination from "@/components/ui/Pagination";

// Types
import { Order, OrderStatus } from "@/types/IOrder";

// Constants
import { ORDER_STATUS_MAP } from "@/constants/orderStatus";

// Hook
import { useOrder } from "@/hooks/useOrder";
import { useOrderByIdUser } from "@/hooks/useOrderByIdUser";
import { useAuth } from "@/context/AuthContext";

// Utils
import { encryptOrderCode } from "@/utils/crypto";

const ITEMS_PER_PAGE = 8;

const Orders = () => {
  const hydrated = useAuth((s) => s.hydrated);
  if (!hydrated) return null;
  const router = useRouter();
  
  const { query: routerQuery, isReady } = router;

  const getParam = (key: string): string | null => {
    if (!isReady) return null;
    const value = routerQuery[key];
    if (!value) return null;
    return Array.isArray(value) ? value[0] : String(value);
  };

  const user = useAuth((state) => state.user);
  const { orders, loading: loadingOrders, error: errorOrders } = useOrder();
  const { ordersByIdUser, loading: loadingOrdersByIdUser, error: errorOrdersByIdUser } = useOrderByIdUser();

  const statusKeys = Object.keys(
    ORDER_STATUS_MAP
  ) as OrderStatus[];

  const statusParam = getParam("status") as OrderStatus | null;
  
  const initialStatus: OrderStatus =
    statusParam && statusKeys.includes(statusParam)
      ? statusParam
      : "done";

  const [activeTab, setActiveTab] =
    useState<OrderStatus>(initialStatus);
  
  const [page, setPage] = useState(1);

  const filteredOrders = useMemo(() => {
    if (!user) return [];

    return ordersByIdUser.filter(
      (order) =>
        order.user_id === user.id &&
        order.status === activeTab
    );
  }, [ordersByIdUser, activeTab, user]);

  const totalPages = Math.ceil(
    filteredOrders.length / ITEMS_PER_PAGE
  );

  const paginatedOrders = useMemo(() => {
    const start = (page - 1) * ITEMS_PER_PAGE;
    return filteredOrders.slice(
      start,
      start + ITEMS_PER_PAGE
    );
  }, [filteredOrders, page]);

  const handleTabChange = (status: OrderStatus) => {
    setActiveTab(status);
    setPage(1);

    const params = new URLSearchParams(router.asPath.split("?")[1] || "");
    params.set("status", status);

    router.replace(`?${params.toString()}`, undefined, {
      scroll: false,
      shallow: true,
    });
  };

  const tabsContainerRef = useRef<HTMLDivElement | null>(
    null
  );

  const tabRefs = useRef<
    Record<OrderStatus, HTMLButtonElement | null>
  >({} as Record<OrderStatus, HTMLButtonElement | null>);

  useEffect(() => {
    const container = tabsContainerRef.current;
    const tab = tabRefs.current[activeTab];

    if (!container || !tab) return;

    const containerWidth = container.offsetWidth;
    const tabWidth = tab.offsetWidth;

    const tabLeft =
      tab.offsetLeft - container.offsetLeft;

    const scrollTo =
      tabLeft -
      containerWidth / 2 +
      tabWidth / 2;

    container.scrollTo({
      left: scrollTo,
      behavior: "smooth",
    });
  }, [activeTab]);

  useEffect(() => {
    const status = getParam("status") as OrderStatus | null;

    if (status && statusKeys.includes(status)) {
      setActiveTab(status);
    }
  }, [router.query, isReady]);

  return (
    <div className="grid grid-cols-12 gap-0 lg:gap-6">
      {/* Tabs */}
      <div className="col-span-12">
        <div
          ref={tabsContainerRef}
          className="flex overflow-x-auto no-scrollbar border-b border-neutral-200 scroll-smooth"
        >
          {statusKeys.map((key) => {
            const Icon =
              ORDER_STATUS_MAP[key].icon;

            return (
              <button
                key={key}
                ref={(el) => {
                  tabRefs.current[key] = el;
                }}
                onClick={() =>
                  handleTabChange(key)
                }
                className={`flex-shrink-0 flex items-center px-4 py-3 text-sm font-medium whitespace-nowrap transition ${
                  activeTab === key
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

      {/* Content */}
      <div className="col-span-12 space-y-3">
        {paginatedOrders.length === 0 ? (
          <p className="text-sm text-gray-500">
            Tidak ada pesanan
          </p>
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
        <div className="col-span-12">
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </div>
      )}

      {/* Info */}
      <div className="col-span-12">
        <div className="flex flex-col justify-center items-center gap-3 rounded-lg bg-neutral-50 border border-neutral-200 p-4 h-[290px]">
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

export default Orders;
