const CLOUD_NAME = "dumehdu0q";
const BASE_URL = `https://res.cloudinary.com/${CLOUD_NAME}`;

export interface StickerImage {
  public_id: string;
  url: string;
  thumbnail: string;
  width: number;
  height: number;
  filename: string;
}

export const CATEGORIES = [
  { id: "all", label: "전체", tag: "", labelEn: "all" },
  { id: "corporate", label: "기업+학교", tag: "corporate", labelEn: "corporate & school" },
  { id: "thanks", label: "답례+감사", tag: "thanks", labelEn: "thank you & gift" },
  { id: "birthday", label: "생일+기념일", tag: "anniversary", labelEn: "birthday & anniversary" },
  { id: "support", label: "응원+선물", tag: "support", labelEn: "support & present" },
  { id: "fandom", label: "조공+서포트", tag: "fandom", labelEn: "fandom & celebrity" },
  { id: "wedding", label: "하객+결혼식", tag: "wedding", labelEn: "wedding & guest" },
  { id: "event", label: "행사+세미나", tag: "event", labelEn: "event & seminar" },
] as const;

export type CategoryId = (typeof CATEGORIES)[number]["id"];

export function getImageUrl(publicId: string, width?: number): string {
  const transforms = width
    ? `w_${width},c_scale,f_auto,q_auto`
    : "f_auto,q_auto";
  return `${BASE_URL}/image/upload/${transforms}/${publicId}`;
}

export function getThumbnailUrl(publicId: string): string {
  return `${BASE_URL}/image/upload/w_400,c_scale,f_auto,q_auto/${publicId}`;
}

export function getFullUrl(publicId: string): string {
  return `${BASE_URL}/image/upload/f_auto,q_auto/${publicId}`;
}

/**
 * Fetch stickers using Cloudinary's Client-Side Resource List API.
 * Images must be tagged with the English tag name (e.g. "corporate", "thanks").
 * Requires "Resource list" enabled in Cloudinary Settings > Security.
 */
export async function fetchStickers(
  tag: string,
  nextCursor?: string
): Promise<{ images: StickerImage[]; nextCursor?: string }> {
  if (!tag) {
    return fetchAllCategories(nextCursor);
  }

  try {
    const params = new URLSearchParams({
      max_results: "30",
      ...(nextCursor ? { next_cursor: nextCursor } : {}),
    });

    const url = `${BASE_URL}/image/list/${encodeURIComponent(tag)}.json?${params}`;
    console.log("[cloudinary] fetching:", url);

    const response = await fetch(url);

    if (!response.ok) {
      console.warn(
        `[cloudinary] Tag "${tag}" returned ${response.status}. ` +
        `Make sure "Resource list" is enabled in Cloudinary Settings > Security, ` +
        `and images are tagged with "${tag}".`
      );
      return { images: [] };
    }

    return parseResponse(await response.json());
  } catch (error) {
    console.error("Error fetching stickers:", error);
    return { images: [] };
  }
}

function parseResponse(data: any): {
  images: StickerImage[];
  nextCursor?: string;
} {
  const images: StickerImage[] = (data.resources || []).map((r: any) => ({
    public_id: r.public_id,
    url: getFullUrl(r.public_id),
    thumbnail: getThumbnailUrl(r.public_id),
    width: r.width || 400,
    height: r.height || 400,
    filename: r.public_id.split("/").pop() || "",
  }));

  // Sort by filename descending (newest date-prefixed files first)
  images.sort((a, b) => b.filename.localeCompare(a.filename));

  return {
    images,
    nextCursor: data.next_cursor,
  };
}

async function fetchAllCategories(
  _nextCursor?: string
): Promise<{ images: StickerImage[]; nextCursor?: string }> {
  const categoryTags = CATEGORIES.filter((c) => c.id !== "all");
  const results = await Promise.allSettled(
    categoryTags.map((cat) => fetchStickers(cat.tag))
  );

  const allImages: StickerImage[] = [];
  results.forEach((result) => {
    if (result.status === "fulfilled") {
      allImages.push(...result.value.images);
    }
  });

  // Sort by filename descending (newest first)
  allImages.sort((a, b) => b.filename.localeCompare(a.filename));
  return { images: allImages };
}

export function searchStickers(
  images: StickerImage[],
  query: string
): StickerImage[] {
  if (!query.trim()) return images;
  const lower = query.toLowerCase();
  return images.filter((img) => img.filename.toLowerCase().includes(lower));
}
