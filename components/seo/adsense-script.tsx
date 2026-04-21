"use client";

import Script from "next/script";

type AdsenseScriptProps = {
  clientId?: string;
};

export function AdsenseScript({ clientId }: AdsenseScriptProps) {
  if (!clientId) return null;

  return (
    <Script
      id="adsense-script"
      async
      strategy="afterInteractive"
      crossOrigin="anonymous"
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${clientId}`}
    />
  );
}
