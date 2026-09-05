import * as Alchemy from "alchemy";
import * as Cloudflare from "alchemy/Cloudflare";
import * as Effect from "effect/Effect";

export const Database = Cloudflare.D1.Database("Database", {
  primaryLocationHint: "wnam",
});

export const Website = Cloudflare.Website.Vite(
  "Website",
  Effect.gen(function* () {
    const database = yield* Database;

    return {
      main: "worker/index.ts",
      viteEnvironments: {
        entry: "rsc",
        children: ["ssr"],
      },
      assets: {},
      env: {
        DB: database,
        IMAGES: Cloudflare.Images.Images("IMAGES"),
      },
    };
  }),
);

export type WebsiteEnv = Cloudflare.InferEnv<typeof Website>;

export default Alchemy.Stack(
  "plor",
  {
    providers: Cloudflare.providers(),
    state: Cloudflare.state(),
  },
  Effect.gen(function* () {
    const website = yield* Website;

    return {
      url: website.url,
    };
  }),
);
