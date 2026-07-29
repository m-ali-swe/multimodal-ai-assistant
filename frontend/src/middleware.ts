import { NextResponse, type NextRequest } from 'next/server';
import * as jose from "jose"

// async function guest_login(request: NextRequest) {

//     const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
//     const redirectUrl = encodeURIComponent(request.url); 
//     console.log("Redirect url inside guest login : ", redirectUrl);
//     const guestLoginUrl = `${backendUrl}/guest_login?redirect_url=${redirectUrl}`;
//     return NextResponse.redirect(guestLoginUrl);

//     try{
//     const guestRes = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/guest_login`, {
//         method: "GET",
//         headers: { "Content-Type": "application/json" },
//         credentials:"include"
//         });

//     if (!guestRes.ok) {
//                 return NextResponse.redirect(new URL("/auth/login", request.url));
//             }

//         const nextRes = NextResponse.next();

//         // const setCookieHeader = guestRes.headers.get("set-cookie");
//     //     if (setCookieHeader) {
//     //     const cookies = setCookieHeader.split(",");
//     //     console.log("Cookies in middleware : ",cookies)
//     //     cookies.forEach(cookieStr => {
//     //         const [nameValue] = cookieStr.split(";")
//     //         const [name, value] = nameValue.split("=")
//     //         console.log("Setting cookie : ", { name: name.trim(), value: value.trim() })
//     //         nextRes.cookies.set({
//     //         name: name.trim(),
//     //         value: value.trim(),
//     //         httpOnly: true,
//     //         secure: true,      
//     //         sameSite: "none",   
//     //         path: "/"
//     //         });
//     //     });
//     //     }
//     // return nextRes;

//     const setCookieHeaders = guestRes.headers.getSetCookie();
//         console.log('Cookies in middleware:', setCookieHeaders);
//         if (setCookieHeaders.length > 0) {
//             setCookieHeaders.forEach(cookie => {
//                 console.log('Setting cookie:', cookie);
//                 nextRes.headers.append('set-cookie', cookie);
//             });
//         }

//         return nextRes;

//     }catch(err){
//         console.error("JWT verification failed:", err);
//         return NextResponse.redirect(new URL("/auth/login", request.url));

//     }
// }

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
            console.log('Guest JWT payload:', payload);
        } catch (err: unknown) {
            console.error('Guest JWT verification failed:', (err as Error).message);
            return NextResponse.redirect(new URL('/auth/login', request.url));
        }

        const nextRes = NextResponse.next();
        // Forward cookies
        const setCookieHeaders = guestRes.headers.getSetCookie();
        console.log('Cookies in middleware:', setCookieHeaders);
        if (setCookieHeaders.length > 0) {
            setCookieHeaders.forEach(cookie => {
                console.log('Setting cookie:', cookie);
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
    console.log("JWT",jwt)
    const secret=new TextEncoder().encode("My_Secret")
    if(!jwt){
            console.log("No JWT found, redirecting to guest login");
            return guest_login(request);
    }else{
        try{
            const {payload }=await jose.jwtVerify(jwt as string,secret)
            console.log("Payload : ",payload)
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
