import { prisma } from "@/lib/db";
import { getCurrentAdminId } from "@/lib/auth";
import { ok, forbidden } from "@/lib/api";

export async function GET() {
  const adminId = await getCurrentAdminId();
  if (!adminId) return forbidden();

  const users = await prisma.user.findMany({
    where: { role: "USER" },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      email: true,
      createdAt: true,
      profile: { select: { fullName: true, title: true, avatarUrl: true } },
      _count: { select: { skills: true, projects: true } },
    },
  });

  return ok({ users });
}
