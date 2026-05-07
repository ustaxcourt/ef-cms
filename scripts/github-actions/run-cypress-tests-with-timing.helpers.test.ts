jest.mock('cypress', () => ({
  run: jest.fn(),
}));

import { main } from './run-cypress-tests-with-timing.helpers';

describe('run-cypress-tests-with-timing', () => {
  const createDependencies = () => {
    return {
      cypressRunner: {
        run: jest.fn(),
      },
      env: {} as NodeJS.ProcessEnv,
      exit: jest.fn(),
      getCypressTestFileTimes: jest.fn(),
      writeTestFileTimes: jest.fn(),
    };
  };

  it('throws a usage error when required arguments are missing', async () => {
    const dependencies = createDependencies();

    await expect(main([], dependencies)).rejects.toThrow(
      'Usage: scripts/github-actions/run-cypress-tests-with-timing.ts <config-file> <specs> <output> [browser]',
    );

    expect(dependencies.cypressRunner.run).not.toHaveBeenCalled();
    expect(dependencies.writeTestFileTimes).not.toHaveBeenCalled();
    expect(dependencies.exit).not.toHaveBeenCalled();
  });

  it('throws a usage error when called with the default args parameter', async () => {
    const dependencies = createDependencies();
    const originalArgv = process.argv;

    try {
      process.argv = ['node', 'run-cypress-tests-with-timing.ts'];

      await expect(main(undefined, dependencies)).rejects.toThrow(
        'Usage: scripts/github-actions/run-cypress-tests-with-timing.ts <config-file> <specs> <output> [browser]',
      );
    } finally {
      process.argv = originalArgv;
    }

    expect(dependencies.cypressRunner.run).not.toHaveBeenCalled();
  });

  it('throws a usage error when called with the default dependencies parameter', async () => {
    await expect(main([], undefined)).rejects.toThrow(
      'Usage: scripts/github-actions/run-cypress-tests-with-timing.ts <config-file> <specs> <output> [browser]',
    );
  });

  it('runs Cypress with default environment values and writes timing data', async () => {
    const dependencies = createDependencies();
    const cypressResults = {
      runs: [
        {
          spec: {
            relative: 'cypress/local-only/tests/example.cy.ts',
          },
          stats: {
            duration: 1234,
          },
        },
      ],
      totalFailed: 2,
    };
    const testFileTimes = {
      './cypress/local-only/tests/example.cy.ts': 1234,
    };

    dependencies.cypressRunner.run.mockResolvedValue(cypressResults);
    dependencies.getCypressTestFileTimes.mockReturnValue(testFileTimes);

    await main(
      [
        'cypress.config.ts',
        'cypress/local-only/tests/example.cy.ts',
        'timings.json',
      ],
      dependencies,
    );

    expect(dependencies.env.CYPRESS_AWS_ACCESS_KEY_ID).toBe('S3RVER');
    expect(dependencies.env.CYPRESS_AWS_SECRET_ACCESS_KEY).toBe('S3RVER');
    expect(dependencies.env.CYPRESS_CHECK_DEPLOY_DATE_INTERVAL).toBe('5000');
    expect(dependencies.cypressRunner.run).toHaveBeenCalledWith({
      browser: 'edge',
      configFile: 'cypress.config.ts',
      spec: 'cypress/local-only/tests/example.cy.ts',
    });
    expect(dependencies.getCypressTestFileTimes).toHaveBeenCalledWith({
      results: cypressResults,
    });
    expect(dependencies.writeTestFileTimes).toHaveBeenCalledWith({
      filePath: 'timings.json',
      testFileTimes,
    });
    expect(dependencies.exit).toHaveBeenCalledWith(2);
  });

  it('preserves existing environment values and honors a provided browser', async () => {
    const dependencies = createDependencies();
    const cypressResults = {
      runs: [],
      totalFailed: 0,
    };

    dependencies.env.CYPRESS_AWS_ACCESS_KEY_ID = 'existing-access-key';
    dependencies.env.CYPRESS_AWS_SECRET_ACCESS_KEY = 'existing-secret';
    dependencies.env.CYPRESS_CHECK_DEPLOY_DATE_INTERVAL = '9000';
    dependencies.cypressRunner.run.mockResolvedValue(cypressResults);
    dependencies.getCypressTestFileTimes.mockReturnValue({});

    await main(
      [
        'cypress-public.config.ts',
        'spec-a.cy.ts,spec-b.cy.ts',
        'timings.json',
        'chrome',
      ],
      dependencies,
    );

    expect(dependencies.env.CYPRESS_AWS_ACCESS_KEY_ID).toBe(
      'existing-access-key',
    );
    expect(dependencies.env.CYPRESS_AWS_SECRET_ACCESS_KEY).toBe(
      'existing-secret',
    );
    expect(dependencies.env.CYPRESS_CHECK_DEPLOY_DATE_INTERVAL).toBe('9000');
    expect(dependencies.cypressRunner.run).toHaveBeenCalledWith({
      browser: 'chrome',
      configFile: 'cypress-public.config.ts',
      spec: 'spec-a.cy.ts,spec-b.cy.ts',
    });
    expect(dependencies.exit).toHaveBeenCalledWith(0);
  });

  it('throws the Cypress failure message and skips writing timings when the run fails', async () => {
    const dependencies = createDependencies();

    dependencies.cypressRunner.run.mockResolvedValue({
      failures: 1,
      message: 'Cypress failed to launch',
    });

    await expect(
      main(
        ['cypress.config.ts', 'example.cy.ts', 'timings.json'],
        dependencies,
      ),
    ).rejects.toThrow('Cypress failed to launch');

    expect(dependencies.getCypressTestFileTimes).not.toHaveBeenCalled();
    expect(dependencies.writeTestFileTimes).not.toHaveBeenCalled();
    expect(dependencies.exit).not.toHaveBeenCalled();
  });
});
