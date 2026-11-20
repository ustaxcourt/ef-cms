/* eslint-disable max-lines */

import fs from 'fs';
import os from 'os';
import path from 'path';
import {
  buildFocusedCoverageJestArgs,
  type FocusedCoverageDependencies,
  getErrorMessage,
  getJestProjectConfig,
  getJestProjectConfigs,
  inferPairedSourceFilePath,
  isIncludedByCoveragePatterns,
  jestProjectMatchesTestFile,
  parseFileCoverageArgs,
  resolveCoverageSourcePath,
  runCli,
  runJest,
  runProcess,
  runFileCoverageCommand,
  selectCoverageProjectConfig,
  type ProcessRunner,
} from './run-jest-file-with-coverage.helpers';

const testFilePath = path.join(
  __dirname,
  'run-jest-file-with-coverage.helpers.test.ts',
);
const sourceFilePath = path.join(
  __dirname,
  'run-jest-file-with-coverage.helpers.ts',
);
const configRoot = path.resolve(__dirname, '..');
type TestJestProjectConfig = {
  collectCoverageFrom: string[];
  configPath: string;
  rootDir: string;
  testMatch: string[];
  testPathIgnorePatterns: string[];
};

const createTestJestProjectConfig = (
  overrides: Partial<TestJestProjectConfig> = {},
): TestJestProjectConfig => {
  return {
    collectCoverageFrom: ['**/*.{js,ts}'],
    configPath: 'scripts/jest-scripts.config.ts',
    rootDir: configRoot,
    testMatch: [path.join(configRoot, '**/?(*.)+(spec|test).[jt]s?(x)')],
    testPathIgnorePatterns: [],
    ...overrides,
  };
};

describe('resolveCoverageSourcePath', () => {
  it('infers a paired source path and supports test/spec extensions', () => {
    expect(
      resolveCoverageSourcePath({
        configRoot,
        cwd: process.cwd(),
        testFilePath,
      }),
    ).toBe('tests/run-jest-file-with-coverage.helpers.ts');
    expect(
      resolveCoverageSourcePath({
        configRoot,
        coverageSourcePath: sourceFilePath,
        cwd: process.cwd(),
        testFilePath,
      }),
    ).toBe('tests/run-jest-file-with-coverage.helpers.ts');
  });

  it('requires an explicit source path when no paired source file exists', () => {
    expect(() =>
      resolveCoverageSourcePath({
        configRoot,
        cwd: process.cwd(),
        testFilePath: path.join(__dirname, 'missing.test.ts'),
      }),
    ).toThrow('Coverage source file does not exist');
    expect(() =>
      resolveCoverageSourcePath({
        configRoot,
        cwd: process.cwd(),
        testFilePath: path.join(__dirname, 'missing.ts'),
      }),
    ).toThrow('Cannot infer a source file');
  });

  it('rejects directories where source or test files are expected', () => {
    const temporaryDirectory = fs.mkdtempSync(
      path.join(os.tmpdir(), 'focused-jest-coverage-'),
    );
    const directoryTestPath = path.join(
      temporaryDirectory,
      'directory.test.ts',
    );
    const directorySourcePath = path.join(temporaryDirectory, 'directory.ts');
    fs.mkdirSync(directoryTestPath);
    fs.mkdirSync(directorySourcePath);

    try {
      expect(() =>
        runFileCoverageCommand({
          args: ['scripts/jest-scripts.config.ts', directoryTestPath],
          cwd: process.cwd(),
          dependencies: {
            getJestProjects: jest.fn(),
            runJest: jest.fn(),
          },
        }),
      ).toThrow('Jest test file does not exist');
      expect(() =>
        resolveCoverageSourcePath({
          configRoot: temporaryDirectory,
          coverageSourcePath: directorySourcePath,
          cwd: process.cwd(),
          testFilePath: directoryTestPath,
        }),
      ).toThrow('Coverage source file does not exist');
    } finally {
      fs.rmSync(temporaryDirectory, { force: true, recursive: true });
    }
  });

  it('maps spec and TSX test names to their corresponding source path', () => {
    expect(
      inferPairedSourceFilePath(path.join(__dirname, 'missing.spec.tsx')),
    ).toBe(path.join(__dirname, 'missing.tsx'));
  });

  it('rejects a coverage source outside the Jest project root', () => {
    expect(() =>
      resolveCoverageSourcePath({
        configRoot,
        coverageSourcePath: path.resolve(
          __dirname,
          '../../shared/src/business/utilities/DateHandler.ts',
        ),
        cwd: process.cwd(),
        testFilePath,
      }),
    ).toThrow('must be inside the Jest project root');
  });
});

describe('parseFileCoverageArgs', () => {
  it('separates the test file and focused coverage options from Jest args', () => {
    expect(
      parseFileCoverageArgs({
        args: [
          testFilePath,
          '--coverage-source',
          sourceFilePath,
          '--runInBand',
          '--testNamePattern=coverage',
        ],
        cwd: process.cwd(),
      }),
    ).toEqual({
      coverageSourcePath: sourceFilePath,
      jestArgs: ['--runInBand', '--testNamePattern=coverage'],
      testFilePath,
    });
    expect(
      parseFileCoverageArgs({
        args: [testFilePath, `--coverage-source=${sourceFilePath}`],
        cwd: process.cwd(),
      }),
    ).toEqual({
      coverageSourcePath: sourceFilePath,
      jestArgs: [],
      testFilePath,
    });
  });

  it('does not treat Jest option values as test file paths', () => {
    const testNamePattern = 'another.test.ts';
    const testMatchPatterns = ['**/*.test.ts', '**/*.spec.ts'];

    expect(
      parseFileCoverageArgs({
        args: [
          testFilePath,
          '--testMatch',
          ...testMatchPatterns,
          '--testNamePattern',
          testNamePattern,
        ],
        cwd: process.cwd(),
      }),
    ).toEqual({
      coverageSourcePath: undefined,
      jestArgs: [
        '--testMatch',
        ...testMatchPatterns,
        '--testNamePattern',
        testNamePattern,
      ],
      testFilePath,
    });

    expect(
      parseFileCoverageArgs({
        args: [testFilePath, '-t', testNamePattern],
        cwd: process.cwd(),
      }),
    ).toEqual({
      coverageSourcePath: undefined,
      jestArgs: ['-t', testNamePattern],
      testFilePath,
    });

    expect(
      parseFileCoverageArgs({
        args: ['--testNamePattern', testFilePath, testFilePath],
        cwd: process.cwd(),
      }),
    ).toEqual({
      coverageSourcePath: undefined,
      jestArgs: ['--testNamePattern', testFilePath],
      testFilePath,
    });

    expect(
      parseFileCoverageArgs({
        args: [
          testFilePath,
          '--test-name-pattern',
          testNamePattern,
          'coverage',
        ],
        cwd: process.cwd(),
      }),
    ).toEqual({
      coverageSourcePath: undefined,
      jestArgs: ['--test-name-pattern', testNamePattern, 'coverage'],
      testFilePath,
    });

    expect(
      parseFileCoverageArgs({
        args: [testFilePath, '--unknown-option'],
        cwd: process.cwd(),
      }),
    ).toEqual({
      coverageSourcePath: undefined,
      jestArgs: ['--unknown-option'],
      testFilePath,
    });
  });

  it('rejects invalid test file and coverage source arguments', () => {
    expect(() =>
      parseFileCoverageArgs({ args: [], cwd: process.cwd() }),
    ).toThrow('Provide exactly one Jest test file path');
    expect(() =>
      parseFileCoverageArgs({
        args: [testFilePath, testFilePath],
        cwd: process.cwd(),
      }),
    ).toThrow('Provide exactly one Jest test file path');
    expect(() =>
      parseFileCoverageArgs({
        args: ['missing.test.ts'],
        cwd: process.cwd(),
      }),
    ).toThrow('Jest test file does not exist');
    expect(() =>
      parseFileCoverageArgs({
        args: [testFilePath, '--coverage-source'],
        cwd: process.cwd(),
      }),
    ).toThrow('--coverage-source requires a source file path');
    expect(() =>
      parseFileCoverageArgs({
        args: [testFilePath, '--coverage-source', '--runInBand'],
        cwd: process.cwd(),
      }),
    ).toThrow('--coverage-source requires a source file path');
    expect(() =>
      parseFileCoverageArgs({
        args: [testFilePath, '--coverage-source='],
        cwd: process.cwd(),
      }),
    ).toThrow('--coverage-source requires a source file path');
    expect(() =>
      parseFileCoverageArgs({
        args: [
          testFilePath,
          '--coverage-source',
          sourceFilePath,
          `--coverage-source=${sourceFilePath}`,
        ],
        cwd: process.cwd(),
      }),
    ).toThrow('Provide --coverage-source only once');
  });

  it('rejects Jest args that would override focused coverage settings', () => {
    expect(() =>
      parseFileCoverageArgs({
        args: [testFilePath, '--coverage=false'],
        cwd: process.cwd(),
      }),
    ).toThrow('--coverage is controlled by the focused coverage command');
  });
});

describe('isIncludedByCoveragePatterns', () => {
  it('applies configured include and exclude patterns in order', () => {
    const patterns = [
      '**/*.{js,ts}',
      '!circleci/*.ts',
      'circleci/update-aws-credentials-in-context.helpers.ts',
    ];

    expect(
      isIncludedByCoveragePatterns({
        coverageFilePath:
          'circleci/update-aws-credentials-in-context.helpers.ts',
        patterns,
      }),
    ).toBe(true);
    expect(
      isIncludedByCoveragePatterns({
        coverageFilePath: 'circleci/other-script.ts',
        patterns,
      }),
    ).toBe(false);
    expect(
      isIncludedByCoveragePatterns({
        coverageFilePath: 'not-covered.txt',
        patterns: [],
      }),
    ).toBe(false);
  });
});

describe('jestProjectMatchesTestFile', () => {
  it('matches Jest globs unless an ignore pattern excludes the file', () => {
    const projectConfig = createTestJestProjectConfig();

    expect(jestProjectMatchesTestFile({ projectConfig, testFilePath })).toBe(
      true,
    );
    expect(
      jestProjectMatchesTestFile({
        projectConfig: createTestJestProjectConfig({
          testMatch: ['/somewhere/else/**/*.test.ts'],
        }),
        testFilePath,
      }),
    ).toBe(false);
    expect(
      jestProjectMatchesTestFile({
        projectConfig: createTestJestProjectConfig({
          testPathIgnorePatterns: [
            'run-jest-file-with-coverage\\.helpers\\.test\\.ts$',
          ],
        }),
        testFilePath,
      }),
    ).toBe(false);
  });
});

describe('selectCoverageProjectConfig', () => {
  it('selects the only matching project that collects coverage', () => {
    const coverageProject = createTestJestProjectConfig();
    const noCoverageProject = createTestJestProjectConfig({
      collectCoverageFrom: [],
    });

    expect(
      selectCoverageProjectConfig({
        projectConfigs: [noCoverageProject, coverageProject],
        testFilePath,
      }),
    ).toBe(coverageProject);
  });

  it('rejects unmatched, coverage-free, and ambiguous projects', () => {
    expect(() =>
      selectCoverageProjectConfig({
        projectConfigs: [
          createTestJestProjectConfig({
            testMatch: ['/somewhere/else/**/*.test.ts'],
          }),
        ],
        testFilePath,
      }),
    ).toThrow('No Jest project matches test file');
    expect(() =>
      selectCoverageProjectConfig({
        projectConfigs: [
          createTestJestProjectConfig({ collectCoverageFrom: [] }),
        ],
        testFilePath,
      }),
    ).toThrow('does not collect coverage');
    expect(() =>
      selectCoverageProjectConfig({
        projectConfigs: [
          createTestJestProjectConfig(),
          createTestJestProjectConfig({
            configPath: 'another/jest.config.ts',
          }),
        ],
        testFilePath,
      }),
    ).toThrow('Multiple coverage-enabled Jest projects match');
  });
});

describe('buildFocusedCoverageJestArgs', () => {
  it('limits coverage to one source file and disables suite thresholds', () => {
    expect(
      buildFocusedCoverageJestArgs({
        configPath: 'shared/jest-shared.config.ts',
        coverageSourcePath: 'src/business/utilities/DateHandler.ts',
        jestArgs: ['--testMatch', '**/web-client/src/**/*.test.ts'],
        testFilePath: '/repo/shared/src/business/utilities/DateHandler.test.ts',
      }),
    ).toEqual([
      '--config',
      'shared/jest-shared.config.ts',
      '--testMatch',
      '**/web-client/src/**/*.test.ts',
      '--runTestsByPath',
      '/repo/shared/src/business/utilities/DateHandler.test.ts',
      '--coverage',
      '--coverageProvider=babel',
      '--coverageReporters=text',
      '--coverageThreshold={}',
      '--collectCoverageFrom=src/business/utilities/DateHandler.ts',
    ]);
  });
});

describe('runFileCoverageCommand', () => {
  it('uses the single-file scope and returns Jest’s exit code', () => {
    const testMatch = '**/scripts/tests/**/?(*.)+(spec|test).[jt]s?(x)';
    const dependencies = {
      getJestProjects: jest
        .fn()
        .mockReturnValue([createTestJestProjectConfig()]),
      runJest: jest.fn().mockReturnValue(7),
    };

    const result = runFileCoverageCommand({
      args: [
        'scripts/jest-scripts.config.ts',
        testFilePath,
        '--testMatch',
        testMatch,
      ],
      dependencies,
    });

    expect(result).toBe(7);
    expect(dependencies.runJest).toHaveBeenCalledWith(
      expect.arrayContaining([
        '--config',
        'scripts/jest-scripts.config.ts',
        '--testMatch',
        testMatch,
        '--coverage',
        '--coverageReporters=text',
        '--coverageThreshold={}',
        '--collectCoverageFrom=tests/run-jest-file-with-coverage.helpers.ts',
        testFilePath,
      ]),
      process.cwd(),
    );
  });

  it('does not run Jest for a file excluded from suite coverage', () => {
    const dependencies = {
      getJestProjects: jest.fn().mockReturnValue([
        createTestJestProjectConfig({
          collectCoverageFrom: ['**/*.{js,ts}', '!tests/**'],
        }),
      ]),
      runJest: jest.fn().mockReturnValue(0),
    };

    expect(() =>
      runFileCoverageCommand({
        args: ['scripts/jest-scripts.config.ts', testFilePath],
        cwd: process.cwd(),
        dependencies,
      }),
    ).toThrow('Coverage source file is excluded');
    expect(dependencies.runJest).not.toHaveBeenCalled();
  });

  it('detects the coverage-enabled owner from the global Jest config', () => {
    const coverageProject = createTestJestProjectConfig();
    const dependencies: FocusedCoverageDependencies = {
      getJestProjects: jest.fn().mockReturnValue([
        createTestJestProjectConfig({
          collectCoverageFrom: [],
          configPath:
            'shared/src/business/utilities/documentGenerators/jest_document_generator.config.ts',
        }),
        coverageProject,
      ]),
      runJest: jest.fn().mockReturnValue(0),
    };

    runFileCoverageCommand({
      args: ['jest.config.ts', testFilePath],
      cwd: process.cwd(),
      dependencies,
    });

    expect(dependencies.runJest).toHaveBeenCalledWith(
      expect.arrayContaining([
        '--config',
        coverageProject.configPath,
        '--collectCoverageFrom=tests/run-jest-file-with-coverage.helpers.ts',
      ]),
      process.cwd(),
    );
  });

  it('rejects a matching global Jest suite without coverage collection', () => {
    const testFilePath = path.resolve(
      __dirname,
      '../../shared/src/business/utilities/documentGenerators/coverSheet.test.ts',
    );
    const projectConfig = createTestJestProjectConfig({
      collectCoverageFrom: [],
      configPath:
        'shared/src/business/utilities/documentGenerators/jest_document_generator.config.ts',
      rootDir: path.dirname(testFilePath),
      testMatch: [
        path.join(path.dirname(testFilePath), '**/?(*.)+(spec|test).[jt]s?(x)'),
      ],
    });
    const dependencies: FocusedCoverageDependencies = {
      getJestProjects: jest.fn().mockReturnValue([
        createTestJestProjectConfig({
          testMatch: ['/somewhere/else/**/*.test.ts'],
        }),
        projectConfig,
      ]),
      runJest: jest.fn().mockReturnValue(0),
    };

    expect(() =>
      runFileCoverageCommand({
        args: ['jest.config.ts', testFilePath],
        cwd: process.cwd(),
        dependencies,
      }),
    ).toThrow('does not collect coverage');
    expect(dependencies.runJest).not.toHaveBeenCalled();
  });

  it('requires a Jest config path', () => {
    expect(() =>
      runFileCoverageCommand({
        args: [],
        cwd: process.cwd(),
      }),
    ).toThrow('The Jest config path is required');
  });

  it('requires valid test and coverage-source paths', () => {
    const dependencies: FocusedCoverageDependencies = {
      getJestProjects: jest.fn(),
      runJest: jest.fn(),
    };

    expect(() =>
      runFileCoverageCommand({
        args: ['scripts/jest-scripts.config.ts'],
        dependencies,
      }),
    ).toThrow('Provide exactly one Jest test file path');
    expect(() =>
      runFileCoverageCommand({
        args: [
          'scripts/jest-scripts.config.ts',
          testFilePath,
          '--coverage-source=',
        ],
        dependencies,
      }),
    ).toThrow('--coverage-source requires a source file path');
  });
});

describe('getJestProjectConfig', () => {
  const projectConfig = {
    collectCoverageFrom: ['src/**/*.{js,ts}', '!src/test/**'],
    rootDir: configRoot,
    testMatch: [path.join(configRoot, '**/?(*.)+(spec|test).[jt]s?(x)')],
    testPathIgnorePatterns: ['/node_modules/'],
  };
  const configJson = JSON.stringify({
    configs: [projectConfig],
  });

  it('loads one project and its coverage settings', () => {
    const processRunner: ProcessRunner = jest.fn().mockReturnValue({
      status: 0,
      stderr: null,
      stdout: configJson,
    });

    expect(
      getJestProjectConfig(
        'scripts/jest-scripts.config.ts',
        process.cwd(),
        processRunner,
      ),
    ).toEqual({
      collectCoverageFrom: ['src/**/*.{js,ts}', '!src/test/**'],
      configPath: path.resolve(process.cwd(), 'scripts/jest-scripts.config.ts'),
      rootDir: configRoot,
      testMatch: projectConfig.testMatch,
      testPathIgnorePatterns: ['/node_modules/'],
    });
    expect(processRunner).toHaveBeenCalledWith(
      process.execPath,
      [
        path.resolve(process.cwd(), 'node_modules/jest/bin/jest.js'),
        '--config',
        'scripts/jest-scripts.config.ts',
        '--showConfig',
      ],
      { cwd: process.cwd(), encoding: 'utf8' },
    );
  });

  it('loads the project through Jest when no process runner is injected', () => {
    const config = getJestProjectConfig(
      'scripts/jest-scripts.config.ts',
      process.cwd(),
    );
    const [project] = getJestProjectConfigs(
      'scripts/jest-scripts.config.ts',
      process.cwd(),
    );

    expect(config.rootDir).toBe(path.join(process.cwd(), 'scripts'));
    expect(config.collectCoverageFrom).toContain('**/*.{js,ts}');
    expect(config.testMatch).toContain(
      path.join(process.cwd(), 'scripts/**/?(*.)+(spec|test).[jt]s?(x)'),
    );
    expect(project.configPath).toBe(
      path.resolve(process.cwd(), 'scripts/jest-scripts.config.ts'),
    );
  });

  it('loads project config paths from a multi-project Jest config', () => {
    const sharedConfig = {
      ...projectConfig,
      rootDir: path.resolve(process.cwd(), 'shared'),
    };
    const projects = [
      path.resolve(process.cwd(), 'scripts/jest-scripts.config.ts'),
      path.resolve(process.cwd(), 'shared/jest-shared.config.ts'),
    ];
    const processRunner: ProcessRunner = jest.fn().mockReturnValue({
      status: 0,
      stderr: null,
      stdout: JSON.stringify({
        configs: [projectConfig, sharedConfig],
        globalConfig: { projects },
      }),
    });

    expect(
      getJestProjectConfigs('jest.config.ts', process.cwd(), processRunner),
    ).toEqual([
      { ...projectConfig, configPath: projects[0] },
      { ...sharedConfig, configPath: projects[1] },
    ]);
    expect(() =>
      getJestProjectConfig('jest.config.ts', process.cwd(), processRunner),
    ).toThrow('Expected one Jest project');
  });

  it('reports process errors and unsuccessful config loads', () => {
    expect(() =>
      getJestProjectConfig(
        'scripts/jest-scripts.config.ts',
        process.cwd(),
        () => ({
          error: new Error('spawn failed'),
          status: null,
          stderr: null,
          stdout: null,
        }),
      ),
    ).toThrow('Could not load Jest config: spawn failed');
    expect(() =>
      getJestProjectConfig(
        'scripts/jest-scripts.config.ts',
        process.cwd(),
        () => ({
          status: 1,
          stderr: 'invalid config',
          stdout: configJson,
        }),
      ),
    ).toThrow('invalid config');
    expect(() =>
      getJestProjectConfig(
        'scripts/jest-scripts.config.ts',
        process.cwd(),
        () => ({
          status: 0,
          stderr: null,
          stdout: null,
        }),
      ),
    ).toThrow('Jest exited without output');
  });

  it('rejects invalid config JSON shapes and missing project paths', () => {
    const getConfigForJson = (stdout: string): (() => void) => {
      return () =>
        getJestProjectConfig(
          'scripts/jest-scripts.config.ts',
          process.cwd(),
          () => ({ status: 0, stderr: null, stdout }),
        );
    };

    expect(getConfigForJson('null')).toThrow('Jest returned an invalid config');
    expect(getConfigForJson('{"configs":null}')).toThrow(
      'Jest returned an invalid config',
    );
    expect(getConfigForJson('{"configs":[]}')).toThrow(
      'Jest returned an invalid config',
    );
    expect(
      getConfigForJson(
        JSON.stringify({
          configs: [projectConfig, projectConfig],
          globalConfig: { projects: ['scripts/jest-scripts.config.ts'] },
        }),
      ),
    ).toThrow('Jest config is missing project paths');
    expect(
      getConfigForJson(
        JSON.stringify({
          configs: [projectConfig, projectConfig],
          globalConfig: {
            projects: ['scripts/jest-scripts.config.ts', null],
          },
        }),
      ),
    ).toThrow('Jest config is missing project paths');
    expect(
      getConfigForJson(
        JSON.stringify({
          configs: [projectConfig, projectConfig],
          globalConfig: {
            projects: [
              'scripts/jest-scripts.config.ts',
              'shared/jest-shared.config.ts',
            ],
          },
        }),
      ),
    ).toThrow('Expected one Jest project');
  });

  it('rejects malformed project settings', () => {
    const getConfigForProject = (project: unknown): (() => void) => {
      return () =>
        getJestProjectConfig(
          'scripts/jest-scripts.config.ts',
          process.cwd(),
          () => ({
            status: 0,
            stderr: null,
            stdout: JSON.stringify({ configs: [project] }),
          }),
        );
    };

    expect(getConfigForProject(null)).toThrow(
      'Jest config is missing coverage settings',
    );
    expect(
      getConfigForProject({ ...projectConfig, collectCoverageFrom: [] }),
    ).not.toThrow();
    expect(
      getConfigForProject({
        ...projectConfig,
        collectCoverageFrom: [null],
      }),
    ).toThrow('Jest config is missing coverage settings');
    expect(getConfigForProject({ ...projectConfig, testMatch: null })).toThrow(
      'Jest config is missing coverage settings',
    );
    expect(
      getConfigForProject({
        ...projectConfig,
        testPathIgnorePatterns: [null],
      }),
    ).toThrow('Jest config is missing coverage settings');
  });

  it('rejects missing project coverage settings', () => {
    expect(() =>
      getJestProjectConfig(
        'scripts/jest-scripts.config.ts',
        process.cwd(),
        () => ({
          status: 0,
          stderr: null,
          stdout: JSON.stringify({
            configs: [
              {
                ...projectConfig,
                collectCoverageFrom: undefined,
              },
            ],
          }),
        }),
      ),
    ).toThrow('Jest config is missing coverage settings');
  });

  it('rejects mismatched project config paths', () => {
    expect(() =>
      getJestProjectConfigs('jest.config.ts', process.cwd(), () => ({
        status: 0,
        stderr: null,
        stdout: JSON.stringify({
          configs: [projectConfig, projectConfig],
          globalConfig: {
            projects: ['scripts/jest-scripts.config.ts'],
          },
        }),
      })),
    ).toThrow('Jest config is missing project paths');
  });
});

describe('runProcess', () => {
  it('captures output from a successful subprocess', () => {
    const result = runProcess(
      process.execPath,
      ['-e', 'process.stdout.write("focused coverage")'],
      { cwd: process.cwd(), encoding: 'utf8' },
    );

    expect(result).toMatchObject({
      status: 0,
      stderr: '',
      stdout: 'focused coverage',
    });
  });

  it('runs a subprocess with inherited output', () => {
    const result = runProcess(process.execPath, ['-e', 'process.exit(0)'], {
      cwd: process.cwd(),
      stdio: 'inherit',
    });

    expect(result).toEqual({
      status: 0,
      stderr: null,
      stdout: null,
    });
  });

  it('returns an error when the subprocess cannot start', () => {
    const result = runProcess('/missing/jest-coverage-command', [], {
      cwd: process.cwd(),
      encoding: 'utf8',
    });

    expect(result.error?.message).toContain('ENOENT');
  });
});

describe('runJest', () => {
  it('returns the Jest process exit code and handles signals', () => {
    expect(
      runJest([], process.cwd(), () => ({
        status: 3,
        stderr: null,
        stdout: null,
      })),
    ).toBe(3);
    expect(
      runJest([], process.cwd(), () => ({
        status: null,
        stderr: null,
        stdout: null,
      })),
    ).toBe(1);
  });

  it('surfaces Jest process startup errors', () => {
    expect(() =>
      runJest([], process.cwd(), () => ({
        error: new Error('spawn failed'),
        status: null,
        stderr: null,
        stdout: null,
      })),
    ).toThrow('Could not start Jest: spawn failed');
  });

  it('runs Jest when no process runner is injected', () => {
    expect(runJest(['--version'], process.cwd())).toBe(0);
  });
});

describe('runCli', () => {
  it('returns the command result and reports errors', () => {
    const dependencies: FocusedCoverageDependencies = {
      getJestProjects: () => [createTestJestProjectConfig()],
      runJest: () => 0,
    };
    expect(
      runCli({
        args: ['scripts/jest-scripts.config.ts', testFilePath],
        cwd: process.cwd(),
        dependencies,
      }),
    ).toBe(0);

    const consoleError = jest
      .spyOn(console, 'error')
      .mockImplementation(() => undefined);
    try {
      const result = runCli({
        args: ['scripts/jest-scripts.config.ts', testFilePath],
        cwd: process.cwd(),
        dependencies: {
          ...dependencies,
          getJestProjects: () => {
            throw new Error('config unavailable');
          },
        },
      });

      expect(result).toBe(1);
      expect(consoleError).toHaveBeenCalledWith('config unavailable');
    } finally {
      consoleError.mockRestore();
    }
  });

  it('reports argument errors with default dependencies', () => {
    const consoleError = jest
      .spyOn(console, 'error')
      .mockImplementation(() => undefined);

    try {
      expect(runCli({ args: [] })).toBe(1);
      expect(consoleError).toHaveBeenCalledWith(
        'The Jest config path is required.',
      );
    } finally {
      consoleError.mockRestore();
    }
  });
});

describe('getErrorMessage', () => {
  it('formats both Error instances and other thrown values', () => {
    expect(getErrorMessage(new Error('known error'))).toBe('known error');
    expect(getErrorMessage('unknown error')).toBe('unknown error');
  });
});
