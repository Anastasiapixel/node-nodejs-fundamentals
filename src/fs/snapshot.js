import fs from 'fs';
import path from 'path';

const snapshot = async () => {
  const workspace = path.join(process.cwd(), 'workspace');

  try {
    const st = await fs.promises.stat(workspace);
    if (!st.isDirectory()) throw new Error('FS operation failed');
  } catch (err) {
    throw new Error('FS operation failed');
  }

  const entries = [];

  const walk = async (dir) => {
    const items = await fs.promises.readdir(dir, { withFileTypes: true });
    for (const item of items) {
      const fullPath = path.join(dir, item.name);
      const relPath = path
        .relative(workspace, fullPath)
        .split(path.sep)
        .join('/');

      if (relPath === 'snapshot.json') continue;

      if (item.isDirectory()) {
        entries.push({ path: relPath, type: 'directory' });
        await walk(fullPath);
      } else if (item.isFile()) {
        const st = await fs.promises.stat(fullPath);
        const data = await fs.promises.readFile(fullPath);
        entries.push({
          path: relPath,
          type: 'file',
          size: st.size,
          content: data.toString('base64'),
        });
      }
    }
  };

  await walk(workspace);

  const snapshotObj = {
    rootPath: workspace,
    entries,
  };

  const outPath = path.join(process.cwd(), 'snapshot.json');
  await fs.promises.writeFile(outPath, JSON.stringify(snapshotObj, null, 2));

  console.log(`Snapshot successfully saved!`);
};

await snapshot();
