#!/usr/bin/env node

/**
 * This script diagnoses common ngrok issues
 */

const ngrok = require('ngrok');
const http = require('http');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
};

console.log(`${colors.cyan}🔍 Starting ngrok diagnostic tool...${colors.reset}`);

// Check if ngrok is installed
console.log(`${colors.cyan}Checking ngrok installation...${colors.reset}`);
try {
  const ngrokVersion = require('ngrok/package.json').version;
  console.log(
    `${colors.green}✓ ngrok package is installed (version ${ngrokVersion})${colors.reset}`
  );
} catch (err) {
  console.error(
    `${colors.red}✗ ngrok package is not installed or has issues: ${err.message}${colors.reset}`
  );
  console.log(`${colors.yellow}Try reinstalling with: npm install -g ngrok${colors.reset}`);
}

// Check if port 3000 is available
console.log(`${colors.cyan}Checking if port 3000 is available...${colors.reset}`);
const testServer = http.createServer();
testServer.once('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`${colors.red}✗ Port 3000 is already in use${colors.reset}`);
    console.log(
      `${colors.yellow}Try finding and stopping the process using this port:${colors.reset}`
    );
    console.log(`${colors.yellow}  lsof -i :3000${colors.reset}`);
    console.log(`${colors.yellow}  kill -9 <PID>${colors.reset}`);
  } else {
    console.error(`${colors.red}✗ Error checking port: ${err.message}${colors.reset}`);
  }
  runNgrokTest();
});

testServer.once('listening', () => {
  console.log(`${colors.green}✓ Port 3000 is available${colors.reset}`);
  testServer.close();
  runNgrokTest();
});

testServer.listen(3000);

async function runNgrokTest() {
  // Check for ngrok config file
  console.log(`${colors.cyan}Checking for ngrok configuration...${colors.reset}`);
  const ngrokConfigPath = path.join(process.cwd(), 'ngrok.json');
  let authToken = null;

  if (fs.existsSync(ngrokConfigPath)) {
    try {
      const ngrokConfig = JSON.parse(fs.readFileSync(ngrokConfigPath, 'utf8'));
      authToken = ngrokConfig.authtoken;
      console.log(`${colors.green}✓ Found ngrok.json configuration file${colors.reset}`);

      if (!authToken || authToken === '') {
        console.log(`${colors.yellow}⚠️ No authtoken found in config file${colors.reset}`);
      } else {
        console.log(`${colors.green}✓ Found authtoken in config${colors.reset}`);
      }
    } catch (err) {
      console.error(`${colors.red}✗ Error parsing ngrok.json: ${err.message}${colors.reset}`);
    }
  } else {
    console.log(`${colors.yellow}⚠️ No ngrok.json file found in project root${colors.reset}`);
  }

  // Attempt to start a simple ngrok tunnel
  console.log(`${colors.cyan}Attempting to start a test tunnel...${colors.reset}`);
  try {
    // Start a simple HTTP server
    const testApp = http.createServer((req, res) => {
      res.writeHead(200, { 'Content-Type': 'text/plain' });
      res.end('Ngrok test server is working!');
    });

    testApp.listen(4000);
    console.log(`${colors.green}✓ Test HTTP server started on port 4000${colors.reset}`);

    // Try to connect with ngrok
    console.log(`${colors.cyan}Connecting to ngrok...${colors.reset}`);
    const url = await ngrok.connect({
      addr: 4000,
      configPath: fs.existsSync(ngrokConfigPath) ? ngrokConfigPath : undefined,
    });

    console.log(`${colors.green}✓ Successfully connected to ngrok!${colors.reset}`);
    console.log(`${colors.green}✓ Test tunnel URL: ${url}${colors.reset}`);

    // Kill the tunnel and test server
    await ngrok.disconnect(url);
    await ngrok.kill();
    testApp.close();

    console.log(`\n${colors.green}=== DIAGNOSIS COMPLETE ====${colors.reset}`);
    console.log(`${colors.green}✓ Ngrok appears to be working correctly${colors.reset}`);
    console.log(
      `\n${colors.cyan}To fix your dev-ngrok.js script, try updating these settings:${colors.reset}`
    );
    console.log(
      `${colors.cyan}- Make sure the port (${3000}) is not already in use${colors.reset}`
    );
    console.log(
      `${colors.cyan}- Add configPath: '/Users/longphu/p/earn/hey-earn/ngrok.json' to ngrok.connect options${colors.reset}`
    );
    console.log(`${colors.cyan}- Make sure to properly handle process errors ${colors.reset}`);
  } catch (err) {
    console.error(`${colors.red}✗ Failed to start ngrok tunnel: ${err.message}${colors.reset}`);

    if (err.message.includes('authtoken')) {
      console.log(`\n${colors.yellow}=== SOLUTION FOR AUTHTOKEN ISSUES ===${colors.reset}`);
      console.log(`${colors.yellow}1. Create a free account at https://ngrok.com${colors.reset}`);
      console.log(
        `${colors.yellow}2. Get your authtoken from https://dashboard.ngrok.com/get-started/your-authtoken${colors.reset}`
      );
      console.log(`${colors.yellow}3. Add your authtoken to ngrok.json or run:${colors.reset}`);
      console.log(`${colors.yellow}   npx ngrok authtoken YOUR_AUTH_TOKEN${colors.reset}`);
    } else {
      console.log(`\n${colors.yellow}=== POTENTIAL SOLUTIONS ===${colors.reset}`);
      console.log(
        `${colors.yellow}1. Check if any other ngrok processes are running:${colors.reset}`
      );
      console.log(`${colors.yellow}   ps aux | grep ngrok${colors.reset}`);
      console.log(`${colors.yellow}   kill -9 <PID>${colors.reset}`);
      console.log(`${colors.yellow}2. Check your network connection${colors.reset}`);
      console.log(`${colors.yellow}3. Try running ngrok directly:${colors.reset}`);
      console.log(`${colors.yellow}   npx ngrok http 3000${colors.reset}`);
    }
  }

  process.exit(0);
}
