import { promises as fs } from "fs";
import path from "path";
const merge = async () => {
  try {
    const root = path.join(path.resolve(), 'workspace');
    const partsDir = path.join(root, 'parts');
    const output = path.join(root, 'merged.txt');

    await fs.access(partsDir);

    const idx = process.argv.indexOf('--files');
    let files;
    if (idx !== -1 && process.argv[idx + 1]) {
      files = process.argv[idx + 1].split(',');
  } else {
      const items = await fs.readdir(partsDir);
      files = items
      .filter((f) => path.extname(f) === '.txt')
      .sort();
      if (files.length === 0) {
        throw new Error();
      }
    }
    const contents = [];
    for (const file of files) {
      const filePath = path.join(partsDir, file);
      await fs.access(filePath);
      const data = await fs.readFile(filePath, 'utf8');
      contents.push(data, '\n');
    }
    console.log(files);
    await fs.writeFile(output, contents.join(''));
    console.log('Merge completed successfully!');
  } catch (err) {
    console.error(err);
    throw new Error("FS operation failed");
  }
};

await merge();
