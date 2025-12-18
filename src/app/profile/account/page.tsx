"use client"

import React, { useState } from 'react'

// Components
import { Button } from '@/components/ui/Button'
import InputField from '@/components/ui/InputField'

// Context
import { useAuth } from "@/context/AuthContext";

// Types
import { IUser } from '@/types/IUser'

// Icons
import { Bell, ChevronLeft, UserRound } from 'lucide-react'
import Link from 'next/link';
import Toggle from '@/components/ui/Toggle';

const account = () => {
  const user = useAuth((state) => state.user);

  const [userName, setUserName] = useState("");
  const [isNotification, setIsNotification] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {}

  return (
    <div className="pt-[80px] md:pt-[89px] lg:pt-[161px]">
      <div className="container mx-auto px-4 md:px-6 py-4 md:py-6 lg:pb-0 pt-0 space-y-4">
        <Link href="/profile" className="flex items-center text-sm font-medium text-neutral-600 hover:text-neutral-800 transition-colors">
            <ChevronLeft className="h-5 w-5 mr-1" />
            Kembali ke Profil
        </Link>
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12 lg:col-span-7">
            <div className="bg-white rounded-xl border border-neutral-300 p-6">
              <div className="flex items-center gap-1 mb-4">
                <UserRound className="h-5 w-5" />
                <h1 className="text-md font-semibold">Info Akun</h1>
              </div>
              <form onSubmit={handleSubmit} className="grid grid-cols-12 gap-4">
                {/* <div className="col-span-12">
                  {user !== null ? (
                      <div className="flex justify-center items-center">
                          {user.profile_photo_path ? (
                              <img
                                  src={`${process.env.NEXT_PUBLIC_API_BAITULLAH}/storage/${user.profile_photo_path}`}
                                  className="w-34 h-34 rounded-full object-cover"
                                  alt="photo profile"
                              />
                          ) : (
                              <div className="w-34 h-34 rounded-full bg-gray-200 flex items-center justify-center">
                                  <span className="text-3xl text-gray-400">
                                      {user.name.charAt(0).toUpperCase()}
                                  </span>
                              </div>
                          )}
                      </div>
                  ) : (<></>)}
                </div> */}
                <div className="col-span-12 lg:col-span-6">
                  <InputField
                    id="userName"
                    name="userName"
                    placeholder="Masukkan username"
                    label="Username"
                    autoComplete="userName"
                    value={user?.name || userName}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUserName(e.target.value)}
                  />
                </div>
                <div className="col-span-12 lg:col-span-6">
                  <InputField
                    id="email"
                    name="email"
                    placeholder="Masukkan email"
                    label="Email"
                    autoComplete="email"
                    type="email"
                    disabled
                    value={user?.email || ""}
                    // onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFullName(e.target.value)}
                  />
                </div>
                <div className="col-span-12 lg:col-span-6">
                  <InputField
                    id="phoneNumber"
                    name="phoneNumber"
                    placeholder="Masukkan nomor telepon"
                    label="Nomor Telepon"
                    autoComplete="phoneNumber"
                    type="number"
                    disabled
                    value={user?.phone || ""}
                    // onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFullName(e.target.value)}
                  />
                </div>
                <div className="col-span-12 lg:col-span-6">
                  <InputField
                    id="createdAt"
                    name="createdAt"
                    placeholder="Bergabung sejak"
                    label="Bergabung Sejak"
                    autoComplete="createdAt"
                    disabled
                    value={user ? new Date(user.created_at).toLocaleDateString() : ""}
                    // onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFullName(e.target.value)}
                  />
                </div>
                <div className="col-span-12">
                  <Button
                    type="submit"
                    label="Simpan Perubahan"
                    color="primary"
                    fullWidth
                    // disabled={postingAddress || loginLoading}
                  />
                </div>
              </form>
            </div>
          </div>
          <div className="col-span-12 lg:col-span-5">
            <div className="lg:sticky lg:top-[160px]">
              <div className="bg-white rounded-xl border border-neutral-300 p-6">
                <div className="flex items-center gap-1 mb-4">
                  <Bell className="h-5 w-5" />
                  <h1 className="text-md font-semibold">Preferensi Notifikasi</h1>
                </div>
                <Toggle
                  checked={isNotification}
                  onChange={setIsNotification}
                  label="Email Notifikasi"
                  placeholder="Aktifkan notifikasi email untuk pembaruan akun dan penawaran khusus"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default account