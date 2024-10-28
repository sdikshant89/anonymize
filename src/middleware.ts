import { getToken } from 'next-auth/jwt'
import { NextRequest, NextResponse } from 'next/server'
export { default } from "next-auth/middleware"

export async function middleware(request: NextRequest) {
    const token = await getToken({req: request})
    const url = request.nextUrl
    
    if(token){
        if(url.pathname.startsWith('/sign-in') || 
        url.pathname.startsWith('/sign-up') ||
        url.pathname.startsWith('/verify') ||
        url.pathname.startsWith('/')){
        return NextResponse.redirect(new URL('/dashboard', request.url))
        }
    }else if(url.pathname.startsWith('/sign-in') || url.pathname.startsWith('/sign-up') || url.pathname.startsWith('/') || url.pathname.startsWith('/api')){
        return NextResponse.next();
    }
    return NextResponse.redirect(new URL('/home', request.url))
}

export const config = {
  matcher: [
    '/sign-in',
    '/sign-up',
    '/',
    '/dashboard/:path*',
    '/verify/:path*'
    ]
}