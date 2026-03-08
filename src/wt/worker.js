import { parentPort } from 'worker_threads';

parentPort.on('message', (data) => {
  if (!Array.isArray(data)) {
    parentPort.postMessage([]);
    return;
  }

  const sorted = data.slice().sort((a, b) => a - b);

  parentPort.postMessage(sorted);
});
