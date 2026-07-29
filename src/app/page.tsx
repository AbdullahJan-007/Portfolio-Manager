import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { BrandLogo, Icon, IconBox } from "@/components/icons";

export default async function HomePage() {
  const user = await getCurrentUser();
  const isAdmin = user?.role === "ADMIN";
  const homeHref = user ? (isAdmin ? "/admin" : "/dashboard") : "/register";
  const homeLabel = user ? (isAdmin ? "Open Admin Panel" : "Open Dashboard") : "Create your account";

  const features = [
    {
      title: "Profile & About",
      desc: "Maintain your personal info, headline, bio and contact details in one place.",
      icon: "profile" as const,
      variant: "blue" as const,
    },
    {
      title: "Skills",
      desc: "Add, update and remove skills with proficiency levels and categories.",
      icon: "skills" as const,
      variant: "amber" as const,
    },
    {
      title: "Projects",
      desc: "Showcase your work with live demos, source links, tags and images.",
      icon: "projects" as const,
      variant: "violet" as const,
    },
    {
      title: "Categories",
      desc: "Organize your projects into clean, filterable categories.",
      icon: "categories" as const,
      variant: "cyan" as const,
    },
    {
      title: "Live Preview",
      desc: "See exactly how your public portfolio looks, updated in real time.",
      icon: "preview" as const,
      variant: "rose" as const,
    },
    {
      title: "Secure by default",
      desc: "Hashed passwords, signed sessions, and route-level auth guards.",
      icon: "shield" as const,
      variant: "emerald" as const,
    },
  ];

  const steps = [
    {
      n: "01",
      title: "Create your account",
      desc: "Sign up in seconds with just an email and password — no credit card, no fuss.",
    },
    {
      n: "02",
      title: "Fill in your portfolio",
      desc: "Add your profile, skills and projects through a clean, guided dashboard.",
    },
    {
      n: "03",
      title: "Share your preview",
      desc: "Your live preview updates instantly as you edit — always ready to share.",
    },
  ];

  return (
    <main className="bg-white">
      {/* ============================= HERO ============================= */}
      <div className="film-grain relative isolate overflow-hidden bg-cinematic">
        {/* Decorative pastel gradient orbs */}
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="blob top-[-8rem] left-[-6rem] h-[26rem] w-[26rem] animate-blob bg-brand-400/25" />
          <div className="blob top-[4rem] right-[-8rem] h-[24rem] w-[24rem] animate-blob bg-accent-400/25 [animation-delay:2s]" />
          <div className="blob bottom-[-12rem] left-[25%] h-[24rem] w-[24rem] animate-blob bg-fuchsia-300/25 [animation-delay:4s]" />
        </div>

        <header className="relative z-10 mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
          <Link href="/">
            <BrandLogo className="text-lg" />
          </Link>
          <nav className="flex items-center gap-2">
            {user ? (
              <Link href={homeHref} className="btn-primary">
                {isAdmin ? "Open Admin Panel" : "Go to Dashboard"}
                <Icon name="arrow-right" className="h-4 w-4" />
              </Link>
            ) : (
              <>
                <Link href="/login" className="btn-secondary">
                  Log in
                </Link>
                <Link href="/register" className="btn-primary">
                  Get started
                  <Icon name="arrow-right" className="h-4 w-4" />
                </Link>
              </>
            )}
          </nav>
        </header>

        <section className="relative z-10 mx-auto max-w-5xl px-6 pb-28 pt-16 text-center sm:pt-24">
          <span className="viewfinder glass-cinema animate-fade-in inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium text-slate-600">
            <Icon name="sparkle" className="h-4 w-4 text-brand-500" />
            Build &amp; manage your developer portfolio
          </span>

          <h1 className="animate-fade-in-up mx-auto mt-8 max-w-3xl text-4xl font-extrabold tracking-tight text-slate-900 sm:text-6xl">
            Your portfolio,{" "}
            <span className="gradient-text">fully under control</span>
          </h1>

          <p className="animate-fade-in-up mx-auto mt-6 max-w-2xl text-lg text-slate-500 [animation-delay:100ms]">
            A complete portfolio management system. Create an account and manage
            your personal information, skills and projects through a clean,
            interactive dashboard — then share a live preview that updates the
            moment you save.
          </p>

          <div className="animate-fade-in-up mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row [animation-delay:200ms]">
            <Link
              href={homeHref}
              className="btn-primary w-full px-6 py-3 text-base sm:w-auto"
            >
              {homeLabel}
              <Icon name="arrow-right" className="h-4 w-4" />
            </Link>
            <Link
              href={user ? (isAdmin ? "/admin/users" : "/dashboard/projects") : "/login"}
              className="btn-secondary w-full px-6 py-3 text-base sm:w-auto"
            >
              {user ? (isAdmin ? "View all users" : "Manage projects") : "I already have an account"}
            </Link>
          </div>

          <div className="animate-fade-in-up mt-16 flex flex-wrap items-center justify-center gap-x-10 gap-y-4 text-sm text-slate-400 [animation-delay:300ms]">
            <span className="inline-flex items-center gap-2">
              <Icon name="zap" className="h-4 w-4 text-brand-500" />
              Next.js App Router
            </span>
            <span className="inline-flex items-center gap-2">
              <Icon name="shield" className="h-4 w-4 text-brand-500" />
              Hashed passwords &amp; signed sessions
            </span>
            <span className="inline-flex items-center gap-2">
              <Icon name="layers" className="h-4 w-4 text-brand-500" />
              PostgreSQL + Prisma
            </span>
          </div>

          {/* Cinematic preview frame — a soft, elevated glass "screen" mockup */}
          <div className="viewfinder animate-scale-in relative mx-auto mt-20 max-w-3xl [animation-delay:250ms]">
            <div className="glass-cinema overflow-hidden rounded-3xl shadow-glow-lg">
              <div className="flex items-center gap-1.5 border-b border-slate-100 bg-white/80 px-4 py-3">
                <span className="h-2.5 w-2.5 rounded-full bg-rose-300" />
                <span className="h-2.5 w-2.5 rounded-full bg-amber-300" />
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-300" />
                <span className="ml-3 text-xs text-slate-400">your-portfolio.app/preview</span>
              </div>
              <div className="grid gap-4 bg-gradient-to-br from-white via-brand-50/40 to-accent-50/40 p-6 sm:grid-cols-3">
                <div className="card p-4 text-left">
                  <IconBox name="profile" size="sm" variant="blue" className="mb-2" />
                  <div className="h-2 w-3/4 rounded-full bg-slate-200" />
                  <div className="mt-1.5 h-2 w-1/2 rounded-full bg-slate-100" />
                </div>
                <div className="card p-4 text-left">
                  <IconBox name="skills" size="sm" variant="amber" className="mb-2" />
                  <div className="h-2 w-3/4 rounded-full bg-slate-200" />
                  <div className="mt-1.5 h-2 w-1/2 rounded-full bg-slate-100" />
                </div>
                <div className="card p-4 text-left">
                  <IconBox name="projects" size="sm" variant="violet" className="mb-2" />
                  <div className="h-2 w-3/4 rounded-full bg-slate-200" />
                  <div className="mt-1.5 h-2 w-1/2 rounded-full bg-slate-100" />
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* ============================ FEATURES ============================ */}
      <section className="relative bg-white py-24">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Everything your portfolio needs
            </h2>
            <p className="mt-4 text-slate-500">
              One dashboard for your profile, skills, and projects — with a live
              preview so you always know what visitors will see.
            </p>
          </div>

          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f, i) => (
              <div
                key={f.title}
                className="card card-hover animate-fade-in-up p-6 text-left"
                style={{ animationDelay: `${i * 60}ms` }}
              >
                <IconBox name={f.icon} size="lg" variant={f.variant} className="mb-4" />
                <h3 className="text-lg font-semibold text-slate-900">{f.title}</h3>
                <p className="mt-2 text-sm text-slate-500">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================= HOW IT WORKS ========================= */}
      <section className="border-t border-slate-100 bg-gradient-to-b from-slate-50/80 to-white py-24">
        <div className="mx-auto max-w-5xl px-6">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Live in minutes, not hours
            </h2>
            <p className="mt-4 text-slate-500">
              Three simple steps between you and a portfolio you&apos;re proud to
              share.
            </p>
          </div>

          <div className="relative mt-14 grid gap-8 sm:grid-cols-3">
            <div className="absolute left-0 right-0 top-8 hidden h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent sm:block" />
            {steps.map((step) => (
              <div key={step.n} className="relative text-center">
                <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-white text-lg font-bold text-brand-600 shadow-card ring-1 ring-slate-200">
                  {step.n}
                </div>
                <h3 className="mt-5 text-base font-semibold text-slate-900">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm text-slate-500">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================== CTA ============================== */}
      <section className="film-grain relative overflow-hidden bg-cinematic py-20">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="blob left-1/2 top-1/2 h-[28rem] w-[28rem] -translate-x-1/2 -translate-y-1/2 animate-blob bg-brand-400/20" />
        </div>
        <div className="relative mx-auto max-w-3xl px-6 text-center">
          <h2 className="text-3xl font-bold text-slate-900 sm:text-4xl">
            Ready to build your portfolio?
          </h2>
          <p className="mt-4 text-slate-500">
            It&apos;s free to get started. Set up your profile, add your first
            project, and share your preview link today.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href={homeHref}
              className="btn-primary px-6 py-3 text-base"
            >
              {homeLabel}
              <Icon name="arrow-right" className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <footer className="border-t border-slate-100 bg-white py-8 text-center text-sm text-slate-400">
        Portfolio Management System — built with Next.js, Prisma &amp; PostgreSQL.
      </footer>
    </main>
  );
}
