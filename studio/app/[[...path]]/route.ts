import { env } from "cloudflare:workers";
import { siteResponse } from "../../server/render.mjs";
import { handleIntake } from "../../server/intake.mjs";

const browserFiles = import.meta.glob("../../site/*.{css,js}", {
  query: "?raw", import: "default", eager: true,
}) as Record<string, string>;

export async function GET(request: Request) {
  const pathname = new URL(request.url).pathname;
  if (pathname === "/api/requests") return handleIntake(request, env);
  const asset = /^\/ui\/([a-z-]+\.(css|js))$/.exec(pathname);
  if (asset) {
    const data = browserFiles["../../site/" + asset[1]];
    if (!data) return new Response(null, { status: 404 });
    return new Response(data, { headers: { "Content-Type": asset[2] === "js" ? "text/javascript; charset=utf-8" : "text/css; charset=utf-8", "X-Content-Type-Options": "nosniff" } });
  }
  return siteResponse(request);
}

export async function POST(request: Request) {
  if (new URL(request.url).pathname === "/api/requests") return handleIntake(request, env);
  return new Response(null, { status: 405, headers: { Allow: "GET" } });
}
