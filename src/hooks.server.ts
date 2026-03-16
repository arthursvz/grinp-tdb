import { env } from "$env/dynamic/private";
import { lucia } from "@/server/lucia";
import prisma from "@/server/prisma";
import type { Handle } from "@sveltejs/kit";
import { createReadStream } from "fs";
import { Readable } from "stream";
import { stat } from "fs/promises";
import path from "path";

const uploadsBaseDir = process.env.NODE_ENV === "production"
  ? path.join(process.cwd(), "build", "client", "uploads")
  : path.join(process.cwd(), "static", "uploads");

const contentTypeFor = (filePath: string) => {
  const ext = path.extname(filePath).toLowerCase();
  switch (ext) {
    case ".png":
      return "image/png";
    case ".jpg":
    case ".jpeg":
      return "image/jpeg";
    case ".gif":
      return "image/gif";
    case ".webp":
      return "image/webp";
    case ".pdf":
      return "application/pdf";
    case ".txt":
      return "text/plain; charset=utf-8";
    case ".doc":
      return "application/msword";
    case ".docx":
      return "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
    default:
      return "application/octet-stream";
  }
};

export const handle: Handle = async ({ event, resolve }) => {
  if (event.url.pathname.startsWith("/uploads/")) {
    const filePath = path.join(uploadsBaseDir, event.url.pathname.replace("/uploads/", ""));
    try {
      const fileStat = await stat(filePath);
      if (!fileStat.isFile()) {
        return new Response("Not Found", { status: 404 });
      }
      const stream = Readable.toWeb(createReadStream(filePath));
      return new Response(stream as unknown as BodyInit, {
        headers: {
          "Content-Type": contentTypeFor(filePath),
          "Content-Length": fileStat.size.toString(),
          "Cache-Control": "public, max-age=3600",
        },
      });
    } catch {
      return new Response("Not Found", { status: 404 });
    }
  }

  const sessionId = event.cookies.get(lucia.sessionCookieName);

  if (!sessionId) {
    event.locals.user = null;
    event.locals.session = null;
    return resolve(event);
  }

  const { session, user } = await lucia.validateSession(sessionId);

  if (session && session.fresh) {
    const sessionCookie = lucia.createSessionCookie(session.id);

    event.cookies.set(sessionCookie.name, sessionCookie.value, {
      path: "/",
      ...sessionCookie.attributes,
    });
  }

  if (!session) {
    const sessionCookie = lucia.createBlankSessionCookie();

    event.cookies.set(sessionCookie.name, sessionCookie.value, {
      path: "/",
      ...sessionCookie.attributes,
    });
  }

  event.locals.user = user;
  event.locals.session = session;

  return resolve(event);
};
