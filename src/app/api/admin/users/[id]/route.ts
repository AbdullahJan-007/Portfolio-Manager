import { prisma } from "@/lib/db";
import { getCurrentAdminId } from "@/lib/auth";
import { ok, forbidden, notFound } from "@/lib/api";

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: Params) {
  const adminId = await getCurrentAdminId();
  if (!adminId) return forbidden();
  const { id } = await params;

  const targetUser = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      email: true,
      role: true,
      createdAt: true,
      profile: true,
    },
  });

  if (!targetUser || targetUser.role !== "USER") {
    return notFound("User not found");
  }

  const [skills, projects, categories] = await Promise.all([
    prisma.skill.findMany({
      where: { userId: targetUser.id },
      orderBy: [{ category: "asc" }, { name: "asc" }],
    }),
    prisma.project.findMany({
      where: { userId: targetUser.id },
      orderBy: { createdAt: "desc" },
    }),
    prisma.projectCategory.findMany({
      where: { userId: targetUser.id },
      orderBy: { name: "asc" },
    }),
  ]);

  return ok({
    user: { id: targetUser.id, email: targetUser.email, createdAt: targetUser.createdAt },
    profile: targetUser.profile,
    skills,
    projects,
    categories,
  });
}
