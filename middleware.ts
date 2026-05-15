import { NextRequest, NextResponse } from 'next/server'

// ─────────────────────────────────────────────────────────────────────────────
// SITE OFFLINE KILL SWITCH (added 2026-05-06)
//
// The CapitalMatch site is paused while the platform is inactive. Every
// request returns 503 with a short HTML page so no submissions land. To
// revive: revert this commit (the original rate-limiter middleware is in
// git history) and redeploy.
// ─────────────────────────────────────────────────────────────────────────────

const OFFLINE_HTML = `<!doctype html>
<html><head><meta charset="utf-8"><title>CapitalMatch — Temporarily Offline</title>
<style>
  body{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;
       display:flex;align-items:center;justify-content:center;min-height:100vh;
       margin:0;background:#0a0a0a;color:#fafafa;text-align:center;padding:2rem;}
  .box{max-width:520px}
  h1{font-weight:600;font-size:1.5rem;margin:0 0 .75rem}
  p{color:#a3a3a3;line-height:1.55;margin:0}
</style></head>
<body><div class="box">
  <h1>CapitalMatch is temporarily offline</h1>
  <p>This site is paused and not accepting submissions. Please check back later.</p>
</div></body></html>`

export function middleware(req: NextRequest) {
  // API routes get a JSON 503 so any lingering automated caller fails clean.
  if (req.nextUrl.pathname.startsWith('/api/')) {
    return NextResponse.json(
      { error: 'Service unavailable. CapitalMatch is offline.' },
      { status: 503 },
    )
  }
  return new NextResponse(OFFLINE_HTML, {
    status:  503,
    headers: { 'content-type': 'text/html; charset=utf-8' },
  })
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
