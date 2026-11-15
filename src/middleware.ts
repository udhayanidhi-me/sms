import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const SECRET_KEY = new TextEncoder().encode(
  process.env.JWT_SECRET || "mgcsiils_default_jwt_secret_cheruvarakonam_2026"
);

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("mgcsiils_session")?.value;

  let session: any = null;
  if (token) {
    try {
      const { payload } = await jwtVerify(token, SECRET_KEY);
      session = payload;
    } catch {
      // Invalid/expired token
    }
  }

  // Handle Root route "/"
  if (pathname === "/") {
    if (!session) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    if (session.role === "ADMIN") return NextResponse.redirect(new URL("/admin", request.url));
    if (session.role === "FACULTY") return NextResponse.redirect(new URL("/faculty", request.url));
    return NextResponse.redirect(new URL("/student", request.url));
  }

  // Login page access when already authenticated
  if (pathname === "/login") {
    if (session) {
      if (session.role === "ADMIN") return NextResponse.redirect(new URL("/admin", request.url));
      if (session.role === "FACULTY") return NextResponse.redirect(new URL("/faculty", request.url));
      return NextResponse.redirect(new URL("/student", request.url));
    }
    return NextResponse.next();
  }

  // Protected paths check
  const isAdminPath = pathname.startsWith("/admin");
  const isFacultyPath = pathname.startsWith("/faculty");
  const isStudentPath = pathname.startsWith("/student");

  if (isAdminPath || isFacultyPath || isStudentPath) {
    if (!session) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("from", pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Role verification
    if (isAdminPath && session.role !== "ADMIN") {
      return NextResponse.redirect(new URL(session.role === "FACULTY" ? "/faculty" : "/student", request.url));
    }

    if (isFacultyPath && session.role !== "FACULTY" && session.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/student", request.url));
    }

    if (isStudentPath && session.role !== "STUDENT" && session.role !== "ADMIN") {
      return NextResponse.redirect(new URL(session.role === "FACULTY" ? "/faculty" : "/admin", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/login",
    "/admin/:path*",
    "/faculty/:path*",
    "/student/:path*",
  ],
};
