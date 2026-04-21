import { z } from "zod";

const urlSchema = z.string().url();
const markdownLinkPattern = /\[[^\]]+\]\((https?:\/\/[^)\s]+)\)/g;
const bareUrlPattern = /(https?:\/\/[^\s)]+)/g;
const imagePattern = /!\[[^\]]*\]\((https?:\/\/[^)\s]+)\)/g;

export function extractUrls(content: string) {
  const urls = new Set<string>();

  for (const match of content.matchAll(markdownLinkPattern)) {
    urls.add(match[1]);
  }
  for (const match of content.matchAll(bareUrlPattern)) {
    urls.add(match[1]);
  }

  return [...urls];
}

export function extractImageUrls(content: string) {
  return [...new Set([...content.matchAll(imagePattern)].map((match) => match[1]))];
}

export function validateSourceUrls(urls: string[]) {
  const valid: string[] = [];
  const invalid: string[] = [];

  for (const url of urls) {
    const result = urlSchema.safeParse(url);
    if (result.success) valid.push(url);
    else invalid.push(url);
  }

  return { valid, invalid };
}

export function validatePublishSources(content: string) {
  const urls = extractUrls(content);
  const { valid, invalid } = validateSourceUrls(urls);
  const imageUrls = extractImageUrls(content);
  const hasImageCredit = content.includes("이미지 출처");

  return {
    validSourceCount: valid.length,
    invalidSources: invalid,
    hasImage: imageUrls.length > 0,
    hasImageCredit,
    pass:
      valid.length >= 2 && invalid.length === 0 && (imageUrls.length === 0 || hasImageCredit),
  };
}
