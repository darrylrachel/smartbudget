// Code-native geometric app mark; actual RGBA PNG files with no image dependencies.
import { deflateSync } from 'node:zlib';
import { writeFileSync } from 'node:fs';
function crc32(buffer) { let crc = -1; for (const byte of buffer) { crc ^= byte; for (let i = 0; i < 8; i++) crc = (crc >>> 1) ^ ((crc & 1) ? 0xedb88320 : 0); } return (crc ^ -1) >>> 0; }
function chunk(type, data) { const label = Buffer.from(type), length = Buffer.alloc(4), crc = Buffer.alloc(4); length.writeUInt32BE(data.length); crc.writeUInt32BE(crc32(Buffer.concat([label, data]))); return Buffer.concat([length, label, data, crc]); }
for (const [size, name] of [[192,'icon-192'],[512,'icon-512'],[512,'maskable-512']]) {
  const bytes = Buffer.alloc((size * 4 + 1) * size);
  for (let y = 0; y < size; y++) for (let x = 0; x < size; x++) { const u = x / size, v = y / size; const mark = ((u > .30 && u < .67 && v > .30 && v < .39) || (u > .30 && u < .40 && v > .36 && v < .52) || (u > .30 && u < .67 && v > .47 && v < .56) || (u > .57 && u < .67 && v > .52 && v < .68) || (u > .30 && u < .67 && v > .64 && v < .73)); const i = y * (size * 4 + 1) + 1 + x * 4; bytes.set(mark ? [247,248,244,255] : [23,77,56,255], i); }
  const header = Buffer.alloc(13); header.writeUInt32BE(size); header.writeUInt32BE(size,4); header[8] = 8; header[9] = 6;
  writeFileSync(`public/${name}.png`, Buffer.concat([Buffer.from([137,80,78,71,13,10,26,10]), chunk('IHDR',header), chunk('IDAT',deflateSync(bytes)), chunk('IEND',Buffer.alloc(0))]));
}
