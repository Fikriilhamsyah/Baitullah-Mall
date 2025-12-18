"use client"

import React, { useMemo, useState } from 'react'

import Link from 'next/link'

// Icons
import { BanknoteArrowUp, BanknoteX, ChevronLeft, ClipboardClock, Package, PackageX } from 'lucide-react'

// Components
import Pagination from "@/components/ui/Pagination";

// Types
import { DUMMY_ORDERS, Order } from "@/types/IOrder";

const ORDER_STATUS = [
  { key: 'pending', label: 'Pending', icon: ClipboardClock },
  { key: 'success', label: 'Success', icon: Package },
  { key: 'paid', label: 'Paid', icon: BanknoteArrowUp },
  { key: 'expired', label: 'Expired', icon: PackageX },
  { key: 'cancelled', label: 'Cancelled', icon: BanknoteX },
];

const ITEMS_PER_PAGE = 8;

const orders = () => {
  const [activeTab, setActiveTab] = useState("success");
  const [page, setPage] = useState(1);

  // 🔍 Filter by status
  const filteredOrders = useMemo(() => {
    return DUMMY_ORDERS.filter((o) => o.status === activeTab);
  }, [activeTab]);

  // 📄 Pagination
  const totalPages = Math.ceil(filteredOrders.length / ITEMS_PER_PAGE);

  const paginatedOrders = useMemo(() => {
    const start = (page - 1) * ITEMS_PER_PAGE;
    return filteredOrders.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredOrders, page]);

  // Reset page when tab changes
  const handleTabChange = (key: Order["status"]) => {
    setActiveTab(key);
    setPage(1);
  };

  return (
    <div className="pt-[80px] md:pt-[89px] lg:pt-[161px]">
      <div className="container mx-auto px-4 md:px-6 py-4 md:py-6 lg:pb-0 pt-0 space-y-4">
        <Link href="/profile" className="flex items-center text-sm font-medium text-neutral-600 hover:text-neutral-800 transition-colors">
            <ChevronLeft className="h-5 w-5 mr-1" />
            Kembali ke Profil
        </Link>
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12">
            <div className="bg-white">
              <div className="flex overflow-x-auto border-b border-neutral-200">
                {ORDER_STATUS.map((status) => (
                  <button
                    key={status.key}
                    onClick={() => setActiveTab(status.key)}
                    className={`flex-shrink-0 items-center px-4 py-2 text-xs font-medium transition cursor-pointer ${
                      activeTab === status.key
                        ? "border-b-4 border-primary-500 text-primary-500"
                        : "hover:bg-gray-100 text-gray-500"
                    }`}
                  >
                    <status.icon className="mr-1 h-5 w-5 inline-block" />
                    {status.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="col-span-12 space-y-3">
            {paginatedOrders.length === 0 ? (
                <p className="text-sm text-gray-500">Tidak ada pesanan</p>
              ) : (
                paginatedOrders.map((order) => (
                  <div
                    key={order.id}
                    className="flex justify-between items-center p-4 border rounded-lg bg-white"
                  >
                    <div>
                      <p className="text-sm font-semibold">{order.order_number}</p>
                      <p className="text-xs text-gray-500">{order.date}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-primary-500">
                        Rp {order.total.toLocaleString("id-ID")}
                      </p>
                      <p className="text-xs capitalize text-gray-500">
                        {order.status}
                      </p>
                    </div>
                  </div>
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
        </div>
      </div>
    </div>
  )
}

export default orders