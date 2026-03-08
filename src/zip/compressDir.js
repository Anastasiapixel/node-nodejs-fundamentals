import { readdir, stat, mkdir } from 'fs/promises';
import { createReadStream, createWriteStream } from 'fs';
import { createBrotliCompress } from 'zlib';
import { join, relative } from 'path';

const base = join(process.cwd(), 'workspace/toCompress');
const archivePath = join(process.cwd(), 'workspace/compressed/archive.br');

const collectFiles = async (dir, list = []) => {
  const entries = await readdir(dir);

  for (const entry of entries) {
    const full = join(dir, entry);
    const info = await stat(full);
    if (info.isDirectory()) {
      await collectFiles(full, list);
    } else {
      list.push(full);
    }
  }
  return list;
};

const compressDir = async () => {
  try {
    const files = await collectFiles(base);
    await mkdir(join(process.cwd(), 'workspace/compressed'), { recursive: true });

    const ws = createWriteStream(archivePath);
    const brotli = createBrotliCompress();

    brotli.pipe(ws);

    for (const file of files) {
      const chunks = [];
      await new Promise((res, rej) => {
        const rs = createReadStream(file);
        rs.on('data', c => chunks.push(c));
        rs.on('end', () => {
          brotli.write(JSON.stringify({
            path: relative(base, file),
            content: Buffer.concat(chunks).toString('base64')
          }) + '\n');
          res();
        });
        rs.on('error', rej);
      });
    }

    brotli.end();

    await new Promise((res, rej) => ws.on('finish', res).on('error', rej));

  } catch {
    throw new Error('FS operation failed');
  }
};

await compressDir();