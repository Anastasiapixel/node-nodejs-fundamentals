import { spawn } from 'child_process';

const execCommand = () => {
  const [,, cmd] = process.argv;

  if (!cmd) {
    console.error('Error: No command provided');
    process.exit(1);
  }

  const child = spawn(cmd, {
    stdio: 'inherit',
    shell: true,   
    env: process.env
  });

  child.on('exit', (code) => process.exit(code));
  child.on('error', (err) => {
    console.error('Failed to start child process:', err);
    process.exit(1);
  });
};

execCommand();