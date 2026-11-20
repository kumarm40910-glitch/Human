import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import db from "./db";
const key = () => new TextEncoder().encode(process.env.AUTH_SECRET || "dev-secret");
export async function setSession(id) {
  const t = await new SignJWT({ id }).setProtectedHeader({ alg: "HS256" }).setExpirationTime("30d").sign(key());
  cookies().set("s", t, { httpOnly: true, sameSite: "lax", path: "/", secure: process.env.NODE_ENV === "production" });
}
export async function getUser() {
  const t = cookies().get("s")?.value; if (!t) return null;
  try { const { payload } = await jwtVerify(t, key()); return db.prepare("select id,email,plan from users where id=?").get(payload.id) || null; } catch { return null; }
}
