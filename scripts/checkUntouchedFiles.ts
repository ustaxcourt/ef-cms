import { execSync, spawnSync } from 'child_process';

function runTypescriptCommand(cwd: string): { stdout: string } {
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

function getTypescriptErrorMap(cwd: string): { [key: string]: number } {
  const { stdout } = runTypescriptCommand(cwd);
  return createTypescriptErrorMap(stdout);
}

function getHashForDirectory(stagingRepoPath: string) {
  return spawnSync('git', ['log', '-n', '1', '--pretty=format:"%H"'], {
    cwd: stagingRepoPath,
    encoding: 'utf-8',
  }).stdout;
}

function getDifferencesBetweenHashes(
  branchDirPath: string,
  currentBranchHash: string,
  stagingBranchHash: string,
): { [fileName: string]: boolean } {
  return execSync(
    `git diff --name-only ${currentBranchHash} ${stagingBranchHash}`,
    {
      cwd: branchDirPath,
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

function getModifiedFiles(
  branchDirPath: string,
  stagingRepoPath: string,
): {
  [fileName: string]: boolean;
} {
  const currentBranchHash = getHashForDirectory(branchDirPath);
  const stagingBranchHash = getHashForDirectory(stagingRepoPath);

  return getDifferencesBetweenHashes(
    branchDirPath,
    currentBranchHash,
    stagingBranchHash,
  );
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

const branchDirPath = './';
const stagingDirPath = './targetBranch';
const branchTypescriptErrorMap = getTypescriptErrorMap(branchDirPath);
const stagingTypescriptErrorMap = getTypescriptErrorMap(stagingDirPath);
const modifiedFiles = getModifiedFiles(branchDirPath, stagingDirPath);

const fileToCheck = getFilesToCheck(
  branchTypescriptErrorMap,
  stagingTypescriptErrorMap,
  modifiedFiles,
);

function logSmartTable(dataObject: {
  [fileName: string]: {
    stagingCount: number;
    branchCount: number;
  };
}) {
  const columnWidths = {
    'Branch Count': 11,
    'File Path': 9,
    'Staging Count': 12,
  };

  Object.entries(dataObject).forEach(([filePath, counts]) => {
    const { branchCount, stagingCount } = counts;
    columnWidths['File Path'] = Math.max(
      columnWidths['File Path'],
      filePath.length,
    );
    columnWidths['Staging Count'] = Math.max(
      columnWidths['Staging Count'],
      stagingCount.toString().length,
    );
    columnWidths['Branch Count'] = Math.max(
      columnWidths['Branch Count'],
      branchCount.toString().length,
    );
  });

  console.log(
    `| ${'File Path'.padEnd(
      columnWidths['File Path'],
    )} | ${'Staging Count'.padEnd(
      columnWidths['Staging Count'],
    )} | ${'Branch Count'.padEnd(columnWidths['Branch Count'])} |`,
  );
  console.log(
    `| ${'-'.repeat(columnWidths['File Path'])} | ${'-'.repeat(
      columnWidths['Staging Count'],
    )} | ${'-'.repeat(columnWidths['Branch Count'])} |`,
  );

  Object.entries(dataObject).forEach(([filePath, counts]) => {
    const { branchCount, stagingCount } = counts;
    console.log(
      `| ${filePath.padEnd(columnWidths['File Path'])} | ${stagingCount
        .toString()
        .padEnd(columnWidths['Staging Count'])} | ${branchCount
        .toString()
        .padEnd(columnWidths['Branch Count'])} |`,
    );
  });
}

if (Object.keys(fileToCheck).length) {
  console.log(
    'Here are the files that your PR did not touch but increased in Typescript error count',
    logSmartTable(fileToCheck),
  );
  process.exit(1);
} else {
  process.exit(0);
}
