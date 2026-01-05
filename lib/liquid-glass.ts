/**
 * Liquid Glass Effect Utilities
 * Based on SVG displacement map technique
 */

export interface LiquidGlassConfig {
  height: number;
  width: number;
  radius: number;
  depth?: number;
  strength?: number;
  chromaticAberration?: number;
}

export function getDisplacementMap({ height, width, radius, depth = 10 }: LiquidGlassConfig): string {
  return (
    "data:image/svg+xml;utf8," +
    encodeURIComponent(
      `<svg height="${height}" width="${width}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
        <style>
          .mix { mix-blend-mode: screen; }
        </style>
        <defs>
          <linearGradient 
            id="Y" 
            x1="0" 
            x2="0" 
            y1="${Math.ceil((radius / height) * 15)}%" 
            y2="${Math.floor(100 - (radius / height) * 15)}%">
            <stop offset="0%" stop-color="#0F0" />
            <stop offset="100%" stop-color="#000" />
          </linearGradient>
          <linearGradient 
            id="X" 
            x1="${Math.ceil((radius / width) * 15)}%" 
            x2="${Math.floor(100 - (radius / width) * 15)}%"
            y1="0" 
            y2="0">
            <stop offset="0%" stop-color="#F00" />
            <stop offset="100%" stop-color="#000" />
          </linearGradient>
        </defs>
        <rect x="0" y="0" height="${height}" width="${width}" fill="#808080" />
        <g filter="blur(2px)">
          <rect x="0" y="0" height="${height}" width="${width}" fill="#000080" />
          <rect
            x="0"
            y="0"
            height="${height}"
            width="${width}"
            fill="url(#Y)"
            class="mix"
          />
          <rect
            x="0"
            y="0"
            height="${height}"
            width="${width}"
            fill="url(#X)"
            class="mix"
          />
          <rect
            x="${depth}"
            y="${depth}"
            height="${height - 2 * depth}"
            width="${width - 2 * depth}"
            fill="#808080"
            rx="${radius}"
            ry="${radius}"
            filter="blur(${depth}px)"
          />
        </g>
      </svg>`
    )
  );
}

export function getDisplacementFilter({
  height,
  width,
  radius,
  depth = 10,
  strength = 100,
  chromaticAberration = 0,
}: LiquidGlassConfig): string {
  return (
    "data:image/svg+xml;utf8," +
    encodeURIComponent(
      `<svg height="${height}" width="${width}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <filter id="displace" color-interpolation-filters="sRGB">
            <feImage x="0" y="0" height="${height}" width="${width}" href="${getDisplacementMap({
              height,
              width,
              radius,
              depth,
            })}" result="displacementMap" />
            <feDisplacementMap
              transform-origin="center"
              in="SourceGraphic"
              in2="displacementMap"
              scale="${strength + chromaticAberration * 2}"
              xChannelSelector="R"
              yChannelSelector="G"
            />
            <feColorMatrix
              type="matrix"
              values="1 0 0 0 0
                      0 0 0 0 0
                      0 0 0 0 0
                      0 0 0 1 0"
              result="displacedR"
            />
            <feDisplacementMap
              in="SourceGraphic"
              in2="displacementMap"
              scale="${strength + chromaticAberration}"
              xChannelSelector="R"
              yChannelSelector="G"
            />
            <feColorMatrix
              type="matrix"
              values="0 0 0 0 0
                      0 1 0 0 0
                      0 0 0 0 0
                      0 0 0 1 0"
              result="displacedG"
            />
            <feDisplacementMap
              in="SourceGraphic"
              in2="displacementMap"
              scale="${strength}"
              xChannelSelector="R"
              yChannelSelector="G"
            />
            <feColorMatrix
              type="matrix"
              values="0 0 0 0 0
                      0 0 0 0 0
                      0 0 1 0 0
                      0 0 0 1 0"
              result="displacedB"
            />
            <feBlend in="displacedR" in2="displacedG" mode="screen"/>
            <feBlend in2="displacedB" mode="screen"/>
          </filter>
        </defs>
      </svg>`
    ) + "#displace"
  );
}

export function supportsBackdropFilterUrl(): boolean {
  if (typeof window === "undefined") return false;
  const testEl = document.createElement("div");
  testEl.style.cssText = "backdrop-filter: url(#test)";
  return (
    testEl.style.backdropFilter === "url(#test)" ||
    testEl.style.backdropFilter === 'url("#test")'
  );
}

export interface RedrawGlassOptions {
  blur?: number;
  strength?: number;
  saturate?: number;
  brightness?: number;
  chromaticAberration?: number;
  depth?: number;
}

export function redrawGlass(
  glassElement: HTMLElement,
  glassBoxElement: HTMLElement,
  contentElement: HTMLElement,
  options: RedrawGlassOptions = {}
): void {
  const rect = contentElement.getBoundingClientRect();
  const width = Math.round(rect.width);
  const height = Math.round(rect.height);

  const blur = options.blur ?? parseFloat(glassBoxElement.dataset.blur || "0");
  const chromaticAberration = options.chromaticAberration ?? parseFloat(glassBoxElement.dataset.cab || "0");
  const depth = options.depth ?? parseFloat(glassBoxElement.dataset.depth || "10");
  const strength = options.strength ?? parseFloat(glassBoxElement.dataset.strength || "100");
  const saturate = options.saturate ?? parseFloat(glassBoxElement.dataset.saturate || "1.2");
  const brightness = options.brightness ?? parseFloat(glassBoxElement.dataset.brightness || "1.6");
  const radius = parseFloat(getComputedStyle(glassElement).borderRadius || "0");

  glassBoxElement.style.height = `${height}px`;
  glassBoxElement.style.width = `${width}px`;

  if (supportsBackdropFilterUrl()) {
    glassBoxElement.style.backdropFilter = `blur(${blur / 2}px) url('${getDisplacementFilter({
      height,
      width,
      radius,
      depth,
      strength,
      chromaticAberration,
    })}') blur(${blur}px) brightness(${brightness}) saturate(${saturate})`;
  } else {
    (glassBoxElement.style as any).webkitBackdropFilter = `blur(${width / 10}px) saturate(180%)`;
  }
}

