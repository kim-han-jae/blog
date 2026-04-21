type FaqItem = {
  question: string;
  answer: string;
};

export function createOrganizationSchema(input: {
  name: string;
  url: string;
  logo?: string;
  sameAs?: string[];
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: input.name,
    url: input.url,
    logo: input.logo,
    sameAs: input.sameAs ?? [],
  };
}

export function createWebsiteSchema(input: {
  name: string;
  url: string;
  description?: string;
  searchPath?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: input.name,
    url: input.url,
    description: input.description,
    potentialAction: {
      "@type": "SearchAction",
      target: `${input.url}${input.searchPath ?? "/search"}?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };
}

export function createArticleSchema(input: {
  url: string;
  title: string;
  description: string;
  publishedAt?: string;
  updatedAt?: string;
  image?: string;
  category?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: input.title,
    description: input.description,
    datePublished: input.publishedAt,
    dateModified: input.updatedAt ?? input.publishedAt,
    image: input.image,
    articleSection: input.category,
    mainEntityOfPage: input.url,
  };
}

export function createBreadcrumbSchema(items: Array<{ name: string; url: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function createFaqSchema(faqs: FaqItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

export function createCollectionPageSchema(input: {
  name: string;
  url: string;
  description?: string;
  items: Array<{ name: string; url: string }>;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: input.name,
    url: input.url,
    description: input.description,
    mainEntity: {
      "@type": "ItemList",
      itemListElement: input.items.map((item, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: item.name,
        url: item.url,
      })),
    },
  };
}
