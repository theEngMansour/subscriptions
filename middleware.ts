import { NextRequest, NextResponse } from "next/server";

export const config = {
    matcher: ["/bookings", "/login", "/register"]
}

export async function middleware(req: NextRequest) {
    let path: string | URL;
    const COOKIE_NAME = "token"
    const getCookie = req.cookies.get(COOKIE_NAME)
    if(req.nextUrl.pathname.startsWith("/login") && getCookie != undefined) {
        path = "/"
    } else if (req.nextUrl.pathname.startsWith("/register") && getCookie != undefined) {
        path = "/"
    } else if (req.nextUrl.pathname.startsWith("/bookings") && getCookie != undefined) {
        path = "/bookings"
    } else if (req.nextUrl.pathname.startsWith("/bookings") && getCookie == undefined) {
        path = "/login"
    } else {
        path = req.url
    }
    const res = NextResponse.rewrite(new URL(path, req.url))
    return res
} 

// document.cookie = `token = ; expires=Thu, 01 jan 1970 00:00:01 GMT