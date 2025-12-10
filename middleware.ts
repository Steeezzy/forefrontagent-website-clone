import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";

export async function middleware(request: NextRequest) {
  const session = await auth.api.getSession({ headers: await headers() });

  const { nextUrl } = request;
  const shop = nextUrl.searchParams.get("shop");

  // Handle Shopify Install Link (e.g. /?shop=store.myshopify.com)
  if (nextUrl.pathname === "/" && shop) {
    const redirectUrl = new URL("/api/auth/shopify", request.url);
    redirectUrl.searchParams.set("shop", shop);
    return NextResponse.redirect(redirectUrl);
  }
}

export const config = {
  matcher: ["/dashboard", "/bots", "/settings", "/admin"],
};