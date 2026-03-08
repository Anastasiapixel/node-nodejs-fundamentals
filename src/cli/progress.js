import process from 'process';

const progress = () => {
  const args = process.argv.slice(2);
  const duration = parseInt(args[args.indexOf('--duration')+1]) || 5000;
  const interval = parseInt(args[args.indexOf('--interval')+1]) || 100;
  const length = parseInt(args[args.indexOf('--length')+1]) || 30;
  const color = args[args.indexOf('--color')+1] || null;

  const steps = Math.ceil(duration / interval);
  let step = 0;

  const timer = setInterval(() => {
    step++;
    const pct = Math.min((step/steps)*100, 100);
    const filledLen = Math.round(length * pct/100);
    const emptyLen = length - filledLen;
    let filled = '█'.repeat(filledLen);
    if (color) {
      const r = parseInt(color.slice(1,3),16);
      const g = parseInt(color.slice(3,5),16);
      const b = parseInt(color.slice(5,7),16);
      filled = `\x1b[38;2;${r};${g};${b}m${filled}\x1b[0m`;
    }
    const bar = `[${filled}${' '.repeat(emptyLen)}] ${pct.toFixed(0)}%`;
    process.stdout.write(`\r${bar}`);
    if (pct>=100) {
      clearInterval(timer);
      process.stdout.write('\nDone!\n');
    }
  }, interval);
};

progress();
