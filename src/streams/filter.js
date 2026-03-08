import { Transform } from 'stream';
import process from 'process';

const filter = () => {
  const args = process.argv;
  const pattern = args[args.indexOf('--pattern') + 1] || '';

  let buffer = '';

  const transformer = new Transform({
    transform(chunk, enc, cb) {
      buffer += chunk.toString();
      const lines = buffer.split('\n');
      buffer = lines.pop();

      const filtered = lines
        .filter(l => l.includes(pattern))
        .join('\n');

      cb(null, filtered ? filtered + '\n' : '');
    },
    flush(cb) {
      if (buffer.includes(pattern)) {
        cb(null, buffer);
      } else cb();
    }
  });

  process.stdin.pipe(transformer).pipe(process.stdout);
};

filter();
