/**
 * Media URL helper.
 *
 * All image assets referenced from code should flow through these
 * helpers so we can swap between the local `public/` bundle, the OSS
 * bucket, or a future CDN by changing a single env var, and so we can
 * apply Alibaba Cloud OSS Image Processing (`x-oss-process=image/...`)
 * presets uniformly.
 *
 * Base resolution order:
 *   1. `NEXT_PUBLIC_MEDIA_BASE` — absolute origin (no trailing slash needed).
 *   2. Default OSS public endpoint for the `mist-architects-media` bucket.
 *
 * Bucket-relative paths look like:
 *   `home/horizontal/01 深圳·梦工场·青年实验剧场.jpg`
 *   `LOGO/logo.png`
 *
 * Path segments are URL-encoded so Chinese filenames, spaces, and
 * middle dots produce valid URLs without double-encoding the path
 * separators.
 *
 * Quality presets, layouts, and the OSS IMG parameter format are
 * documented in `docs/IMAGE_PIPELINE.md`. Keep that file in sync when
 * adjusting the tables below.
 */

const DEFAULT_MEDIA_BASE = "https://mist-architects-media.oss-cn-shenzhen.aliyuncs.com";

const rawBase = process.env.NEXT_PUBLIC_MEDIA_BASE ?? DEFAULT_MEDIA_BASE;
const MEDIA_BASE = rawBase.replace(/\/+$/, "");
const USE_DEV_MEDIA_PROXY =
  process.env.NODE_ENV === "development" &&
  MEDIA_BASE === DEFAULT_MEDIA_BASE &&
  process.env.NEXT_PUBLIC_DISABLE_MEDIA_PROXY !== "1";

/**
 * Output formats supported by the OSS IMG service. `jpg` is the
 * raster fallback and matches whatever the source already encodes
 * to (JPEG/PNG retain their format if `format` is omitted).
 */
export type MediaFormat = "avif" | "webp" | "jpg";

/**
 * Compression presets — the named "quality levels" requested in
 * the design discussion. They control the encoder quality settings
 * for each output format. Pixel size is decided separately by the
 * layout helpers below.
 *
 * - `high`: hero photography. Preserves subtle gradients (skies,
 *   glass reflections, soft shadows). ~900KB-1.3MB at 3840w WebP.
 * - `std`: featured tiles, gallery imagery. ~200-400KB at 1600w WebP.
 * - `low`: thumbnails, decorative imagery. Aggressively compressed.
 * - `raw`: bypass OSS IMG entirely. Use for vector-like PNGs
 *   (logo) and any asset where the original is already small.
 */
export type Quality = "high" | "std" | "low" | "raw";

const COMPRESSION: Record<Exclude<Quality, "raw">, Record<MediaFormat, number>> = {
  // Tuned 2026-04-18 (round 3). Round 2 (WebP 90 / AVIF 72) still
  // not crisp enough on 4K monitors per client review. Pushed quality
  // up another notch — 4K hero WebP now ~1.45–1.82MB, just under the
  // 2MB ceiling. AVIF 2560 stays ~256–311KB. See
  // docs/IMAGE_PIPELINE.md §5 for the full benchmark table.
  high: { webp: 92, avif: 78, jpg: 95 },
  std: { webp: 88, avif: 72, jpg: 90 },
  low: { webp: 82, avif: 62, jpg: 85 }
};

/**
 * Layout presets bundle the size ladder, sizes attribute, and quality
 * tier for each major image use case. Component code just picks a
 * layout name; the pipeline handles widths and compression.
 *
 * Width ladders are powers-of-1.5 to give responsive picking enough
 * granularity without ballooning the number of derivative URLs the
 * CDN has to cache. The largest entry is the upper bound an actual
 * device would request; browser srcset selection handles DPR.
 */
export type Layout =
  | "hero-landscape"
  | "hero-wide"
  | "hero-portrait"
  | "about-hero"
  | "feature"
  | "portrait"
  | "thumb";

/**
 * Optional center-crop spec. When set, OSS IMG runs `m_fill` instead
 * of `m_lfit`, scaling the source to cover the target box and cropping
 * the excess from the long edge. Used when the layout requires a
 * specific output aspect ratio different from the source.
 *
 * `aspectRatio` is `width / height` (e.g. `16/9 ≈ 1.78`).
 */
type CropSpec = {
  aspectRatio: number;
};

type LayoutSpec = {
  widths: number[];
  quality: Quality;
  sizes: string;
  crop?: CropSpec;
};

/**
 * Alibaba OSS IMG caps AVIF conversion at 4096px wide AND 9,437,184
 * total pixels. A landscape 3:2 photo at 3840w → 3840×2560 ≈ 9.83M
 * pixels, which trips the pixel cap (returns `AvifExceedRange`). To
 * stay safely under the limit for any aspect ratio without per-image
 * tuning, cap AVIF rungs at 2560w. Anything larger falls back to
 * WebP, which has no such limit. JPG is unconstrained.
 */
const AVIF_MAX_WIDTH = 2560;

const LAYOUTS: Record<Layout, LayoutSpec> = {
  // Full-screen landscape hero. Top variant is on-demand 4K.
  // Used when viewport aspect is near-square (iPad-ish). Source 4:3
  // master is served as-is via m_lfit; CSS `object-fit: contain` keeps
  // the full frame visible.
  "hero-landscape": {
    widths: [1280, 1920, 2560, 3840],
    quality: "high",
    sizes: "100vw"
  },
  // Full-screen landscape hero cropped to 16:9. Used on wide desktop
  // viewports (≥ ~16:10) so the hero fills the screen without
  // letterboxing. OSS `m_fill` center-crops the 4:3 master to 16:9 at
  // request time — no manual asset duplication needed.
  "hero-wide": {
    widths: [1280, 1920, 2560, 3840],
    quality: "high",
    sizes: "100vw",
    crop: { aspectRatio: 16 / 9 }
  },
  // Portrait hero variant for narrow viewports.
  "hero-portrait": {
    widths: [720, 1080, 1440, 2160],
    quality: "high",
    sizes: "100vw"
  },
  // About page full-screen carousel.
  "about-hero": {
    widths: [1280, 1920, 2560, 3840],
    quality: "high",
    sizes: "100vw"
  },
  // Homepage featured tiles. ~33vw on desktop, ~50vw tablet, full on mobile.
  feature: {
    widths: [640, 960, 1280, 1920],
    quality: "std",
    sizes: "(min-width: 1100px) 33vw, (min-width: 720px) 50vw, 100vw"
  },
  // Founder portrait, project portrait shots.
  portrait: {
    widths: [720, 1080, 1440, 2160],
    quality: "high",
    sizes: "(min-width: 1180px) 38vw, (min-width: 760px) 44vw, 100vw"
  },
  // Small thumbnails, list rows, decorative inline images.
  thumb: {
    widths: [400, 640, 960],
    quality: "std",
    sizes: "(min-width: 720px) 200px, 50vw"
  }
};

type ProcessOptions = {
  width?: number;
  quality?: Quality;
  format?: MediaFormat;
  /**
   * Optional center-crop aspect ratio (`width / height`). When set with
   * a `width`, the output is re-framed to `w × round(w / aspectRatio)`
   * using OSS `m_fill` (scale-to-cover + center-crop). Used by layouts
   * that need a different output shape than the source — e.g. serving
   * a 16:9 hero crop from a 4:3 master so 16:9 viewports fill without
   * letterboxing.
   */
  cropAspectRatio?: number;
};

function encodePath(path: string): string {
  const trimmed = path.replace(/^\/+/, "");
  return trimmed
    .split("/")
    .map((segment) => encodeURIComponent(segment))
    .join("/");
}

function buildOssProcess(opts: ProcessOptions): string | null {
  const { width, quality, format, cropAspectRatio } = opts;

  if (!width && !format && (!quality || quality === "raw")) {
    return null;
  }

  if (quality === "raw") {
    return null;
  }

  const ops: string[] = ["image"];

  if (width) {
    if (cropAspectRatio && cropAspectRatio > 0) {
      // `m_fill` scales the source to cover the w×h box and crops
      // excess from the long edge (center-crop). Use this when the
      // layout demands a specific output aspect ratio different from
      // the source — e.g. 16:9 hero crop from a 4:3 master.
      const height = Math.round(width / cropAspectRatio);
      ops.push(`resize,w_${width},h_${height},m_fill`);
    } else {
      // `m_lfit` (limit-fit) means: scale down if larger than width, never
      // scale up. Keeps the aspect ratio. Critical for source assets that
      // are already smaller than the requested ladder rung.
      ops.push(`resize,w_${width},m_lfit`);
    }
  }

  if (quality && format) {
    const q = COMPRESSION[quality][format];
    ops.push(`quality,q_${q}`);
  } else if (quality) {
    // Default to WebP encoder quality when format unspecified — the
    // most common path. Caller can override via explicit format.
    ops.push(`quality,q_${COMPRESSION[quality].webp}`);
  }

  if (format && format !== "jpg") {
    ops.push(`format,${format}`);
  }

  return ops.join("/");
}

/**
 * Resolve a bucket-relative path to a full URL.
 *
 * Pass-through behavior:
 *   - Absolute URLs (`https://...`, `data:...`) returned unchanged.
 *   - When `quality === "raw"` or no processing options given, the
 *     URL has no `x-oss-process` query.
 */
export function mediaUrl(path: string, opts: ProcessOptions = {}): string {
  if (!path) {
    return MEDIA_BASE;
  }

  if (/^https?:\/\//i.test(path) || path.startsWith("data:")) {
    return path;
  }

  const process = buildOssProcess(opts);
  if (USE_DEV_MEDIA_PROXY) {
    const params = new URLSearchParams({ path });
    if (process) {
      params.set("process", process);
    }
    return `/api/media?${params.toString()}`;
  }

  const url = `${MEDIA_BASE}/${encodePath(path)}`;
  return process ? `${url}?x-oss-process=${process}` : url;
}

/**
 * Build a `srcset` string for a single (path, format, quality)
 * combination across a width ladder.
 *
 * Output shape: `"url 1280w, url 1920w, url 2560w"`.
 */
export function mediaSrcSet(
  path: string,
  opts: {
    widths: number[];
    quality: Quality;
    format: MediaFormat;
    cropAspectRatio?: number;
  }
): string {
  return opts.widths
    .map((width) => {
      const url = mediaUrl(path, {
        width,
        quality: opts.quality,
        format: opts.format,
        cropAspectRatio: opts.cropAspectRatio
      });
      return `${url} ${width}w`;
    })
    .join(", ");
}

/**
 * Bundle of sources used to render a `<picture>` element with
 * AVIF + WebP + raster fallback.
 */
export type PictureSet = {
  avifSrcSet: string;
  webpSrcSet: string;
  fallbackSrc: string;
  sizes: string;
  /** Largest configured width. Used as the `<img>` natural size hint. */
  largestWidth: number;
};

/**
 * Resolve a layout preset for a bucket-relative path.
 *
 * Returns the three srcset variants and the sizes attribute the
 * browser uses to pick the right rung. Render with `<OssPicture>`
 * or a manual `<picture>` element.
 */
export function pictureSet(path: string, layout: Layout): PictureSet {
  const spec = LAYOUTS[layout];
  const widths = spec.widths;
  const largestWidth = widths[widths.length - 1];
  const cropAspectRatio = spec.crop?.aspectRatio;

  // AVIF rungs are capped — see AVIF_MAX_WIDTH note. Always retain
  // at least the smallest rung so the AVIF source is never empty
  // (an empty srcset would silently disable AVIF fallback ordering).
  const avifWidthsCapped = widths.filter((w) => w <= AVIF_MAX_WIDTH);
  const avifWidths = avifWidthsCapped.length > 0 ? avifWidthsCapped : [widths[0]];

  return {
    avifSrcSet: mediaSrcSet(path, {
      widths: avifWidths,
      quality: spec.quality,
      format: "avif",
      cropAspectRatio
    }),
    webpSrcSet: mediaSrcSet(path, {
      widths,
      quality: spec.quality,
      format: "webp",
      cropAspectRatio
    }),
    fallbackSrc: mediaUrl(path, {
      width: largestWidth,
      quality: spec.quality,
      format: "jpg",
      cropAspectRatio
    }),
    sizes: spec.sizes,
    largestWidth
  };
}

export { MEDIA_BASE, COMPRESSION, LAYOUTS };
