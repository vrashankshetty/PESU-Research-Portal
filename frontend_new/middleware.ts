import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from './api';

const protectedRoutes = ['/research', '/department', '/student', '/register', '/admin','/profile'];

export async function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;
    
    // Redirect logged in users from /login to /
    if (pathname === '/login') {
      const token = req.cookies.get('accessToken')?.value;
      if (token) {
        try {
          const res = await verifyToken(token);
          if (res?.status === 200) {
            return NextResponse.redirect(new URL('/', req.url));
          }
        } catch {
          // Continue to login if verification fails
        }
      }
    }
  
    // Protected routes check
    if (protectedRoutes.some(route => pathname.startsWith(route))) {
      const token = req.cookies.get('accessToken')?.value;
      
      if (!token) {
        const response = NextResponse.redirect(new URL('/login', req.url));
        response.cookies.delete('accessToken');
        return response;
      }
  
      try {
        const res: any = await verifyToken(token);
        
        if (res?.status !== 200) {
          const response = NextResponse.redirect(new URL('/login', req.url));
          response.cookies.delete('accessToken');
          return response;
        }

        // Special check for admin route
        if (pathname.startsWith('/admin')) {
          const userData = res?.data?.data;
          const isAdmin = userData?.role === 'admin' && userData?.accessTo === 'all';
          
          if (!isAdmin) {
            // Redirect non-admin users to home page or unauthorized page
            return NextResponse.redirect(new URL('/', req.url));
          }
        }
      } catch {
        const response = NextResponse.redirect(new URL('/login', req.url));
        response.cookies.delete('accessToken');
        return response;
      }
    }
    
    return NextResponse.next();
}
  
export const config = {
  matcher: ['/:path*'],
};