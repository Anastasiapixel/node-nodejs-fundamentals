import { createReadStream, createWriteStream } from 'fs';
import { mkdir, access } from 'fs/promises';
import { createBrotliDecompress } from 'zlib';
import { join, dirname } from 'path';
import readline from 'readline';

const archive = join('workspace', 'compressed', 'archive.br');
const outDir = join('workspace', 'decompressed');

const decompressDir = async () => {
  try {
    await access(archive);
    await mkdir(outDir, { recursive: true });

    const brotliStream = createReadStream(archive).pipe(createBrotliDecompress());

    const rl = readline.createInterface({ input: brotliStream });

    for await (const line of rl) {
      const { path: filePath, content } = JSON.parse(line);
      const target = join(outDir, filePath);
      await mkdir(dirname(target), { recursive: true });
      const ws = createWriteStream(target);
      ws.write(Buffer.from(content, 'base64'));
      ws.end();
    }

  } catch {
    throw new Error('FS operation failed');
  }
};

await decompressDir();