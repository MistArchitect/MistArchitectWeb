import { NextRequest } from "next/server";

const MEDIA_BASE = "https://mist-architects-media.oss-cn-shenzhen.aliyuncs.com";
const DEV_REFERER = "http://127.0.0.1:3000/";

function encodePath(path: string): string {
  return path
    .replace(/^\/+/, "")
    .split("/")
    .map((segment) => encodeURIComponent(segment))
    .join("/");
}

function isSafeMediaPath(path: string): boolean {
  if (!path || /^https?:\/\//i.test(path) || path.startsWith("data:")) {
    return false;
  }

  return path
    .replace(/^\/+/, "")
    .split("/")
    .every((segment) => segment.length > 0 && segment !== "." && segment !== "..");
}

export async function GET(request: NextRequest) {
  if (process.env.NODE_ENV !== "development") {
    return new Response("Not found", { status: 404 });
  }

  const path = request.nextUrl.searchParams.get("path") || "";
  const ossProcess = request.nextUrl.searchParams.get("process");

  if (!isSafeMediaPath(path)) {
    return new Response("Invalid media path", { status: 400 });
  }

  const source = new URL(`${MEDIA_BASE}/${encodePath(path)}`);
  if (ossProcess) {
    source.searchParams.set("x-oss-process", ossProcess);
  }

  const upstream = await fetch(source, {
    headers: {
      Referer: DEV_REFERER
    }
  });

  if (!upstream.ok || !upstream.body) {
    const message = await upstream.text();
    return new Response(message, {
      status: upstream.status,
      headers: {
        "content-type": upstream.headers.get("content-type") || "text/plain; charset=utf-8"
      }
    });
  }

  const headers = new Headers();
  const contentType = upstream.headers.get("content-type");
  const contentLength = upstream.headers.get("content-length");
  if (contentType) headers.set("content-type", contentType);
  if (contentLength) headers.set("content-length", contentLength);
  headers.set("cache-control", "public, max-age=86400");

  return new Response(upstream.body, {
    status: upstream.status,
    headers
  });
}
