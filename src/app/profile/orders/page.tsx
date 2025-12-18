"use client";

import React, { useMemo, useRef, useEffect, useState } from "react";
import Link from "next/link";

// Icons
import {
  ClipboardClock,
  BanknoteArrowUp,
  Package,
  Truck,
  CheckCircle,
  RotateCcw,
  ChevronLeft,
} from "lucide-react";

// Components
import Pagination from "@/components/ui/Pagination";

// Types
import { DUMMY_ORDERS, OrderStatus } from "@/types/IOrder";

// Constants
import { ORDER_STATUS_MAP } from "@/constants/orderStatus";

const ITEMS_PER_PAGE = 8;

const OrdersPage = () => {
  /** default tab: Selesai */
  const [activeTab, setActiveTab] = useState<OrderStatus>("6");
  const [page, setPage] = useState(1);

  const statusKeys = Object.keys(ORDER_STATUS_MAP) as OrderStatus[];

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
    return DUMMY_ORDERS.filter((o) => o.status === activeTab);
  }, [activeTab]);

  /** pagination */
  const totalPages = Math.ceil(filteredOrders.length / ITEMS_PER_PAGE);

  const paginatedOrders = useMemo(() => {
    const start = (page - 1) * ITEMS_PER_PAGE;
    return filteredOrders.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredOrders, page]);

  const handleTabChange = (key: OrderStatus) => {
    setActiveTab(key);
    setPage(1);
  };

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
            paginatedOrders.map((order) => (
              <div
                key={order.id}
                className="flex justify-between items-center p-4 border rounded-lg bg-white"
              >
                <div>
                  <p className="text-sm font-semibold">
                    {order.order_number}
                  </p>
                  <p className="text-xs text-gray-500">{order.date}</p>
                </div>

                <div className="text-right">
                  <p className="text-sm font-bold text-primary-500">
                    Rp {order.total.toLocaleString("id-ID")}
                  </p>
                  <p className="text-xs text-gray-500">
                    {ORDER_STATUS_MAP[order.status].label}
                  </p>
                </div>
              </div>
            ))
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
      </div>
    </div>
  );
};

export default OrdersPage;
