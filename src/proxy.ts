import { auth } from "@/auth";

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;
  const isAulaRoute = nextUrl.pathname.startsWith("/aula");

  if (isAulaRoute && !isLoggedIn) {
    const signInUrl = new URL("/ingresar", nextUrl);
    signInUrl.searchParams.set("callbackUrl", nextUrl.pathname + nextUrl.search);
    return Response.redirect(signInUrl);
  }
});

export const config = {
  matcher: ["/aula/:path*"],
};
