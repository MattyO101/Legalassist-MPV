const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

const rootDir = path.resolve(__dirname, '..');
const services = [
  {
    name: 'auth-service',
    color: '\x1b[32m', // Green
    command: 'npm',
    args: ['run', 'dev'],
  },
  {
    name: 'document-analysis-service',
    color: '\x1b[33m', // Yellow
    command: 'npm',
    args: ['run', 'dev'],
  },
  {
    name: 'template-service',
    color: '\x1b[34m', // Blue
    command: 'npm',
    args: ['run', 'dev'],
  },
  {
    name: 'frontend',
    color: '\x1b[35m', // Magenta
    command: 'npm',
    args: ['start'],
  },
];

// Kill all running services when the script is terminated
let runningProcesses = [];
process.on('SIGINT', () => {
  console.log('\nShutting down all services...');
  runningProcesses.forEach((proc) => {
    proc.kill();
  });
  process.exit();
});

// Start all services
console.log('Starting all services...');

services.forEach((service) => {
  const serviceDir = path.join(rootDir, service.name);
  
  // Check if service directory exists
  if (!fs.existsSync(serviceDir)) {
    console.error(`Service directory not found: ${serviceDir}`);
    return;
  }
  
  // Start the service
  const proc = spawn(service.command, service.args, {
    cwd: serviceDir,
    shell: true,
  });
  
  runningProcesses.push(proc);
  
  // Log output with color coding by service
  proc.stdout.on('data', (data) => {
    const output = data.toString().trim().split('\n');
    output.forEach((line) => {
      if (line) {
        console.log(`${service.color}[${service.name}]\x1b[0m ${line}`);
      }
    });
  });
  
  proc.stderr.on('data', (data) => {
    const output = data.toString().trim().split('\n');
    output.forEach((line) => {
      if (line) {
        console.error(`${service.color}[${service.name}]\x1b[0m \x1b[31m${line}\x1b[0m`);
      }
    });
  });
  
  proc.on('error', (error) => {
    console.error(`${service.color}[${service.name}]\x1b[0m Failed to start: ${error.message}`);
  });
  
  proc.on('close', (code) => {
    console.log(`${service.color}[${service.name}]\x1b[0m Process exited with code ${code}`);
    runningProcesses = runningProcesses.filter((p) => p !== proc);
  });
  
  console.log(`${service.color}[${service.name}]\x1b[0m Starting...`);
}); 