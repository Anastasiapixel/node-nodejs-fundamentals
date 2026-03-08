import readline from 'readline';
import process from 'process';
const interactive = () => {
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: '>',
});

  const start = process.uptime();
  rl.on('line', (line) => {
    const cmd = line.trim();
    switch (cmd) {
      case 'uptime':
        console.log(`Uptime: ${(process.uptime() - start).toFixed(2)}s`);
        break;
      case 'cwd':
        console.log(process.cwd());
        break;
      case 'date':
        console.log(new Date().toISOString());
        break;
      case 'exit':
        console.log('Goodbye!');
        rl.close();
        return;
      default:
        console.log('Unknown command');
    }
    rl.prompt();
  });
  rl.on('SIGINT', () => {
    console.log('\nGoodbye!');
    rl.close();
  });

rl.prompt();
};


interactive();
