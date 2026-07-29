import { NextResponse, type NextRequest } from 'next/server';
import * as jose from "jose"

async function guest_login(request: NextRequest) {
    
    return NextResponse.redirect(new URL("/api/guest_login", request.url));

    try {
        const guestRes = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/guest_login`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
        });

        if (!guestRes.ok) {
            console.error(`Guest login failed with status: ${guestRes.status}`);
            return NextResponse.redirect(new URL('/auth/login', request.url));
        }

        const data = await guestRes.json();
        const accessToken = data.access_token;
        const userId = data.user_id;

        // Verify token server-side to ensure it's valid
        const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'My_Secret');
        try {
            const { payload } = await jose.jwtVerify(accessToken, secret);
        } catch (err: unknown) {
            console.error('Guest JWT verification failed:', (err as Error).message);
            return NextResponse.redirect(new URL('/auth/login', request.url));
        }

        const nextRes = NextResponse.next();
        // Forward cookies
        const setCookieHeaders = guestRes.headers.getSetCookie();
        if (setCookieHeaders.length > 0) {
            setCookieHeaders.forEach(cookie => {
                nextRes.headers.append('set-cookie', cookie);
            });
        }

        // Set user header
        const headers = new Headers(request.headers);
        headers.set('user', JSON.stringify({ sub: data.access_token.sub || userId }));
        return NextResponse.next({ request: { headers } });
    } catch (err) {
        console.error('Guest login error:', err);
        return NextResponse.redirect(new URL('/auth/login', request.url));
    }
}

export async function middleware(request:NextRequest){

    // const res= NextResponse.next()
    // return res

    const jwt=request.cookies.get("token")?.value;
    const secret=new TextEncoder().encode("My_Secret")
    if(!jwt){
            return guest_login(request);
    }else{
        try{
            const {payload }=await jose.jwtVerify(jwt as string,secret)
            const headers=new Headers(request.headers)
            headers.set("user",JSON.stringify(payload.sub))

            const res= NextResponse.next({
                request:{
                    headers:headers
                }
            })
            return res
        }catch(err){
            console.error("JWT verification failed:", err);
            return guest_login(request)
        }
    }
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|auth/login|auth/signup|sitemap.xml|robots.txt|api/).*)',
  ],
};
