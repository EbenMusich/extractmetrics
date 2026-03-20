type GtagFunction = (
  command: "event",
  eventName: string,
  params?: Record<string, unknown>,
) => void;

export function trackEvent(
  name: string,
  params?: Record<string, unknown>,
) {
  if (typeof window === "undefined") {
    return;
  }

  const gtag = (window as Window & { gtag?: GtagFunction }).gtag;

  if (!gtag) {
    return;
  }

  gtag("event", name, params);
}
