import { createRootRoute, HeadContent, Outlet, Scripts } from "@tanstack/react-router";
import { AuthProvider } from "@/lib/auth/provider";
import { PreviewHostBridge } from "@/components/preview-host-bridge";
import { ChromeProvider } from "@/components/chrome";
import { getChrome } from "@/lib/store.functions";
import appCss from "../styles.css?url";

export const Route = createRootRoute({
  loader: () => getChrome(),
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "حور | HOUR ABAYAS" },
      { name: "description", content: "أناقة .. بكل تفاصيلها. عبايات نساء وأطفال من مكة المكرمة." },
      { name: "theme-color", content: "#141414" },
    ],
    links: [
      { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
      { rel: "stylesheet", href: appCss },
      { rel: "manifest", href: "/__grok/manifest.webmanifest" },
      { rel: "apple-touch-icon", href: "/__grok/icon-180.png" },
    ],
  }),
  component: Root,
});

function Root() {
  const chrome = Route.useLoaderData();
  return (
    <html lang="ar" dir="rtl" className="antialiased" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body>
        <PreviewHostBridge />
        <AuthProvider>
          <ChromeProvider value={chrome}>
            <Outlet />
          </ChromeProvider>
        </AuthProvider>
        <Scripts />
      </body>
    </html>
  );
}
