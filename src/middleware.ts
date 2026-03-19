import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const host = request.headers.get("host") || "";
  const hostname = host.split(":")[0]; // strip port for local dev
  const { pathname, search } = request.nextUrl;

  // Local dev: no subdomain routing (all routes accessible on localhost)
  if (hostname === "localhost" || hostname === "127.0.0.1") {
    return NextResponse.next();
  }

  // Dashboard subdomain → rewrite to /admin/*
  if (hostname.startsWith("dashboard.")) {
    const url = request.nextUrl.clone();
    url.pathname = `/admin${pathname === "/" ? "" : pathname}`;
    return NextResponse.rewrite(url);
  }

  // Patient subdomain → pass through (route group handles it)
  if (hostname.startsWith("patient.")) {
    return NextResponse.next();
  }

  // Main domain (spinetrack.ai, www.spinetrack.ai)
  // Redirect legacy patient paths to patient subdomain
  const patientIdMatch = pathname.match(/^\/([A-Z]?\d{3,})(\/.*)?$/);
  if (patientIdMatch) {
    return NextResponse.redirect(
      `https://patient.spinetrack.ai${pathname}${search}`,
      301
    );
  }

  // Redirect /patient/* paths to patient subdomain
  if (pathname.startsWith("/patient/")) {
    return NextResponse.redirect(
      `https://patient.spinetrack.ai${pathname}${search}`,
      301
    );
  }

  // Redirect /qr/* paths to patient subdomain
  if (pathname.startsWith("/qr/")) {
    return NextResponse.redirect(
      `https://patient.spinetrack.ai${pathname}${search}`,
      301
    );
  }

  // Block /admin/* on main domain → redirect to dashboard subdomain
  if (pathname.startsWith("/admin")) {
    return NextResponse.redirect("https://dashboard.spinetrack.ai/", 302);
  }

  // Main domain: serve landing page (root page.tsx)
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|fonts|api).*)",
  ],
};
