import { rm, mkdir } from "node:fs/promises";

const directory = "outputs/screenshots";

await rm(directory, { recursive: true, force: true });
await mkdir(directory, { recursive: true });
console.log(`Purged screenshots from ${directory}`);
