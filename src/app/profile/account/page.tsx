"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/Button";
import InputField from "@/components/ui/InputField";
import Toggle from "@/components/ui/Toggle";
import { Bell, ChevronLeft, UserRound } from "lucide-react";
import Link from "next/link";

const AccountPage = () => {
  const user = useAuth((state) => state.user);

  const initialUserName = user?.name ?? "";

  const [userName, setUserName] = useState(initialUserName);
  const [isNotification, setIsNotification] = useState(false);

  // update state when user loaded async
  useEffect(() => {
    setUserName(initialUserName);
  }, [initialUserName]);

  const isDirty = useMemo(() => {
    return userName.trim() !== initialUserName.trim();
  }, [userName, initialUserName]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isDirty) return;

    // TODO: API update profile
    console.log("submit username:", userName);
  };

  return (
    <div className="pt-[80px] md:pt-[89px] lg:pt-[161px]">
      <div className="container mx-auto px-4 md:px-6 py-4 space-y-4">
        <Link
          href="/profile"
          className="flex items-center text-sm font-medium text-neutral-600 hover:text-neutral-800"
        >
          <ChevronLeft className="h-5 w-5 mr-1" />
          Kembali ke Profil
        </Link>

        <h2 className="text-lg font-semibold">Akun Saya</h2>

        <div className="grid grid-cols-12 gap-6">
          {/* INFO AKUN */}
          <div className="col-span-12 lg:col-span-7">
            <div className="bg-white border border-neutral-300 rounded-xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <UserRound className="h-5 w-5" />
                <h3 className="font-semibold">Info Akun</h3>
              </div>

              <form onSubmit={handleSubmit} className="grid grid-cols-12 gap-4">
                <div className="col-span-12 lg:col-span-6">
                  <InputField
                    id="userName"
                    name="userName"
                    label="Username"
                    value={userName}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUserName(e.target.value)}
                  />
                </div>

                <div className="col-span-12 lg:col-span-6">
                  <InputField
                    id="email"
                    label="Email"
                    type="password"
                    disabled
                    value={user?.email ?? ""}
                  />
                </div>

                <div className="col-span-12 lg:col-span-6">
                  <InputField
                    id="phone"
                    label="Nomor Telepon"
                    type="password"
                    disabled
                    value={user?.phone ?? ""}
                  />
                </div>

                <div className="col-span-12 lg:col-span-6">
                  <InputField
                    id="createdAt"
                    label="Bergabung Sejak"
                    disabled
                    value={
                      user
                        ? new Date(user.created_at).toLocaleDateString()
                        : ""
                    }
                  />
                </div>

                <div className="col-span-12">
                  <Button
                    type="submit"
                    label="Simpan Perubahan"
                    color={!isDirty ? "secondary" : "primary"}
                    fullWidth
                    disabled={!isDirty}
                  />
                </div>
              </form>
            </div>
          </div>

          {/* NOTIFICATION */}
          <div className="col-span-12 lg:col-span-5">
            <div className="bg-white border border-neutral-300 rounded-xl p-6 lg:sticky lg:top-[160px]">
              <div className="flex items-center gap-2 mb-4">
                <Bell className="h-5 w-5" />
                <h3 className="font-semibold">Preferensi Notifikasi</h3>
              </div>

              <Toggle
                checked={isNotification}
                onChange={setIsNotification}
                label="Email Notifikasi"
                placeholder="Aktifkan notifikasi email"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountPage;
