import type { APIRoute } from "astro";
import { toJsonResume } from "../lib/jsonresume";

export const GET: APIRoute = () =>
  new Response(JSON.stringify(toJsonResume(), null, 2) + "\n", {
    headers: { "Content-Type": "application/json; charset=utf-8" },
  });
