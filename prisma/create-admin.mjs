// Creates (or updates) the single admin account for this application.
//
// This is intentionally a one-off script, not an API route: an admin account
// must never be reachable over HTTP, so there is no way for the public
// /api/auth/register endpoint (or any other route) to create one.
//
// Usage:
//   1. Set ADMIN_EMAIL and ADMIN_PASSWORD in your .env file.
//   2. Run:  npm run admin:create
//   3. Log in at /login with those credentials — you'll land on /admin.
//
// Safe to re-run: if the admin account already exists, this updates its
// password/role to match your current .env values instead of creating a
// duplicate (email is unique in the database).

import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { readFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

// ---------------------------------------------------------------------------
// Minimal .env loader. Standalone `node` scripts (unlike `next dev`/`prisma`
// CLI commands) don't load .env automatically on every Node version, so we
// load it ourselves rather than relying on undocumented behavior — this
// script only ever sets a value that isn't already present in the
// environment, so real environment variables (e.g. on a server) still win.
// ---------------------------------------------------------------------------
function loadDotEnv() {
  const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
  const envPath = path.join(root, ".env");
  if (!existsSync(envPath)) return;

  for (const line of readFileSync(envPath, "utf8").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (!(key in process.env)) process.env[key] = value;
  }
}

loadDotEnv();

const prisma = new PrismaClient();

async function main() {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;

  if (!email || !password) {
    console.error(
      "\nMissing ADMIN_EMAIL and/or ADMIN_PASSWORD in your environment.\n" +
        "Add both to your .env file, then run `npm run admin:create` again.\n"
    );
    process.exit(1);
  }

  if (password.length < 8) {
    console.error("\nADMIN_PASSWORD must be at least 8 characters.\n");
    process.exit(1);
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const normalizedEmail = email.trim().toLowerCase();

  const existing = await prisma.user.findUnique({
    where: { email: normalizedEmail },
  });

  if (existing && existing.role !== "ADMIN") {
    console.error(
      `\nA regular user account already exists with the email "${normalizedEmail}".\n` +
        "Refusing to convert it to admin automatically, since that would " +
        "overwrite that account's password.\n\n" +
        "Choose a different ADMIN_EMAIL, or delete/rename the existing " +
        "account first if it's yours.\n"
    );
    process.exit(1);
  }

  const admin = await prisma.user.upsert({
    where: { email: normalizedEmail },
    update: { passwordHash, role: "ADMIN" },
    create: { email: normalizedEmail, passwordHash, role: "ADMIN" },
  });

  console.log(`\nAdmin account ready: ${admin.email} (role: ${admin.role})`);
  console.log("You can now log in at /login with this email and password.\n");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
