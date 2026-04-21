import { compileMDX } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import { CTABox } from "@/components/cta/cta-box";
import { AdPlaceholder } from "@/components/cta/ad-placeholder";
import { ImageCreditList } from "@/components/blog/image-credit-list";

const mdxComponents = {
  CTABox,
  AdPlaceholder,
  ImageCreditList,
};

export async function renderMdx(source: string) {
  const { content } = await compileMDX({
    source,
    options: {
      mdxOptions: {
        remarkPlugins: [remarkGfm],
        rehypePlugins: [
          rehypeSlug,
          [rehypeAutolinkHeadings, { behavior: "append" }],
        ],
      },
    },
    components: mdxComponents,
  });

  return content;
}
