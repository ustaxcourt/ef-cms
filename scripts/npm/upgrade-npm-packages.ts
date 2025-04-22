#!/usr/bin/env -S npx ts-node --transpile-only
import { execSync, spawnSync } from 'child_process';

// Caveats list: packages to exclude from upgrade
const caveats: string[] = [
  '@cerebral/react',
  'cerebral',
  'babel-plugin-cerebral',
  '@fortawesome/fontawesome-svg-core',
  '@fortawesome/free-regular-svg-icons',
  '@fortawesome/free-solid-svg-icons',
  '@fortawesome/react-fontawesome',
  'puppeteer',
  'puppeteer-core',
  '@sparticuz/chromium',
];

// Function to run a shell command and capture output, even if it has a non-zero exit code
function runCommand(command: string): string {
  const result = spawnSync(command, { shell: true, encoding: 'utf-8' });
  if (result.status !== 0 && result.status !== 1) {
    console.error(`Error executing command: ${command}`);
    console.error(`Exit code: ${result.status}`);
    console.error(`Error output: ${result.stderr.trim()}`);
    throw new Error(result.stderr.trim());
  }
  return result.stdout.trim();
}

// Function to get outdated npm packages
function getOutdatedPackages(): Record<string, any> {
  try {
    const outdatedOutput = runCommand('npm outdated --json');
    return JSON.parse(outdatedOutput);
  } catch (error) {
    if (
      error instanceof Error &&
      error.message.includes('No outdated packages found')
    ) {
      console.log('All packages are up-to-date.');
      return {};
    }
    throw error;
  }
}

// Function to upgrade all packages except those in the caveats list
function upgradePackages(): void {
  const outdatedPackages = getOutdatedPackages();

  Object.entries(outdatedPackages).forEach(([pkg, details]) => {
    if (!caveats.includes(pkg)) {
      const latestVersion = details.latest;
      console.log(`Upgrading ${pkg} to version ${latestVersion}...`);
      execSync(`npm install ${pkg}@${latestVersion} --save-exact`, {
        stdio: 'inherit',
      });
    } else {
      console.log(`Skipping ${pkg} (in caveats list).`);
    }
  });
}

// Main function to execute the script
export function runUpgradeScript(): void {
  console.log('Checking for outdated packages...');
  upgradePackages();
  console.log('Upgrade process completed.');
}

runUpgradeScript();
