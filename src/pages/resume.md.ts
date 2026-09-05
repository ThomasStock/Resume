import type { APIRoute } from "astro";
import { toMarkdown } from "../lib/markdown";

export const GET: APIRoute = () =>
  new Response(toMarkdown(), {
    headers: { "Content-Type": "text/markdown; charset=utf-8" },
  });
