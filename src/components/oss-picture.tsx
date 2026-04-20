/**
 * `<OssPicture>` — render an OSS-backed image as a `<picture>` element
 * with AVIF + WebP sources and a JPG fallback `<img>`.
 *
 * The component delegates all width/quality/format decisions to the
 * `pictureSet()` helper in `@/lib/media`. Component code only picks a
 * `Layout` preset (e.g. `"hero-landscape"`, `"feature"`); the helper
 * decides the width ladder, the `sizes` attribute, and the encoder
 * quality.
 *
 * Why `<picture>` instead of `next/image`?
 *   - OSS Image Processing already handles resize + format negotiation
 *     at the edge (`x-oss-process=image/...`). Layering `next/image`
 *     on top would double-process and disable our explicit AVIF source.
 *   - `<picture>` gives the browser native AVIF→WebP→JPG fallback with
 *     zero JS, which keeps the homepage hero LCP path lightweight.
 *
 * The `<img>` tag is a direct descendant, so existing CSS selectors
 * like `.story-tile img { ... }` continue to work without changes.
 */

import type { CSSProperties, ImgHTMLAttributes } from "react";

import { pictureSet, type Layout } from "@/lib/media";

type ImgPassThrough = Pick<
  ImgHTMLAttributes<HTMLImageElement>,
  "decoding" | "fetchPriority" | "draggable" | "onLoad" | "onError"
>;

export type OssPictureProps = {
  /** Bucket-relative path. e.g. `home/horizontal/01 …jpg`. */
  path: string;
  /** Layout preset — picks width ladder, quality, and `sizes`. */
  layout: Layout;
  /** Accessible alt text. Pass `""` for purely decorative imagery. */
  alt: string;
  /** Class on the `<picture>` element. */
  pictureClassName?: string;
  /** Class on the inner `<img>` element. Most page CSS targets this. */
  className?: string;
  /** Style on the inner `<img>` element. */
  style?: CSSProperties;
  /**
   * Above-the-fold images (hero, first featured tile). Eagerly loads
   * the fallback img and hints the browser to fetch it with high
   * priority. Defaults to lazy loading.
   */
  priority?: boolean;
  /**
   * Override the `sizes` attribute when the layout default doesn't
   * match the actual placement (rare — prefer adding a layout preset).
   */
  sizesOverride?: string;
} & ImgPassThrough;

export function OssPicture({
  path,
  layout,
  alt,
  pictureClassName,
  className,
  style,
  priority = false,
  sizesOverride,
  decoding,
  fetchPriority,
  draggable,
  onLoad,
  onError
}: OssPictureProps) {
  const set = pictureSet(path, layout);
  const sizes = sizesOverride ?? set.sizes;

  return (
    <picture className={pictureClassName}>
      <source type="image/avif" srcSet={set.avifSrcSet} sizes={sizes} />
      <source type="image/webp" srcSet={set.webpSrcSet} sizes={sizes} />
      <img
        src={set.fallbackSrc}
        alt={alt}
        className={className}
        style={style}
        loading={priority ? "eager" : "lazy"}
        decoding={decoding ?? "async"}
        fetchPriority={fetchPriority ?? (priority ? "high" : undefined)}
        draggable={draggable}
        onLoad={onLoad}
        onError={onError}
        // Largest configured width is the natural-size hint. Aspect
        // ratio is enforced by the layout's CSS rule (e.g. `4 / 3`).
        width={set.largestWidth}
      />
    </picture>
  );
}
