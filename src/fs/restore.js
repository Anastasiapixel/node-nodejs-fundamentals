import { promises as fs } from 'fs';
import path from 'path';

const root = path.join(path.resolve(), 'workspace_restored');
const restore = async () => {
  try {
    const raw = await fs.readFile('snapshot.json', 'utf8');
    const { entries = [] } = JSON.parse(raw);

    await fs.mkdir(root, { recursive: true });

    for (const e of entries) {
      const p = path.join(root, e.path);

      if (e.type === 'directory') {
        await fs.mkdir(p, { recursive: true });
      }

      if (e.type === 'file') {
        await fs.mkdir(path.dirname(p), { recursive: true });
        await fs.writeFile(p, Buffer.from(e.content, 'base64'));
      }
    }

    console.log('Restore completed successfully!');
  } catch (err) {
    console.error(err);
    throw new Error('FS operation failed');
  }
};

await restore();
