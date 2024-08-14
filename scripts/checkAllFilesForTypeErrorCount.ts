import { spawnSync } from 'child_process';

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

function createTypescriptErrorMap(stdout: string): {
  [fileName: string]: number;
} {
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
      {} as { [fileName: string]: number },
    );
}

function getTypescriptErrorMap(cwd: string): { [fileName: string]: number } {
  const { stdout } = runTypescriptCommand(cwd);
  return createTypescriptErrorMap(stdout);
}

function getFilesToCheck(
  branchTypescriptErrorMap: { [fileName: string]: number },
  targetTypescriptErrorMap: { [fileName: string]: number },
): {
  [fileName: string]: {
    targetCount: number;
    branchCount: number;
  };
} {
  const fileToCheck: {
    [fileName: string]: {
      targetCount: number;
      branchCount: number;
    };
  } = {};
  Object.entries(branchTypescriptErrorMap).forEach(
    ([fileName, branchCount]) => {
      const targetCount = targetTypescriptErrorMap[fileName] || 0;
      if (targetCount < branchCount)
        fileToCheck[fileName] = { branchCount, targetCount };
    },
  );
  return fileToCheck;
}

const branchDirPath = './';
const targetDirPath = './targetBranch';
const branchTypescriptErrorMap = getTypescriptErrorMap(branchDirPath);
const targetTypescriptErrorMap = getTypescriptErrorMap(targetDirPath);

const fileToCheck = getFilesToCheck(
  branchTypescriptErrorMap,
  targetTypescriptErrorMap,
);

function logSmartTable(dataObject: {
  [fileName: string]: {
    targetCount: number;
    branchCount: number;
  };
}): void {
  const tableData: {
    'Branch Count': number;
    'File Path': string;
    'Target Count': number;
  }[] = [];

  Object.entries(dataObject).forEach(([filePath, counts]) => {
    const { branchCount, targetCount } = counts;
    const data = {
      'Branch Count': branchCount,
      'File Path': filePath,
      'Target Count': targetCount,
    };
    tableData.push(data);
  });

  console.table(tableData, ['File Path', 'Target Count', 'Branch Count']);
}

const errorCount = Object.keys(fileToCheck);
if (errorCount.length) {
  logSmartTable(fileToCheck);
  console.log(
    '\nHere are the files that your PR did not touch but increased in Typescript error count: ',
    errorCount.length,
  );
  process.exit(1);
} else {
  process.exit(0);
}
