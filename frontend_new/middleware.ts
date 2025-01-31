import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from './api';
const protectedRoutes = ['/research', '/department', '/student'];


export async function middleware(req: NextRequest) {
    // const { pathname } = req.nextUrl;
    
    // // Redirect logged in users from /login to /
    // if (pathname === '/login') {
    //   const token = req.cookies.get('accessToken')?.value;
    //   if (token) {
    //     try {
    //       const res = await verifyToken(token);
    //       if (res?.status === 200) {
    //         return NextResponse.redirect(new URL('/', req.url));
    //       }
    //     } catch {
    //       // Continue to login if verification fails
    //     }
    //   }
    // }
  
    // // Protected routes check
    // if (protectedRoutes.some(route => pathname.startsWith(route))) {
    //   const token = req.cookies.get('accessToken')?.value;
      
    //   if (!token) {
    //     const response = NextResponse.redirect(new URL('/login', req.url));
    //     response.cookies.delete('accessToken');
    //     return response;
    //   }
  
    //   try {
    //     const res = await verifyToken(token);
    //     if (res?.status !== 200) {
    //       const response = NextResponse.redirect(new URL('/login', req.url));
    //       response.cookies.delete('accessToken');
    //       return response;
    //     }
    //   } catch {
    //     const response = NextResponse.redirect(new URL('/login', req.url));
    //     response.cookies.delete('accessToken');
    //     return response;
    //   }
    // }
    
    return NextResponse.next();
  }
  
export const config = {
  matcher: ['/:path*'],
};