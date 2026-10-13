// Placeholder review data. In later phases this will be replaced by real
// reviews fetched from the Reviews API (see PROJECT_PROGRESS.md section 5).
//
// Rather than hand-authoring reviews for all 24 products, a small pool of
// review templates is deterministically assigned per product (seeded by
// product id, so the same product always shows the same reviews). Star
// ratings lean toward each product's own average rating so the summary math
// stays roughly consistent.

const REVIEW_POOL = [
  { name: "Jordan M.", comment: "Exactly as described and arrived faster than expected. Would buy again.", daysAgo: 6, helpful: 18 },
  { name: "Priya K.", comment: "Really solid quality for the price. A couple of small things could be better, but overall happy.", daysAgo: 14, helpful: 9 },
  { name: "Sam T.", comment: "This has held up well after a few weeks of regular use — no complaints so far.", daysAgo: 21, helpful: 12 },
  { name: "Alicia R.", comment: "Packaging was great and the product feels well made. Matches the photos closely.", daysAgo: 4, helpful: 5 },
  { name: "Marcus B.", comment: "Good value. Shipping took a little longer than I expected but the item itself is solid.", daysAgo: 33, helpful: 7 },
  { name: "Wei L.", comment: "Better than I anticipated honestly. Already recommended it to a couple of friends.", daysAgo: 9, helpful: 22 },
  { name: "Hannah S.", comment: "Does what it says. Not flashy, just reliable — which is what I wanted.", daysAgo: 45, helpful: 3 },
  { name: "Devon P.", comment: "Had a small issue at first but customer support sorted it quickly. Happy with it now.", daysAgo: 18, helpful: 11 },
  { name: "Elena V.", comment: "Nice attention to detail. Feels more premium than the price suggests.", daysAgo: 2, helpful: 4 },
  { name: "Omar F.", comment: "Fits well into my daily routine, easy to use out of the box.", daysAgo: 27, helpful: 8 },
  { name: "Grace N.", comment: "Ordered a replacement after loving the first one. Consistent quality.", daysAgo: 12, helpful: 15 },
  { name: "Liam C.", comment: "A few minor gripes but nothing that would stop me from recommending it.", daysAgo: 39, helpful: 6 },
];

function hashString(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i += 1) {
    hash = (hash * 31 + str.charCodeAt(i)) % 997;
  }
  return hash;
}

function initialsFor(name) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

function starsNear(rating, offset) {
  const value = Math.round(rating) + offset;
  return Math.min(5, Math.max(3, value));
}

/**
 * Returns 3 deterministic reviews for a product, with star ratings that
 * hover around the product's own average rating.
 */
export function getReviewsForProduct(product) {
  const seed = hashString(product.id);
  const offsets = [0, 0, -1];

  return offsets.map((offset, i) => {
    const template = REVIEW_POOL[(seed + i * 3) % REVIEW_POOL.length];
    return {
      id: `${product.id}-review-${i}`,
      name: template.name,
      initials: initialsFor(template.name),
      comment: template.comment,
      daysAgo: template.daysAgo,
      helpful: template.helpful,
      rating: starsNear(product.rating, offset),
    };
  });
}

/**
 * Rough percentage breakdown of 5→1 star reviews, biased toward a product's
 * average rating. Illustrative only — swap for a real aggregate once the
 * backend tallies actual review star counts.
 */
export function getRatingBreakdown(rating) {
  const fiveStarShare = Math.max(0.35, Math.min(0.85, (rating - 3) / 2));
  const remaining = 1 - fiveStarShare;
  const fourStarShare = remaining * 0.6;
  const threeStarShare = remaining * 0.25;
  const twoStarShare = remaining * 0.1;
  const oneStarShare = remaining * 0.05;

  return [
    { stars: 5, percent: Math.round(fiveStarShare * 100) },
    { stars: 4, percent: Math.round(fourStarShare * 100) },
    { stars: 3, percent: Math.round(threeStarShare * 100) },
    { stars: 2, percent: Math.round(twoStarShare * 100) },
    { stars: 1, percent: Math.round(oneStarShare * 100) },
  ];
}
