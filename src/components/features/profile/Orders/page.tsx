"use client";

import React, {
  useMemo,
  useState,
  useRef,
  useEffect,
} from "react";

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
import { DUMMY_ORDERS, Order, OrderStatus } from "@/types/IOrder";

// Constants
import { ORDER_STATUS_MAP } from "@/constants/orderStatus";
import Link from "next/link";

const ITEMS_PER_PAGE = 8;

const Orders = () => {
  const [activeTab, setActiveTab] = useState<OrderStatus>("6");
  const [page, setPage] = useState(1);

  const statusKeys = Object.keys(
    ORDER_STATUS_MAP
  ) as OrderStatus[];

  const filteredOrders = useMemo(() => {
    return DUMMY_ORDERS.filter(
      (order) => order.status === activeTab
    );
  }, [activeTab]);

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
          paginatedOrders.map((order) => (
            <Link href={`/orders/${order.order_number}`} key={order.id}>
              <div className="flex gap-4 p-4 border rounded-xl bg-white hover:shadow-sm transition cursor-pointer mb-4">
                {/* Thumbnail */}
                <img
                  src={order.items[0].thumbnail}
                  alt={order.items[0].name}
                  className="w-16 h-16 rounded-lg object-cover border"
                />

                {/* Info */}
                <div className="flex-1">
                  <p className="text-sm font-semibold text-neutral-900">
                    {order.order_number}
                  </p>

                  <p className="text-xs text-neutral-500">
                    {order.items[0].name}
                    {order.items.length > 1 &&
                      ` +${order.items.length - 1} item lainnya`}
                  </p>

                  <p className="text-xs text-neutral-400 mt-1">
                    {order.date} • {order.payment_method}
                  </p>
                </div>

                {/* Price & Status */}
                <div className="text-right">
                  <p className="text-sm font-bold text-primary-500">
                    Rp {order.total.toLocaleString("id-ID")}
                  </p>

                  <span className="inline-block mt-1 text-xs px-2 py-1 rounded-full bg-neutral-100 text-neutral-600">
                    {ORDER_STATUS_MAP[order.status].label}
                  </span>
                </div>
              </div>
            </Link>
          ))
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
      {paginatedOrders .length > 0 && (
        <div className="col-span-12">
          <div className="flex flex-col justify-center items-center gap-3 rounded-lg bg-neutral-50 border border-neutral-200 p-4 h-[290px]">
            <Info className="h-5 w-5 text-primary-500 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-neutral-600 leading-relaxed">
              Ketuk salah satu pesanan untuk melihat detail lengkap, status pengiriman,
              serta informasi pembayaran dan alamat tujuan.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;
