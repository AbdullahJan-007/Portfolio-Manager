"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Icon, IconBox } from "@/components/icons";
import LoadingSpinner from "@/components/LoadingSpinner";

type AdminUser = {
  id: string;
  email: string;
  createdAt: string;
  profile: { fullName: string | null; title: string | null; avatarUrl: string | null } | null;
  _count: { skills: number; projects: number };
};

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[] | null>(null);
  const [search, setSearch] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/admin/users");
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to load users");
        if (!cancelled) setUsers(data.users);
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : "Failed to load users");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const filtered = useMemo(() => {
    if (!users) return [];
    const q = search.trim().toLowerCase();
    if (!q) return users;
    return users.filter(
      (u) =>
        u.email.toLowerCase().includes(q) ||
        u.profile?.fullName?.toLowerCase().includes(q) ||
        u.profile?.title?.toLowerCase().includes(q)
    );
  }, [users, search]);

  if (!users && !error) {
    return <LoadingSpinner className="py-20" label="Loading users…" />;
  }

  return (
    <div className="animate-fade-in space-y-6">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-amber-50 via-orange-50 to-white px-6 py-8 sm:px-8">
        <h2 className="text-2xl font-bold text-slate-900">All Users</h2>
        <p className="mt-1 text-slate-500">
          Every account registered on the platform. Click a user to view their
          full portfolio — read-only.
        </p>
      </div>

      <div className="relative max-w-md">
        <Icon name="search" className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name, email or title…"
          className="input pl-10"
        />
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {filtered.length === 0 && !error ? (
        <div className="card p-10 text-center">
          <IconBox name="users" size="lg" variant="slate" className="mx-auto mb-3" />
          <p className="text-sm text-slate-500">
            {users?.length === 0 ? "No users have registered yet." : "No users match your search."}
          </p>
        </div>
      ) : (
        <div className="card overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-slate-100 bg-slate-50/80 text-xs uppercase tracking-wider text-slate-500">
              <tr>
                <th className="px-5 py-3 font-medium">User</th>
                <th className="hidden px-5 py-3 font-medium sm:table-cell">Joined</th>
                <th className="hidden px-5 py-3 font-medium sm:table-cell">Skills</th>
                <th className="hidden px-5 py-3 font-medium sm:table-cell">Projects</th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((u) => (
                <tr key={u.id} className="transition-colors hover:bg-amber-50/40">
                  <td className="px-5 py-3.5">
                    <Link href={`/admin/users/${u.id}`} className="flex items-center gap-3">
                      {u.profile?.avatarUrl ? (
                        <div className="h-9 w-9 shrink-0 overflow-hidden rounded-full shadow-sm ring-2 ring-white">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={u.profile.avatarUrl}
                            alt={u.profile.fullName ?? u.email}
                            className="h-full w-full object-cover"
                          />
                        </div>
                      ) : (
                        <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-gradient-to-br from-amber-400 to-orange-500 text-xs font-bold text-white">
                          {(u.profile?.fullName || u.email)[0]?.toUpperCase()}
                        </div>
                      )}
                      <div className="min-w-0">
                        <p className="truncate font-medium text-slate-900">
                          {u.profile?.fullName || "Unnamed user"}
                        </p>
                        <p className="truncate text-xs text-slate-500">{u.email}</p>
                      </div>
                    </Link>
                  </td>
                  <td className="hidden px-5 py-3.5 text-slate-500 sm:table-cell">
                    {new Date(u.createdAt).toLocaleDateString()}
                  </td>
                  <td className="hidden px-5 py-3.5 text-slate-500 sm:table-cell">{u._count.skills}</td>
                  <td className="hidden px-5 py-3.5 text-slate-500 sm:table-cell">{u._count.projects}</td>
                  <td className="px-5 py-3.5 text-right">
                    <Link
                      href={`/admin/users/${u.id}`}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 transition-colors hover:border-amber-300 hover:bg-amber-50 hover:text-amber-700"
                    >
                      <Icon name="eye" className="h-3.5 w-3.5" />
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
