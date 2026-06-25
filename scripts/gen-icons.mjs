// Generates the AURORE PWA icons (a Dakar-sunset orb) as real PNG files.
// No image deps: builds RGBA pixels, deflates with zlib, writes valid PNG chunks.
// Run: node scripts/gen-icons.mjs   → writes into public/
import { deflateSync } from "node:zlib";
import { writeFileSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const OUT = join(dirname(fileURLToPath(import.meta.url)), "..", "public");
mkdirSync(OUT, { recursive: true });

// Sunset gradient stops: warm core → dusk plum at the edges (content stays centred,
// which is exactly what a "maskable" icon wants).
const STOPS = [
  [0.0, [255, 239, 208]],
  [0.32, [248, 182, 96]],
  [0.55, [232, 129, 74]],
  [0.8, [199, 90, 51]],
  [1.0, [110, 47, 68]],
];

const lerp = (a, b, t) => Math.round(a + (b - a) * t);
function colorAt(d) {
  for (let i = 1; i < STOPS.length; i++) {
    if (d <= STOPS[i][0]) {
      const [p0, c0] = STOPS[i - 1];
      const [p1, c1] = STOPS[i];
      const t = (d - p0) / (p1 - p0);
      return [lerp(c0[0], c1[0], t), lerp(c0[1], c1[1], t), lerp(c0[2], c1[2], t)];
    }
  }
  return STOPS[STOPS.length - 1][1];
}

// CRC32 (PNG chunk checksums)
const CRC = (() => {
  const t = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    t[n] = c >>> 0;
  }
  return t;
})();
function crc32(buf) {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) c = CRC[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}
function chunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);
  const typeBuf = Buffer.from(type, "ascii");
  const body = Buffer.concat([typeBuf, data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(body), 0);
  return Buffer.concat([len, body, crc]);
}

function png(size) {
  const raw = Buffer.alloc(size * (size * 4 + 1)); // +1 filter byte per row
  const c = (size - 1) / 2;
  const norm = Math.SQRT2 * c;
  let p = 0;
  for (let y = 0; y < size; y++) {
    raw[p++] = 0; // filter: none
    for (let x = 0; x < size; x++) {
      const d = Math.min(1, Math.hypot(x - c, y - c) / norm);
      const [r, g, b] = colorAt(d);
      raw[p++] = r; raw[p++] = g; raw[p++] = b; raw[p++] = 255;
    }
  }
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(size, 0);
  ihdr.writeUInt32BE(size, 4);
  ihdr[8] = 8;  // bit depth
  ihdr[9] = 6;  // color type RGBA
  const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  return Buffer.concat([sig, chunk("IHDR", ihdr), chunk("IDAT", deflateSync(raw, { level: 9 })), chunk("IEND", Buffer.alloc(0))]);
}

const FILES = [
  ["icon-192.png", 192],
  ["icon-512.png", 512],
  ["icon-maskable-512.png", 512],
  ["apple-touch-icon.png", 180],
  ["favicon.png", 32],
];
for (const [name, size] of FILES) {
  writeFileSync(join(OUT, name), png(size));
  console.log("wrote", name, `(${size}×${size})`);
}
