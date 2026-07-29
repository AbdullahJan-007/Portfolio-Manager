"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { Icon, IconBox } from "@/components/icons";

const nav = [
  { href: "/admin", label: "Overview", icon: "dashboard" as const },
  { href: "/admin/users", label: "All Users", icon: "users" as const },
];

interface AdminSidebarProps {
  email: string;
  onClose?: () => void;
}

export default function AdminSidebar({ email, onClose }: AdminSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);

  async function logout() {
    setLoggingOut(true);
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  return (
    <aside className="flex h-full w-full flex-col overflow-y-auto bg-white">
      {/* Logo / brand */}
      <div className="flex h-16 shrink-0 items-center justify-between border-b border-slate-200 px-5">
        <div className="flex items-center gap-2.5 font-bold text-slate-900">
          <IconBox name="logo" size="md" variant="brand" />
          <div className="flex flex-col leading-none">
            <span className="text-base gradient-text">Portfolio Manager</span>
            <span className="mt-1 inline-flex w-fit items-center gap-1 rounded-full bg-amber-100 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-amber-700">
              <Icon name="shield" className="h-2.5 w-2.5" />
              Admin
            </span>
          </div>
        </div>

        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="lg:hidden rounded-md p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
            aria-label="Close sidebar"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4">
        <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
          Menu
        </p>
        <ul className="space-y-0.5">
          {nav.map((item) => {
            const active =
              item.href === "/admin"
                ? pathname === item.href
                : pathname.startsWith(item.href);
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={onClose}
                  className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-150 ${
                    active
                      ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-sm"
                      : "text-slate-600 hover:translate-x-0.5 hover:bg-slate-100 hover:text-slate-900"
                  }`}
                >
                  <span className={active ? "text-white" : "text-slate-400"}>
                    <Icon name={item.icon} className="h-5 w-5" />
                  </span>
                  {item.label}
                  {active && (
                    <span className="ml-auto h-1.5 w-1.5 rounded-full bg-white/70" />
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* User info + logout */}
      <div className="border-t border-slate-200 p-4">
        <div className="mb-3 flex items-center gap-3 rounded-xl bg-slate-50 px-3 py-2.5">
          <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-gradient-to-br from-amber-500 to-orange-500 text-sm font-bold text-white shadow-sm">
            <Icon name="shield" className="h-4 w-4" />
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-slate-900">Administrator</p>
            <p className="truncate text-xs text-slate-500">{email}</p>
          </div>
        </div>

        <button
          onClick={logout}
          disabled={loggingOut}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          {loggingOut ? "Logging out…" : "Log out"}
        </button>
      </div>
    </aside>
  );
}
