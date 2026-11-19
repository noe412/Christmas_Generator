import { describe, expect, it } from "vitest";
import { precacheManifest, serviceWorkerSource } from "./pwa";

describe("precacheManifest", () => {
  it("includes the app shell and build files but never the worker itself", () => {
    const { assets } = precacheManifest([
      "index.html",
      "assets/app-123.js",
      "sw.js",
      "404.html",
      "x.js.map",
      "assets/app-123.js",
    ]);
    expect(assets).toEqual(["./", "assets/app-123.js", "index.html"]);
  });

  it("derives a stable cache name that changes with the content", () => {
    const a = precacheManifest(["index.html", "assets/a.js"]).cacheName;
    expect(precacheManifest(["assets/a.js", "index.html"]).cacheName).toBe(a);
    expect(precacheManifest(["index.html", "assets/b.js"]).cacheName).not.toBe(a);
    expect(a).toMatch(/^santas-helper-[0-9a-f]{12}$/);
    expect(precacheManifest(["index.html", "assets/a.js"], "new-content").cacheName).not.toBe(a);
  });
});

describe("serviceWorkerSource", () => {
  it("embeds the cache name and precache list", () => {
    const src = serviceWorkerSource(["./", "index.html"], "santas-helper-abc");
    expect(src).toContain('const CACHE = "santas-helper-abc";');
    expect(src).toContain('const PRECACHE = ["./","index.html"];');
    expect(() => new Function(src)).not.toThrow();
  });
});
