import type { UnifiedPost } from "@/types/post";

function overlapScore(tagsA: string[], tagsB: string[]) {
  const set = new Set(tagsA);
  return tagsB.reduce((acc, tag) => (set.has(tag) ? acc + 1 : acc), 0);
}

export function getRelatedPosts(target: UnifiedPost, all: UnifiedPost[], limit = 3) {
  return all
    .filter((post) => post.slug !== target.slug && post.isPublished)
    .map((post) => {
      const categoryScore = post.category === target.category ? 3 : 0;
      const tagScore = overlapScore(post.tags, target.tags);
      return { post, score: categoryScore + tagScore };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((entry) => entry.post);
}
