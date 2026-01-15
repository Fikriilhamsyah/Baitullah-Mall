"use client";
import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

// Components
import { Button } from "@/components/ui/Button";
import Account from "@/components/features/profile/Account/page";
import Orders from "@/components/features/profile/Orders/page";
import Address from "@/components/features/profile/Address/page";
import Voucher from "@/components/features/profile/Voucher/page";
import Setting from "@/components/features/profile/Setting/page";
import { useToast } from "@/components/ui/Toast";

// Context
import { useAuth } from "@/context/AuthContext";

// Hooks
import usePoin from "@/hooks/usePoin";

// Icons
import { Settings, UserRound, LogOut, Package, Tag, MapPin, ChevronRight, WalletMinimal, Camera } from "lucide-react";
import Link from "next/link";
import { formatPointsToRupiah } from "@/types/IUser";

const TABS = [
  { key: "account", label: "Info Akun", path: "/profile/account", icon: UserRound },
  { key: "orders", label: "Daftar Pesanan", path: "/profile/orders", icon: Package },
  { key: "address", label: "Daftar Alamat", path: "/profile/address", icon: MapPin },
//   { key: "voucher", label: "Voucher", path: "/profile/voucher", icon: Tag },
  { key: "setting", label: "Pengaturan", path: "/profile/setting", icon: Settings },
  { key: "logout", label: "Keluar", path: "/profile/logout", icon: LogOut },
];

export default function ProfilePage() {
  const hydrated = useAuth((s) => s.hydrated);
  if (!hydrated) return null;

  const searchParams = useSearchParams();
  const router = useRouter();

  const initialTab = searchParams.get("tab") || "account";
  const [activeTab, setActiveTab] = useState(initialTab);

  const { poin, loading: poinLoading, error: poinError, refetch } = usePoin();
  const user = useAuth((state) => state.user);

  const { showToast } = useToast();

  const renderContent = () => {
    switch (activeTab) {
      case "account":
        return <Account user={user} />;
      case "orders":
        return <Orders />;
      case "address":
        return <Address />;
      case "voucher":
        return <Voucher />;
      case "setting":
        return <Setting user={user} />;
      default:
        return null;
    }
  };

  const myPoinEntry = React.useMemo(() => {
    if (!user || poin.length === 0) return null;
    return poin.find(
        (p) => Number(p.id_users) === Number(user.id)
    ) ?? null;
    }, [poin, user]);

  const myPoinNumber = React.useMemo(() => {
    if (!hydrated || !user) return 0;

    const entry = poin.find(
        (p) => Number(p.id_users) === Number(user.id)
    );

    return entry ? Number(entry.total_score_sum) || 0 : 0;
    }, [hydrated, poin, user]);

  const handleLogout = () => {
    useAuth.getState().logout();
    showToast("Berhasil logout", "success");
    router.push("/");
  };

  const changeTab = (tab: string) => {
    setActiveTab(tab);
    router.replace(`?tab=${tab}`, { scroll: false });
  };

  return (
    <div>
        <div className="relative bg-[#276E42] py-10 pt-[120px] md:pt-[89px] lg:pt-[172px]">
            <div className="container mx-auto px-4 md:px-6 pb-16">
                <h1 className="text-2xl font-bold text-white mb-2">Profil</h1>
                <p className="text-sm text-white">Kelola akun & preferensi</p>
            </div>
            <div className="absolute inset-x-0 top-full -translate-y-1/2 lg:top-auto lg:translate-x-0 lg:-translate-y-[36px]">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="flex justify-center lg:justify-start items-center w-30 h-30 rounded-full mx-auto lg:mx-0">
                        <div className="w-28 h-28 bg-neutral-200 rounded-full">
                            {user !== null ? (
                                <div className="flex flex-col items-center gap-3">
                                    {/* Avatar wrapper */}
                                    <div className="flex items-center justify-center w-32 h-32 bg-white rounded-full shadow-sm">
                                        {user.profile_photo_path ? (
                                        <img
                                            src={`${process.env.NEXT_PUBLIC_API_BAITULLAH}/storage/${user.profile_photo_path}`}
                                            className="w-28 h-28 rounded-full object-cover"
                                            alt="photo profile"
                                        />
                                        ) : (
                                        <div className="w-28 h-28 rounded-full bg-gray-200 flex items-center justify-center">
                                            <span className="text-3xl text-gray-400">
                                            {user.name.charAt(0).toUpperCase()}
                                            </span>
                                        </div>
                                        )}
                                    </div>

                                    {/* Action */}
                                    <button className="flex items-center gap-2 text-sm text-neutral-600 hover:text-neutral-900 transition">
                                        <Camera className="h-5 w-5" />
                                        <span>Ubah Foto</span>
                                    </button>
                                    </div>

                            ) : (<></>)}
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div className="container mx-auto px-4 md:px-6 py-10">
            {user !== null ? (
                <h1 className="block lg:hidden text-md lg:text-2xl font-bold text-center md:text-start mb-6 mt-20 md:mt-18 lg:mt-16">{user.name}</h1>
            ) : (<></>)}
            <div className="grid grid-cols-12 gap-0 lg:gap-6">
                {/* Sidebar / Nav Tabs */}
                {/* Desktop */}
                <aside className="col-span-12 lg:col-span-3 mt-0 md:mt-18 lg:mt-16">
                    <div className="lg:sticky lg:top-[160px]">
                        {user !== null ? (
                            <h1 className="hidden lg:block text-md lg:text-2xl font-bold text-center md:text-start mb-6">{user.name}</h1>
                        ) : (<></>)}
                        <div className="bg-white rounded-0 lg:rounded-xl border-b border-neutral-200 lg:border lg:border-primary-300 px-4 py-2 mb-0 lg:mb-4">
                            <div className="flex justify-between">
                                <div className="flex items-center gap-1">
                                    <WalletMinimal className="mr-2 lg:mr-3 h-5 w-5" />
                                    <h1 className="text-md font-semibold">Poin Anda</h1>
                                </div>
                                {poinLoading ? (
                                    <p className="text-sm text-gray-500 mt-1">Memuat poin...</p>
                                ) : poinError ? (
                                    <p className="text-sm text-red-500 mt-1">Gagal memuat poin</p>
                                ) : myPoinEntry ? (
                                <p className="text-base font-bold text-green-600 mt-1">
                                    {formatPointsToRupiah(myPoinNumber)} Poin
                                </p>
                                ) : (
                                    <p className="text-sm text-gray-500 mt-1">0 Poin</p>
                                )}
                            </div>
                        </div>
                        <div className="hidden lg:block bg-white rounded-xl border border-primary-300 p-3 space-y-1">
                            {TABS.map((tab) => (
                                <button
                                    key={tab.key}
                                    onClick={() => {
                                        if (tab.key === "logout") {
                                            handleLogout();
                                            return;
                                        }
                                        changeTab(tab.key);
                                    }}
                                    className={`flex items-center w-full text-left px-4 py-2 rounded-full text-sm font-medium transition cursor-pointer ${
                                        activeTab === tab.key
                                        ? "bg-primary-500 text-white"
                                        : "hover:bg-gray-100 text-gray-700"
                                    }`}
                                >
                                    <tab.icon className="mr-3 h-5 w-5" />
                                    {tab.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </aside>

                {/* Mobile */}
                <aside className="block lg:hidden col-span-12 lg:col-span-3">
                    <div>
                        {TABS.map((tab) => (
                            <Link
                                href={tab.path}
                                key={tab.key}
                                onClick={() => {
                                    if (tab.key === "logout") {
                                        handleLogout()
                                        return;
                                    }
                                    setActiveTab(tab.key);
                                }}
                                className="flex justify-between items-center w-full text-left px-4 py-2 text-sm font-medium border-b border-neutral-200 cursor-pointer"
                            >
                                <div className="flex items-center">
                                    <tab.icon className="mr-3 h-5 w-5" />
                                    {tab.label}
                                </div>
                                <ChevronRight className="h-5 w-5 text-neutral-400" />
                            </Link>
                        ))}
                    </div>
                </aside>

                {/* Content */}
                <section className="hidden lg:block col-span-12 lg:col-span-9">
                    <div className="lg:sticky lg:top-[160px]">
                        {renderContent()}
                    </div>
                </section>
            </div>
        </div>
    </div>
  );
}
