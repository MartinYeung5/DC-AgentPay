import createMiddleware from "next-intl/middleware";

export default createMiddleware({
  locales: ["zh-CN", "zh-TW", "en"],
  defaultLocale: "zh-CN",
  localePrefix: "always"
});

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"]
};
