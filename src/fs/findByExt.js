import { promises as fs } from 'fs';
import path from 'path';
const findByExt = async () => {
  try {
    const root = path.join(path.resolve(), 'workspace');

    const args = process.argv.slice(2);
    const ext = `.${args[args.indexOf('--ext') + 1] ?? 'txt'}`;

    await fs.access(root);

    const result = [];

    const walk = async (dir) => {
      const items = await fs.readdir(dir, { withFileTypes: true });

      for (const item of items) {
        const full = path.join(dir, item.name);

        if (item.isDirectory()) {
          await walk(full);
        } else if (path.extname(item.name) === ext) {
          result.push(path.relative(root, full));
        }
      }
    };

    await walk(root);

    result.sort().forEach((file) => console.log(file));
  } catch {
    throw new Error('FS operation failed');
  }
};

await findByExt();
