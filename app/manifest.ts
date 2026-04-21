import type { MetadataRoute } from "next";
import { seoConfig } from "@/lib/seo";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: seoConfig.siteName,
    short_name: seoConfig.siteName,
    description: seoConfig.defaultDescription,
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#111111",
    lang: "ko-KR",
    icons: [
      {
        src: "/logo-issueisshu.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
    ],
  };
}
