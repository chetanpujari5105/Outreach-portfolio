// Vercel entry: the same renderer the Cloudflare Worker uses (app/[[...path]]/route.ts).
// Static files in public/ are served by Vercel first; vercel.json rewrites everything else here.
import { readFileSync } from "node:fs";
import { siteResponse } from "../server/render.mjs";
import { handleIntake } from "../server/intake.mjs";

const siteDir = new URL("../site/", import.meta.url);

// The rewrite passes the original path as ?__path= so it survives whichever URL the runtime reports.
function original(request) {
  const url = new URL(request.url);
  const path = url.searchParams.get("__path");
  if (path !== null) {
    url.pathname = path.startsWith("/") ? path : "/" + path;
    url.searchParams.delete("__path");
  }
  return new Request(url, request);
}

// No D1 on Vercel: intake answers 503 and the form shows its email fallback.
export async function GET(request) {
  const req = original(request);
  const pathname = new URL(req.url).pathname;
  if (pathname === "/api/requests") return handleIntake(req, process.env);
  const asset = /^\/ui\/([a-z-]+\.(css|js))$/.exec(pathname);
  if (!asset) {
    const response = siteResponse(req);
    if (process.env.VERCEL !== "1" || response.status !== 200 || !response.headers.get("content-type")?.startsWith("text/html") || pathname.replace(/\/+$/, "") === "/owner") return response;

    // Vercel serves these pages as HTML documents, outside a hydrated React layout.
    const analytics = '<script>window.va=window.va||function(){(window.vaq=window.vaq||[]).push(arguments)};window.va("beforeSend",function(e){var url=new URL(e.url,location.origin);url.search="";url.hash="";return Object.assign({},e,{url:url.href})})</script><script defer src="/_vercel/insights/script.js"></script>';
    return new Response((await response.text()).replace("</head>", analytics + "</head>"), {
      status: response.status,
      headers: response.headers,
    });
  }
  let data;
  try {
    data = readFileSync(new URL(asset[1], siteDir), "utf8");
  } catch {
    return new Response(null, { status: 404 });
  }
  return new Response(data, {
    headers: {
      "Content-Type": asset[2] === "js" ? "text/javascript; charset=utf-8" : "text/css; charset=utf-8",
      "X-Content-Type-Options": "nosniff",
    },
  });
}

export function POST(request) {
  const req = original(request);
  if (new URL(req.url).pathname === "/api/requests") return handleIntake(req, process.env);
  return new Response(null, { status: 405, headers: { Allow: "GET" } });
}
