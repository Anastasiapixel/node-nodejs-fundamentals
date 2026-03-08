import { createReadStream } from 'fs';
import { readFile } from 'fs/promises';
import { createHash } from 'crypto';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const verify = async () => {
  let checksums;
  try {
    const data = await readFile(path.join(__dirname, 'checksums.json'), 'utf8');
    checksums = JSON.parse(data);
  } catch (err) {
    console.error(err);
    throw new Error('FS operation failed');
  }

  for (const [file, expectedHash] of Object.entries(checksums)) {
    const hash = createHash('sha256');

    await new Promise((resolve, reject) => {
      const stream = createReadStream(path.join(__dirname, file));
      stream.on('data', chunk => hash.update(chunk));
      stream.on('end', resolve);
      stream.on('error', reject);
    });

    const actualHash = hash.digest('hex');
    console.log(`${file} — ${actualHash === expectedHash ? 'OK' : 'FAIL'}`);
  }
};

await verify();
