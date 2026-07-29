import Link from "next/link";
import { prisma } from "@/lib/db";
import { Icon, IconBox } from "@/components/icons";

type RecentUser = {
  id: string;
  email: string;
  createdAt: Date;
  profile: { fullName: string | null; avatarUrl: string | null } | null;
  _count: { skills: number; projects: number };
};

export default async function AdminOverviewPage() {
  const [userCount, projectCount, skillCount, categoryCount, recentUsers] =
    await Promise.all([
      prisma.user.count({ where: { role: "USER" } }),
      prisma.project.count(),
      prisma.skill.count(),
      prisma.projectCategory.count(),
      prisma.user.findMany({
        where: { role: "USER" },
        orderBy: { createdAt: "desc" },
        take: 5,
        select: {
          id: true,
          email: true,
          createdAt: true,
          profile: { select: { fullName: true, avatarUrl: true } },
          _count: { select: { skills: true, projects: true } },
        },
      }) as Promise<RecentUser[]>,
    ]);

  const statCards = [
    { label: "Total Users", value: userCount, icon: "users" as const, variant: "blue" as const },
    { label: "Total Projects", value: projectCount, icon: "projects" as const, variant: "violet" as const },
    { label: "Total Skills", value: skillCount, icon: "skills" as const, variant: "amber" as const },
    { label: "Total Categories", value: categoryCount, icon: "categories" as const, variant: "cyan" as const },
  ];

  return (
    <div className="animate-fade-in space-y-8">
      <div className="film-grain viewfinder relative overflow-hidden rounded-3xl bg-cinematic px-6 py-8 sm:px-8">
        <h2 className="relative z-10 text-2xl font-bold text-slate-900">
          Platform overview
        </h2>
        <p className="relative z-10 mt-1 text-slate-500">
          Aggregate stats across every registered user's portfolio.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {statCards.map((card) => (
          <div key={card.label} className="card p-6">
            <IconBox name={card.icon} size="lg" variant={card.variant} className="mb-4" />
            <p className="text-3xl font-bold text-slate-900">{card.value}</p>
            <p className="mt-1 text-sm text-slate-500">{card.label}</p>
          </div>
        ))}
      </div>

      <div className="card p-6">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-semibold text-slate-900">Recent signups</h3>
          <Link
            href="/admin/users"
            className="inline-flex items-center gap-1 text-sm font-medium text-brand-600 hover:text-brand-700"
          >
            View all users
            <Icon name="arrow-right" className="h-3.5 w-3.5" />
          </Link>
        </div>

        {recentUsers.length === 0 ? (
          <p className="mt-6 text-sm text-slate-500">No users have registered yet.</p>
        ) : (
          <ul className="mt-4 divide-y divide-slate-100">
            {recentUsers.map((u) => (
              <li key={u.id}>
                <Link
                  href={`/admin/users/${u.id}`}
                  className="flex items-center gap-3 rounded-xl px-2 py-3 transition-colors hover:bg-slate-50"
                >
                  {u.profile?.avatarUrl ? (
                    <div className="h-10 w-10 shrink-0 overflow-hidden rounded-full shadow-sm ring-2 ring-white">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={u.profile.avatarUrl}
                        alt={u.profile.fullName ?? u.email}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-gradient-to-br from-brand-500 to-accent-500 text-sm font-bold text-white">
                      {(u.profile?.fullName || u.email)[0]?.toUpperCase()}
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-slate-900">
                      {u.profile?.fullName || "Unnamed user"}
                    </p>
                    <p className="truncate text-xs text-slate-500">{u.email}</p>
                  </div>
                  <div className="hidden shrink-0 gap-4 text-xs text-slate-500 sm:flex">
                    <span>{u._count.skills} skills</span>
                    <span>{u._count.projects} projects</span>
                  </div>
                  <Icon name="arrow-right" className="h-4 w-4 shrink-0 text-slate-300" />
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
