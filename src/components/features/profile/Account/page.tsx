"use client";

import React, { useState, useEffect, useMemo } from 'react'

// Components
import { Button } from '@/components/ui/Button'
import InputField from '@/components/ui/InputField'

// Types
import { IUser } from '@/types/IUser'

// Icons
import { Bell, UserRound } from 'lucide-react'
import Toggle from '@/components/ui/Toggle'

interface AccountProps {
  user: IUser | null
}

const Account: React.FC<AccountProps> = ({ user }) => {
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
    <div className="grid grid-cols-12 gap-6">
      <div className="col-span-12 lg:col-span-12">
        <div className="lg:sticky lg:top-[160px]">
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
              <div className="col-span-12">
                <InputField
                  id="userName"
                  name="userName"
                  placeholder="Masukkan username"
                  label="Username"
                  autoComplete="userName"
                  value={userName}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUserName(e.target.value)}
                />
              </div>
              <div className="col-span-12">
                <InputField
                  id="email"
                  name="email"
                  placeholder="Masukkan email"
                  label="Email"
                  autoComplete="email"
                  type="password"
                  disabled
                  value={user?.email || ""}
                  // onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFullName(e.target.value)}
                />
              </div>
              <div className="col-span-12">
                <InputField
                  id="phoneNumber"
                  name="phoneNumber"
                  placeholder="Masukkan nomor telepon"
                  label="Nomor Telepon"
                  autoComplete="phoneNumber"
                  type="password"
                  disabled
                  value={user?.phone || ""}
                  // onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFullName(e.target.value)}
                />
              </div>
              {/* <div className="col-span-12">
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
              </div> */}
              <div className="col-span-12">
                <Button
                  type="submit"
                  label="Simpan Perubahan"
                  color={!isDirty ? "secondary" : "primary"}
                  fullWidth
                  // disabled={postingAddress || loginLoading}
                />
              </div>
            </form>
          </div>
        </div>
      </div>
      <div className="col-span-12 lg:col-span-12">
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
  )
}

export default Account