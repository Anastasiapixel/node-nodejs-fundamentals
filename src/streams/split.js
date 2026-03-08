import { createReadStream, createWriteStream } from 'fs';
import { Transform } from 'stream';
import process from 'process';

const split = async () => {
  const args = process.argv;
  const n = parseInt(args[args.indexOf('--lines') + 1]) || 10;

  let buffer = '';
  let count = 0;
  let fileIndex = 1;
  let writer = createWriteStream(`chunk_${fileIndex}.txt`);

  const transformer = new Transform({
    transform(chunk, enc, cb) {
      buffer += chunk.toString();
      const lines = buffer.split('\n');
      buffer = lines.pop();

      for (const line of lines) {
        if (count === n) {
          writer.end();
          fileIndex++;
          writer = createWriteStream(`chunk_${fileIndex}.txt`);
          count = 0;
        }

        writer.write(line + '\n');
        count++;
      }

      cb();
    },
    flush(cb) {
      if (buffer) writer.write(buffer);
      writer.end();
      cb();
    }
  });

  createReadStream('src/streams/source.txt').pipe(transformer);
};

await split();