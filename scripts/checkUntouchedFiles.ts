import { execSync, spawnSync } from 'child_process';

function runTypescriptCommand(cwd?: string): { stdout: string } {
  return spawnSync(
    'npx',
    ['--node-options="--max-old-space-size=8192"', 'tsc', '--noEmit'],
    {
      cwd,
      encoding: 'utf-8',
      maxBuffer: 1024 * 5000,
    },
  );
}

function createTypescriptErrorMap(stdout: string): { [key: string]: number } {
  return stdout
    .split('\n')
    .map(line => line.trim())
    .filter(line => line.includes(': error TS'))
    .map(line => line.split('(')[0])
    .reduce(
      (accumulator, file) => {
        accumulator[file] = (accumulator[file] || 0) + 1;
        return accumulator;
      },
      {} as { [key: string]: number },
    );
}

function getTypescriptErrorMap(cwd?: string): { [key: string]: number } {
  const { stdout } = runTypescriptCommand(cwd);
  return createTypescriptErrorMap(stdout);
}

function getHashForDirectory(stagingRepoPath?: string) {
  return spawnSync('git', ['log', '-n', '1', '--pretty=format:"%H"'], {
    cwd: stagingRepoPath,
    encoding: 'utf-8',
  }).stdout;
}

function getDifferencesBetweenHashes(
  currentBranchHash: string,
  stagingBranchHash: string,
): { [fileName: string]: boolean } {
  return execSync(
    `git diff --name-only ${currentBranchHash} ${stagingBranchHash}`,
    {
      encoding: 'utf-8',
    },
  )
    .split('\n')
    .map(line => line.trim())
    .reduce(
      (accumulator, fileName) => {
        accumulator[fileName] = true;
        return accumulator;
      },
      {} as { [fileName: string]: boolean },
    );
}

function getModifiedFiles(stagingRepoPath: string): {
  [fileName: string]: boolean;
} {
  const currentBranchHash = getHashForDirectory();
  const stagingBranchHash = getHashForDirectory(stagingRepoPath);

  return getDifferencesBetweenHashes(currentBranchHash, stagingBranchHash);
}

function getFilesToCheck(
  branchTypescriptErrorMap: { [key: string]: number },
  stagingTypescriptErrorMap: { [key: string]: number },
  modifiedFiles: { [key: string]: boolean },
): {
  [fileName: string]: {
    stagingCount: number;
    branchCount: number;
  };
} {
  const fileToCheck: {
    [fileName: string]: {
      stagingCount: number;
      branchCount: number;
    };
  } = {};
  Object.entries(branchTypescriptErrorMap).forEach(
    ([fileName, branchCount]) => {
      if (modifiedFiles[fileName]) return;
      const stagingCount = stagingTypescriptErrorMap[fileName] || 0;
      if (stagingCount < branchCount)
        fileToCheck[fileName] = { branchCount, stagingCount };
    },
  );
  return fileToCheck;
}

const stagingBranch = '../stagingBranch';
const branchTypescriptErrorMap = getTypescriptErrorMap();
const stagingTypescriptErrorMap = getTypescriptErrorMap(stagingBranch);
const modifiedFiles = getModifiedFiles(stagingBranch);

const fileToCheck = getFilesToCheck(
  branchTypescriptErrorMap,
  stagingTypescriptErrorMap,
  modifiedFiles,
);

if (Object.keys(fileToCheck).length) {
  console.log('fileToCheck', fileToCheck);
  process.exit(1);
} else {
  process.exit(0);
}
