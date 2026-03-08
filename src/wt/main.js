import { Worker } from 'worker_threads';
import { cpus } from 'os';
import { readFile } from 'fs/promises';
import { join } from 'path';

function kWayMerge(arrays) {
  const result = [];
  const pointers = new Array(arrays.length).fill(0);

  while (true) {
    let minVal = Infinity;
    let minIdx = -1;

    for (let i = 0; i < arrays.length; i++) {
      if (pointers[i] < arrays[i].length && arrays[i][pointers[i]] < minVal) {
        minVal = arrays[i][pointers[i]];
        minIdx = i;
      }
    }

    if (minIdx === -1) break;

    result.push(minVal);
    pointers[minIdx]++;
  }

  return result;
}

const main = async () => {
  // Считываем массив чисел из data.json
  const filePath = join(process.cwd(), 'src', 'wt', 'data.json');
  const raw = await readFile(filePath, 'utf-8');
  const data = JSON.parse(raw);

  const numCores = cpus().length;
  const chunkSize = Math.ceil(data.length / numCores);

  const chunks = [];
  for (let i = 0; i < numCores; i++) {
    chunks.push(data.slice(i * chunkSize, (i + 1) * chunkSize));
  }

  const promises = chunks.map(
    (chunk) =>
      new Promise((resolve, reject) => {
        const worker = new Worker(join(process.cwd(), 'src', 'wt', 'worker.js'));
        worker.postMessage(chunk);

        worker.on('message', (sortedChunk) => {
          resolve(sortedChunk);
          worker.terminate();
        });

        worker.on('error', reject);
        worker.on('exit', (code) => {
          if (code !== 0) reject(new Error(`Worker stopped with exit code ${code}`));
        });
      })
  );

  const sortedChunks = await Promise.all(promises);

  const finalSorted = kWayMerge(sortedChunks);

  console.log(finalSorted);
};

await main();