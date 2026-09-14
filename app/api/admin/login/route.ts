import { NextResponse } from "next/server";
import { ADMIN_SESSION_COOKIE, createSessionValue, verifyPassword } from "@/lib/admin/auth";

export async function POST(req: Request) {
  let password = "";
  try {
    const body = await req.json();
    password = typeof body?.password === "string" ? body.password : "";
  } catch {
    return NextResponse.json({ error: "Geçersiz istek." }, { status: 400 });
  }

  if (!verifyPassword(password)) {
    return NextResponse.json({ error: "Şifre hatalı." }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set(ADMIN_SESSION_COOKIE, await createSessionValue(), {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
  return res;
}
