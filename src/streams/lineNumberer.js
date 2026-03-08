import { Transform } from 'stream';

const lineNumberer = () => {
  let buffer = '';
  let line = 1;

  const transformer = new Transform({
    transform(chunk, enc, cb) {
      buffer += chunk.toString();
      const lines = buffer.split('\n');
      buffer = lines.pop();

      const numbered = lines.map((l) => `${line++} | ${l}`).join('\n');

      cb(null, numbered + '\n');
    },
    flush(cb) {
      if (buffer) {
        cb(null, `${line} | ${buffer}`);
      } else cb();
    },
  });

  process.stdin.pipe(transformer).pipe(process.stdout);
};

lineNumberer();
