/**
 * Registers the offline service worker in production builds.
 * Fails silently where service workers are unavailable (private mode, sandboxed previews, old browsers).
 */
export function registerServiceWorker() {
  if (!import.meta.env.PROD || !("serviceWorker" in navigator)) return;
  window.addEventListener("load", () => {
    navigator.serviceWorker.register(`${import.meta.env.BASE_URL}sw.js`).catch(() => undefined);
  });
}
