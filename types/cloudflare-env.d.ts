import type { WebsiteEnv } from "../alchemy.run";

declare global {
  namespace Cloudflare {
    // Declaration merging requires an interface for cloudflare:workers' env.
    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    interface Env extends WebsiteEnv {}
  }
}
