import { prisma } from "@/lib/db";
import { getCurrentUserId } from "@/lib/auth";
import { ok, unauthorized, serverError, error, notFound } from "@/lib/api";
import { isNonEmptyString, asStringOrNull, clampLevel } from "@/lib/validation";

// `params` is a Promise in Next.js 15+ (and still works correctly when
// awaited under Next 14, where it's already a plain object) — see
// src/lib/auth.ts for the same forward-compatible pattern applied to
// cookies().
type Params = { params: Promise<{ id: string }> };

export async function PUT(request: Request, { params }: Params) {
  const userId = await getCurrentUserId();
  if (!userId) return unauthorized();
  const { id } = await params;

  try {
    const existing = await prisma.skill.findUnique({
      where: { id },
    });
    if (!existing || existing.userId !== userId) return notFound("Skill not found");

    const body = await request.json().catch(() => null);
    if (!body) return error("Invalid request body");

    const name = String(body.name ?? "").trim();
    if (!isNonEmptyString(name)) return error("Skill name is required");

    const skill = await prisma.skill.update({
      where: { id },
      data: {
        name,
        category: asStringOrNull(body.category),
        level: clampLevel(body.level),
      },
    });

    return ok({ skill });
  } catch (err) {
    console.error("skill update error", err);
    return serverError();
  }
}

export async function DELETE(_request: Request, { params }: Params) {
  const userId = await getCurrentUserId();
  if (!userId) return unauthorized();
  const { id } = await params;

  try {
    const existing = await prisma.skill.findUnique({
      where: { id },
    });
    if (!existing || existing.userId !== userId) return notFound("Skill not found");

    await prisma.skill.delete({ where: { id } });
    return ok({ success: true });
  } catch (err) {
    console.error("skill delete error", err);
    return serverError();
  }
}
