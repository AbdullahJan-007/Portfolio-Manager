"use client";

import { usePathname } from "next/navigation";
import { Icon } from "@/components/icons";

const PAGE_TITLES: Record<string, { title: string; subtitle: string }> = {
  "/admin": { title: "Admin Overview", subtitle: "Platform-wide stats across every user" },
  "/admin/users": { title: "All Users", subtitle: "Every registered account and their portfolio" },
};

interface AdminHeaderProps {
  onMenuClick: () => void;
}

export default function AdminHeader({ onMenuClick }: AdminHeaderProps) {
  const pathname = usePathname();
  const page =
    PAGE_TITLES[pathname] ??
    (pathname.startsWith("/admin/users")
      ? { title: "User Portfolio", subtitle: "Read-only view" }
      : { title: "Admin", subtitle: "" });

  return (
    <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center justify-between gap-4 border-b border-slate-200 bg-white/80 px-4 backdrop-blur-md sm:px-6">
      <div className="flex min-w-0 items-center gap-4">
        <button
          type="button"
          onClick={onMenuClick}
          className="lg:hidden rounded-md p-1.5 text-slate-500 hover:bg-slate-100 focus:outline-none"
          aria-label="Open sidebar"
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        <div className="min-w-0">
          <h1 className="truncate text-base font-semibold text-slate-900 sm:text-lg">
            {page.title}
          </h1>
          {page.subtitle && (
            <p className="hidden truncate text-xs text-slate-500 sm:block">{page.subtitle}</p>
          )}
        </div>
      </div>

      <span className="hidden shrink-0 items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700 ring-1 ring-amber-200 sm:inline-flex">
        <Icon name="shield" className="h-3.5 w-3.5" />
        Admin mode
      </span>
    </header>
  );
}
