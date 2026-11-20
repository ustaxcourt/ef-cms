import { spawnSync } from 'child_process';
import fs from 'fs';
import path from 'path';

type JestProjectConfig = {
  collectCoverageFrom: string[];
  configPath: string;
  rootDir: string;
  testMatch: string[];
  testPathIgnorePatterns: string[];
};

type ProcessOptions = {
  cwd: string;
  encoding?: 'utf8';
  stdio?: 'inherit';
};

type ProcessResult = {
  error?: Error;
  status: number | null;
  stderr: string | null;
  stdout: string | null;
};

export type ProcessRunner = (
  command: string,
  args: string[],
  options: ProcessOptions,
) => ProcessResult;

type ParsedFileCoverageArgs = {
  coverageSourcePath?: string;
  jestArgs: string[];
  testFilePath: string;
};

export type FocusedCoverageDependencies = {
  getJestProjects: (configPath: string, cwd: string) => JestProjectConfig[];
  runJest: (args: string[], cwd: string) => number;
};

const TEST_FILE_PATTERN = /\.(?:test|spec)\.[jt]sx?$/;
const FOCUSED_RUN_OPTIONS = new Set([
  '--collectCoverageFrom',
  '--config',
  '-c',
  '--coverage',
  '--coverageDirectory',
  '--coveragePathIgnorePatterns',
  '--coverageProvider',
  '--coverageReporters',
  '--coverageThreshold',
  '--forceCoverageMatch',
  '--projects',
  '--rootDir',
  '--runTestsByPath',
  '--selectProjects',
]);

export const runProcess: ProcessRunner = (
  command: string,
  args: string[],
  options: ProcessOptions,
): ProcessResult => {
  if (options.encoding === 'utf8') {
    const result = spawnSync(command, args, {
      cwd: options.cwd,
      encoding: 'utf8',
    });
    return {
      error: result.error,
      status: result.status,
      stderr: result.stderr,
      stdout: result.stdout,
    };
  }

  const result = spawnSync(command, args, {
    cwd: options.cwd,
    stdio: options.stdio,
  });
  return {
    error: result.error,
    status: result.status,
    stderr: null,
    stdout: null,
  };
};

export const getErrorMessage = (error: unknown): string => {
  return error instanceof Error ? error.message : String(error);
};

const isRecord = (value: unknown): value is Record<string, unknown> => {
  return typeof value === 'object' && value !== null;
};

const getTestFilePath = (testFilePath: string, cwd: string): string => {
  const resolvedPath = path.resolve(cwd, testFilePath);
  if (!fs.existsSync(resolvedPath) || !fs.statSync(resolvedPath).isFile()) {
    throw new Error(`Jest test file does not exist: ${testFilePath}`);
  }
  return resolvedPath;
};

export const parseFileCoverageArgs = ({
  args,
  cwd,
}: {
  args: string[];
  cwd: string;
}): ParsedFileCoverageArgs => {
  const testFileArgs = args.filter((arg: string): boolean =>
    TEST_FILE_PATTERN.test(arg),
  );
  if (testFileArgs.length !== 1) {
    throw new Error(
      'Provide exactly one Jest test file path ending in .test or .spec.',
    );
  }

  const testFilePath = getTestFilePath(testFileArgs[0], cwd);
  let coverageSourcePath: string | undefined;
  const jestArgs: string[] = [];

  const setCoverageSourcePath = (sourcePath: string): void => {
    if (!sourcePath) {
      throw new Error('--coverage-source requires a source file path.');
    }
    if (coverageSourcePath) {
      throw new Error('Provide --coverage-source only once.');
    }
    coverageSourcePath = sourcePath;
  };

  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];
    if (arg === testFileArgs[0]) {
      continue;
    }
    if (arg === '--coverage-source') {
      const sourcePath = args[index + 1];
      if (!sourcePath || sourcePath.startsWith('--')) {
        throw new Error('--coverage-source requires a source file path.');
      }
      setCoverageSourcePath(sourcePath);
      index += 1;
      continue;
    }
    if (arg.startsWith('--coverage-source=')) {
      setCoverageSourcePath(arg.slice('--coverage-source='.length));
      continue;
    }

    const optionName = arg.split('=')[0];
    if (FOCUSED_RUN_OPTIONS.has(optionName)) {
      throw new Error(
        `${optionName} is controlled by the focused coverage command and cannot be overridden.`,
      );
    }
    jestArgs.push(arg);
  }

  return {
    coverageSourcePath,
    jestArgs,
    testFilePath,
  };
};

export const inferPairedSourceFilePath = (testFilePath: string): string => {
  const testFileNameMatch = /^(.*)\.(?:test|spec)(\.[jt]sx?)$/.exec(
    path.basename(testFilePath),
  );
  if (!testFileNameMatch) {
    throw new Error(
      `Cannot infer a source file from ${testFilePath}; pass --coverage-source path/to/source-file.ts.`,
    );
  }
  return path.join(
    path.dirname(testFilePath),
    `${testFileNameMatch[1]}${testFileNameMatch[2]}`,
  );
};

export const resolveCoverageSourcePath = ({
  configRoot,
  cwd,
  coverageSourcePath,
  testFilePath,
}: {
  configRoot: string;
  cwd: string;
  coverageSourcePath?: string;
  testFilePath: string;
}): string => {
  let resolvedSourcePath: string;
  if (coverageSourcePath) {
    resolvedSourcePath = path.resolve(cwd, coverageSourcePath);
  } else {
    resolvedSourcePath = inferPairedSourceFilePath(testFilePath);
  }

  if (
    !fs.existsSync(resolvedSourcePath) ||
    !fs.statSync(resolvedSourcePath).isFile()
  ) {
    throw new Error(
      `Coverage source file does not exist: ${resolvedSourcePath}. Pass --coverage-source path/to/source-file.ts if it does not share the test filename.`,
    );
  }

  const relativePath = path.relative(configRoot, resolvedSourcePath);
  if (relativePath.startsWith(`..${path.sep}`)) {
    throw new Error(
      `Coverage source file must be inside the Jest project root: ${resolvedSourcePath}`,
    );
  }

  return relativePath.split(path.sep).join('/');
};

export const isIncludedByCoveragePatterns = ({
  coverageFilePath,
  patterns,
}: {
  coverageFilePath: string;
  patterns: string[];
}): boolean => {
  let included = false;
  for (const pattern of patterns) {
    const excluded = pattern.startsWith('!');
    const glob = excluded ? pattern.slice(1) : pattern;
    if (path.matchesGlob(coverageFilePath, glob)) {
      included = !excluded;
    }
  }
  return included;
};

export const jestProjectMatchesTestFile = ({
  projectConfig,
  testFilePath,
}: {
  projectConfig: JestProjectConfig;
  testFilePath: string;
}): boolean => {
  const matchesTestPattern = projectConfig.testMatch.some(
    (pattern: string): boolean => path.matchesGlob(testFilePath, pattern),
  );
  if (!matchesTestPattern) {
    return false;
  }

  return !projectConfig.testPathIgnorePatterns.some(
    (pattern: string): boolean => new RegExp(pattern).test(testFilePath),
  );
};

export const selectCoverageProjectConfig = ({
  projectConfigs,
  testFilePath,
}: {
  projectConfigs: JestProjectConfig[];
  testFilePath: string;
}): JestProjectConfig => {
  const matchingProjects = projectConfigs.filter(projectConfig =>
    jestProjectMatchesTestFile({ projectConfig, testFilePath }),
  );
  if (matchingProjects.length === 0) {
    throw new Error(`No Jest project matches test file: ${testFilePath}`);
  }

  const coverageProjects = matchingProjects.filter(
    projectConfig => projectConfig.collectCoverageFrom.length > 0,
  );
  if (coverageProjects.length === 0) {
    throw new Error(
      `The Jest project matching ${testFilePath} does not collect coverage.`,
    );
  }
  if (coverageProjects.length > 1) {
    throw new Error(
      `Multiple coverage-enabled Jest projects match test file: ${testFilePath}`,
    );
  }

  return coverageProjects[0];
};

export const buildFocusedCoverageJestArgs = ({
  configPath,
  coverageSourcePath,
  jestArgs,
  testFilePath,
}: {
  configPath: string;
  coverageSourcePath: string;
  jestArgs: string[];
  testFilePath: string;
}): string[] => {
  return [
    '--config',
    configPath,
    ...jestArgs,
    '--runTestsByPath',
    testFilePath,
    '--coverage',
    '--coverageProvider=babel',
    '--coverageReporters=text',
    '--coverageThreshold={}',
    `--collectCoverageFrom=${coverageSourcePath}`,
  ];
};

export const getJestProjectConfigs = (
  configPath: string,
  cwd: string,
  processRunner: ProcessRunner = runProcess,
): JestProjectConfig[] => {
  const jestCliPath = path.resolve(cwd, 'node_modules/jest/bin/jest.js');
  const result = processRunner(
    process.execPath,
    [jestCliPath, '--config', configPath, '--showConfig'],
    { cwd, encoding: 'utf8' },
  );
  if (result.error) {
    throw new Error(`Could not load Jest config: ${result.error.message}`);
  }
  if (result.status !== 0 || !result.stdout) {
    throw new Error(
      `Could not load Jest config ${configPath}: ${result.stderr || result.stdout || 'Jest exited without output.'}`,
    );
  }

  const showConfig: unknown = JSON.parse(result.stdout);
  if (
    !isRecord(showConfig) ||
    !Array.isArray(showConfig.configs) ||
    showConfig.configs.length === 0
  ) {
    throw new Error(`Jest returned an invalid config for ${configPath}.`);
  }

  let projectConfigPaths: string[];
  if (showConfig.configs.length === 1) {
    projectConfigPaths = [path.resolve(cwd, configPath)];
  } else {
    const { globalConfig } = showConfig;
    if (
      !isRecord(globalConfig) ||
      !Array.isArray(globalConfig.projects) ||
      globalConfig.projects.length !== showConfig.configs.length ||
      !globalConfig.projects.every(
        (projectPath: unknown): projectPath is string =>
          typeof projectPath === 'string',
      )
    ) {
      throw new Error(
        `Jest config is missing project paths for ${configPath}.`,
      );
    }
    projectConfigPaths = globalConfig.projects.map((projectPath: string) =>
      path.resolve(cwd, projectPath),
    );
  }

  return showConfig.configs.map(
    (projectConfig: unknown, index: number): JestProjectConfig => {
      if (
        !isRecord(projectConfig) ||
        typeof projectConfig.rootDir !== 'string' ||
        !Array.isArray(projectConfig.collectCoverageFrom) ||
        !projectConfig.collectCoverageFrom.every(
          (pattern: unknown): pattern is string => typeof pattern === 'string',
        ) ||
        !Array.isArray(projectConfig.testMatch) ||
        !projectConfig.testMatch.every(
          (pattern: unknown): pattern is string => typeof pattern === 'string',
        ) ||
        !Array.isArray(projectConfig.testPathIgnorePatterns) ||
        !projectConfig.testPathIgnorePatterns.every(
          (pattern: unknown): pattern is string => typeof pattern === 'string',
        )
      ) {
        throw new Error(
          `Jest config is missing coverage settings: ${configPath}.`,
        );
      }

      return {
        collectCoverageFrom: projectConfig.collectCoverageFrom,
        configPath: projectConfigPaths[index],
        rootDir: projectConfig.rootDir,
        testMatch: projectConfig.testMatch,
        testPathIgnorePatterns: projectConfig.testPathIgnorePatterns,
      };
    },
  );
};

export const getJestProjectConfig = (
  configPath: string,
  cwd: string,
  processRunner: ProcessRunner = runProcess,
): JestProjectConfig => {
  const projectConfigs = getJestProjectConfigs(configPath, cwd, processRunner);
  if (projectConfigs.length !== 1) {
    throw new Error(
      `Expected one Jest project in ${configPath}, found ${projectConfigs.length}.`,
    );
  }
  return projectConfigs[0];
};

export const runJest = (
  args: string[],
  cwd: string,
  processRunner: ProcessRunner = runProcess,
): number => {
  const jestCliPath = path.resolve(cwd, 'node_modules/jest/bin/jest.js');
  const result = processRunner(process.execPath, [jestCliPath, ...args], {
    cwd,
    stdio: 'inherit',
  });
  if (result.error) {
    throw new Error(`Could not start Jest: ${result.error.message}`);
  }
  return result.status ?? 1;
};

const defaultDependencies: FocusedCoverageDependencies = {
  getJestProjects: getJestProjectConfigs,
  runJest,
};

export const runFileCoverageCommand = ({
  args,
  cwd = process.cwd(),
  dependencies = defaultDependencies,
}: {
  args: string[];
  cwd?: string;
  dependencies?: FocusedCoverageDependencies;
}): number => {
  const [configPath, ...jestArgs] = args;
  if (!configPath) {
    throw new Error('The Jest config path is required.');
  }

  const parsedArgs = parseFileCoverageArgs({ args: jestArgs, cwd });
  const projectConfigs = dependencies.getJestProjects(configPath, cwd);
  const projectConfig =
    projectConfigs.length === 1
      ? projectConfigs[0]
      : selectCoverageProjectConfig({
          projectConfigs,
          testFilePath: parsedArgs.testFilePath,
        });
  const selectedConfigPath =
    projectConfigs.length === 1 ? configPath : projectConfig.configPath;
  const resolvedCoverageSourcePath = resolveCoverageSourcePath({
    configRoot: projectConfig.rootDir,
    coverageSourcePath: parsedArgs.coverageSourcePath,
    cwd,
    testFilePath: parsedArgs.testFilePath,
  });
  if (
    !isIncludedByCoveragePatterns({
      coverageFilePath: resolvedCoverageSourcePath,
      patterns: projectConfig.collectCoverageFrom,
    })
  ) {
    throw new Error(
      `Coverage source file is excluded by ${configPath}: ${resolvedCoverageSourcePath}`,
    );
  }

  return dependencies.runJest(
    buildFocusedCoverageJestArgs({
      configPath: selectedConfigPath,
      coverageSourcePath: resolvedCoverageSourcePath,
      jestArgs: parsedArgs.jestArgs,
      testFilePath: parsedArgs.testFilePath,
    }),
    cwd,
  );
};

export const runCli = ({
  args,
  cwd = process.cwd(),
  dependencies = defaultDependencies,
}: {
  args: string[];
  cwd?: string;
  dependencies?: FocusedCoverageDependencies;
}): number => {
  try {
    return runFileCoverageCommand({ args, cwd, dependencies });
  } catch (error: unknown) {
    console.error(getErrorMessage(error));
    return 1;
  }
};
