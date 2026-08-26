import { env } from "cloudflare:workers";
import { drizzle } from "drizzle-orm/d1";
import * as schema from "./schema";

export function getDb() {
  if (!env.DB) {
    throw new Error(
      "Cloudflare D1 binding `DB` is unavailable. Run the app through Alchemy so the managed database binding is injected."
    );
  }

  return drizzle(env.DB, { schema });
}
