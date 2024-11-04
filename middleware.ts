export { default, withAuth } from "next-auth/middleware"


export const config = {
  matcher: [
    "/trips",
    "/reservations",
    "/properties",
    "/favorites",
    '/users/:path*',
    '/conversations/:path*'
  ]
};
