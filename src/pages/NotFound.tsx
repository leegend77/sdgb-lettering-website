import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  useEffect(() => {
    const prevTitle = document.title;
    document.title = "404 — page not found | sand atelier";

    const setMeta = (selector: string, attrs: Record<string, string>) => {
      let el = document.head.querySelector<HTMLMetaElement>(selector);
      const created = !el;
      if (!el) {
        el = document.createElement("meta");
        document.head.appendChild(el);
      }
      Object.entries(attrs).forEach(([k, v]) => el!.setAttribute(k, v));
      return { el, created };
    };

    const desc = setMeta('meta[name="description"]', {
      name: "description",
      content:
        "the page you're looking for doesn't exist. browse sand atelier's custom lettering sticker archive instead.",
    });
    const robots = setMeta('meta[name="robots"]', {
      name: "robots",
      content: "noindex, nofollow",
    });

    let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    const prevCanonical = canonical?.getAttribute("href") ?? null;
    if (canonical) canonical.setAttribute("href", "https://sand-atelier-stickers.lovable.app/404");

    return () => {
      document.title = prevTitle;
      if (robots.created) robots.el.remove();
      if (canonical && prevCanonical) canonical.setAttribute("href", prevCanonical);
    };
  }, []);

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted">
      <div className="text-center">
        <h1 className="mb-4 text-4xl font-bold">404</h1>
        <p className="mb-4 text-xl text-muted-foreground">Oops! Page not found</p>
        <a href="/" className="text-primary underline hover:text-primary/90">
          Return to Home
        </a>
      </div>
    </div>
  );
};

export default NotFound;
