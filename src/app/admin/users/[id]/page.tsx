"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Icon, IconBox } from "@/components/icons";
import LoadingSpinner from "@/components/LoadingSpinner";

type AdminUserDetail = {
  user: { id: string; email: string; createdAt: string };
  profile: {
    fullName: string;
    title: string | null;
    avatarUrl: string | null;
    location: string | null;
    bio: string | null;
    contactEmail: string | null;
    phone: string | null;
    website: string | null;
    github: string | null;
    linkedin: string | null;
    twitter: string | null;
  } | null;
  skills: { id: string; name: string; category: string | null; level: number }[];
  projects: {
    id: string;
    title: string;
    description: string | null;
    category: string | null;
    url: string | null;
    repoUrl: string | null;
    imageUrl: string | null;
    tags: string | null;
  }[];
  categories: { id: string; name: string }[];
};

function tagList(tags: string | null): string[] {
  if (!tags) return [];
  return tags.split(",").map((t) => t.trim()).filter(Boolean);
}

export default function AdminUserDetailPage() {
  const params = useParams<{ id: string }>();
  const [data, setData] = useState<AdminUserDetail | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`/api/admin/users/${params.id}`);
        const json = await res.json();
        if (!res.ok) throw new Error(json.error || "Failed to load user");
        if (!cancelled) setData(json);
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : "Failed to load user");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [params.id]);

  if (!data && !error) {
    return <LoadingSpinner className="py-20" label="Loading portfolio…" />;
  }

  if (error || !data) {
    return (
      <div className="card p-10 text-center">
        <p className="text-sm text-red-600">{error || "User not found."}</p>
        <Link href="/admin/users" className="btn-secondary mt-4 inline-flex">
          <Icon name="arrow-right" className="h-4 w-4 rotate-180" />
          Back to all users
        </Link>
      </div>
    );
  }

  const { user, profile, skills, projects, categories } = data;
  const skillsByCategory = skills.reduce<Record<string, typeof skills>>((acc, s) => {
    const key = s.category || "Other";
    (acc[key] ||= []).push(s);
    return acc;
  }, {});

  return (
    <div className="animate-fade-in space-y-6">
      <Link
        href="/admin/users"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-slate-800"
      >
        <Icon name="arrow-right" className="h-3.5 w-3.5 rotate-180" />
        Back to all users
      </Link>

      {/* Identity card */}
      <div className="card flex flex-col gap-5 p-6 sm:flex-row sm:items-center">
        {profile?.avatarUrl ? (
          <div className="h-16 w-16 shrink-0 overflow-hidden rounded-2xl ring-4 ring-slate-100">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={profile.avatarUrl} alt={profile.fullName} className="h-full w-full object-cover" />
          </div>
        ) : (
          <div className="grid h-16 w-16 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-slate-400 to-slate-600 text-xl font-bold text-white">
            {(profile?.fullName || user.email)[0]?.toUpperCase()}
          </div>
        )}
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900">
              {profile?.fullName || "Unnamed user"}
            </h2>
            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-500">
              Read-only
            </span>
          </div>
          {profile?.title && <p className="text-slate-500">{profile.title}</p>}
          <p className="mt-1 text-sm text-slate-400">
            {user.email} · Joined {new Date(user.createdAt).toLocaleDateString()}
          </p>
        </div>
        <div className="flex shrink-0 gap-6 text-center">
          <div>
            <p className="text-lg font-bold text-slate-900">{skills.length}</p>
            <p className="text-xs text-slate-500">Skills</p>
          </div>
          <div>
            <p className="text-lg font-bold text-slate-900">{projects.length}</p>
            <p className="text-xs text-slate-500">Projects</p>
          </div>
          <div>
            <p className="text-lg font-bold text-slate-900">{categories.length}</p>
            <p className="text-xs text-slate-500">Categories</p>
          </div>
        </div>
      </div>

      {profile?.bio && (
        <div className="card p-6">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-400">About</h3>
          <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-slate-700">
            {profile.bio}
          </p>
        </div>
      )}

      {/* Contact */}
      {profile && (profile.contactEmail || profile.phone || profile.website || profile.github || profile.linkedin || profile.twitter) && (
        <div className="card p-6">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-400">Contact</h3>
          <div className="mt-3 flex flex-wrap gap-3 text-sm">
            {profile.contactEmail && (
              <span className="inline-flex items-center gap-1.5 rounded-lg bg-slate-50 px-3 py-1.5 text-slate-600">
                <Icon name="mail" className="h-3.5 w-3.5" /> {profile.contactEmail}
              </span>
            )}
            {profile.phone && (
              <span className="inline-flex items-center gap-1.5 rounded-lg bg-slate-50 px-3 py-1.5 text-slate-600">
                <Icon name="phone" className="h-3.5 w-3.5" /> {profile.phone}
              </span>
            )}
            {profile.website && (
              <span className="inline-flex items-center gap-1.5 rounded-lg bg-slate-50 px-3 py-1.5 text-slate-600">
                <Icon name="globe" className="h-3.5 w-3.5" /> {profile.website}
              </span>
            )}
            {profile.github && (
              <span className="inline-flex items-center gap-1.5 rounded-lg bg-slate-50 px-3 py-1.5 text-slate-600">
                <Icon name="github" className="h-3.5 w-3.5" /> {profile.github}
              </span>
            )}
            {profile.linkedin && (
              <span className="inline-flex items-center gap-1.5 rounded-lg bg-slate-50 px-3 py-1.5 text-slate-600">
                <Icon name="linkedin" className="h-3.5 w-3.5" /> {profile.linkedin}
              </span>
            )}
          </div>
        </div>
      )}

      {/* Skills */}
      <div className="card p-6">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-400">
          Skills ({skills.length})
        </h3>
        {skills.length === 0 ? (
          <p className="mt-3 text-sm text-slate-400">No skills added yet.</p>
        ) : (
          <div className="mt-4 space-y-4">
            {Object.entries(skillsByCategory).map(([category, items]) => (
              <div key={category}>
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
                  {category}
                </p>
                <div className="flex flex-wrap gap-2">
                  {items.map((s) => (
                    <span
                      key={s.id}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-700"
                    >
                      {s.name}
                      <span className="flex gap-0.5">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <span
                            key={i}
                            className={`h-1.5 w-1.5 rounded-full ${
                              i < s.level ? "bg-amber-500" : "bg-slate-200"
                            }`}
                          />
                        ))}
                      </span>
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Projects */}
      <div className="card p-6">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-400">
          Projects ({projects.length})
        </h3>
        {projects.length === 0 ? (
          <p className="mt-3 text-sm text-slate-400">No projects added yet.</p>
        ) : (
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {projects.map((p) => (
              <div key={p.id} className="overflow-hidden rounded-2xl border border-slate-200">
                {p.imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={p.imageUrl} alt={p.title} className="h-36 w-full object-cover" />
                ) : (
                  <div className="grid h-36 w-full place-items-center bg-slate-50">
                    <IconBox name="folder-code" size="lg" variant="slate" />
                  </div>
                )}
                <div className="p-4">
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="font-semibold text-slate-900">{p.title}</h4>
                    {p.category && (
                      <span className="shrink-0 rounded-full bg-violet-50 px-2 py-0.5 text-xs font-medium text-violet-600">
                        {p.category}
                      </span>
                    )}
                  </div>
                  {p.description && (
                    <p className="mt-1.5 line-clamp-2 text-sm text-slate-500">{p.description}</p>
                  )}
                  {tagList(p.tags).length > 0 && (
                    <div className="mt-2.5 flex flex-wrap gap-1.5">
                      {tagList(p.tags).map((tag) => (
                        <span key={tag} className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-500">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                  <div className="mt-3 flex gap-3 text-xs">
                    {p.url && (
                      <a href={p.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-brand-600 hover:underline">
                        <Icon name="external-link" className="h-3 w-3" /> Live
                      </a>
                    )}
                    {p.repoUrl && (
                      <a href={p.repoUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-slate-500 hover:underline">
                        <Icon name="github" className="h-3 w-3" /> Source
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
