import { createHash } from "node:crypto";
import { readFileSync, readdirSync, statSync } from "node:fs";
import path from "node:path";
import type { Plugin } from "vite";

/** Files the service worker must not precache. */
const EXCLUDE = new Set(["sw.js", "404.html", ".nojekyll"]);

/** Lists files in a directory recursively, as forward-slash paths relative to it. */
export function listFiles(dir: string, base = dir): string[] {
  return readdirSync(dir).flatMap((name) => {
    const full = path.join(dir, name);
    return statSync(full).isDirectory() ? listFiles(full, base) : [path.relative(base, full).split(path.sep).join("/")];
  });
}

/**
 * Builds the precache list (relative to the SW scope) and a cache name.
 * `fingerprint` should cover file contents, so unhashed files (manifest, icons, index.html) refresh too.
 */
export function precacheManifest(files: Iterable<string>, fingerprint = "") {
  const assets = Array.from(new Set(files))
    .filter((f) => !EXCLUDE.has(f) && !f.endsWith(".map"))
    .sort();
  const version = createHash("sha256").update(assets.join("\n")).update(fingerprint).digest("hex").slice(0, 12);
  return { assets: ["./", ...assets], cacheName: `santas-helper-${version}` };
}

/** Service worker source: precache on install, cache-first for assets, network-first for pages. */
export function serviceWorkerSource(assets: string[], cacheName: string) {
  return `/* Generated at build time – do not edit. */
const CACHE = ${JSON.stringify(cacheName)};
const PRECACHE = ${JSON.stringify(assets)};
const scoped = (p) => new URL(p, self.registration.scope).href;

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE).then((cache) => cache.addAll(PRECACHE.map(scoped))).then(() => self.skipWaiting()),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k.startsWith("santas-helper-") && k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET" || new URL(request.url).origin !== self.location.origin) return;

  if (request.mode === "navigate") {
    // Pages: prefer the network so a new release shows up immediately; fall back to the cached shell offline.
    event.respondWith(
      fetch(request)
        .then((response) => {
          const copy = response.clone();
          caches.open(CACHE).then((cache) => cache.put(scoped("./"), copy));
          return response;
        })
        .catch(() =>
          caches
            .match(scoped("./"), { ignoreVary: true })
            .then((r) => r || caches.match(scoped("index.html"), { ignoreVary: true })),
        ),
    );
    return;
  }

  // Hashed assets never change: serve from cache, fetch and store anything new.
  // ignoreVary: module scripts are requested with an Origin header the precache request lacked.
  event.respondWith(
    caches.match(request, { ignoreVary: true }).then(
      (cached) =>
        cached ||
        fetch(request).then((response) => {
          if (response.ok && response.type === "basic") {
            const copy = response.clone();
            caches.open(CACHE).then((cache) => cache.put(request, copy));
          }
          return response;
        }),
    ),
  );
});
`;
}

/**
 * Emits `sw.js` after the build, precaching every generated file plus the public folder,
 * so the installed app works fully offline after the first visit.
 */
export function pwaPlugin(publicDir = "public"): Plugin {
  return {
    name: "santas-helper-pwa",
    apply: "build",
    generateBundle(_options, bundle) {
      const publicFiles = (() => {
        try {
          return listFiles(path.resolve(publicDir));
        } catch {
          return [];
        }
      })();
      const hash = createHash("sha256");
      for (const [name, item] of Object.entries(bundle).sort(([a], [b]) => a.localeCompare(b))) {
        hash.update(name).update(item.type === "chunk" ? item.code : item.source);
      }
      for (const file of publicFiles) hash.update(file).update(readFileSync(path.resolve(publicDir, file)));
      const { assets, cacheName } = precacheManifest([...Object.keys(bundle), ...publicFiles], hash.digest("hex"));
      this.emitFile({ type: "asset", fileName: "sw.js", source: serviceWorkerSource(assets, cacheName) });
    },
  };
}
