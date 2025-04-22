import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone()

  // Check if the request is for the Sanity Studio
  if (url.pathname.startsWith("/studio")) {
    // In a real application, you would check for authentication here
    // For this demo, we'll just allow access
    // If you want to add authentication later, you could do something like:
    // const session = await getSession(request)
    // if (!session || !session.user.isAdmin) {
    //   url.pathname = '/login'
    //   return NextResponse.redirect(url)
    // }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/studio/:path*"],
}
