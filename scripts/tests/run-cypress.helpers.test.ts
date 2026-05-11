/* eslint-disable max-lines */
jest.mock('cypress', () => ({
  open: jest.fn(),
  run: jest.fn(),
}));
jest.mock(
  '../../shared/src/business/utilities/documentGenerators/jest_document_generator.config',
  () => ({
    testMatch:
      '**/shared/src/business/utilities/documentGenerators/**/?(*.)+(spec|test).[jt]s',
  }),
);
jest.mock(
  '../../web-api/hostedEnvironmentTests/jest-hosted-environment',
  () => ({
    testMatch: ['**/web-api/hostedEnvironmentTests/**/?(*.)+(spec|test).[jt]s'],
  }),
);
jest.mock('../../aws/jest-infrastructure.config', () => ({
  testMatch: ['**/aws/**/?(*.)+(spec|test).[jt]s'],
}));
jest.mock('../jest-scripts.config', () => ({
  testMatch: ['<rootDir>/**/?(*.)+(spec|test).[jt]s?(x)'],
}));
jest.mock('../../shared/jest-shared.config', () => ({
  testMatch: [
    '<rootDir>/admin-tools/**/?(*.)+(spec|test).[jt]s?(x)',
    '<rootDir>/src/**/?(*.)+(spec|test).[jt]s?(x)',
  ],
}));
jest.mock('../../web-api/jest-unit.config', () => ({
  testMatch: ['', '<rootDir>/src/**/?(*.)+(spec|test).[jt]s?(x)'],
}));
jest.mock('../../web-client/jest-integration.config', () => ({
  testMatch: ['<rootDir>/integration-tests/**/?(*.)+(spec|test).[jt]s?(x)'],
}));
jest.mock('../../web-client/jest-unit.config', () => ({
  testMatch: ['<rootDir>/src/**/?(*.)+(spec|test).[jt]s?(x)'],
}));
jest.mock('../github-actions/test-file-times.helpers');

import {
  determineSuiteFromSpecs,
  onOpen,
  onSpecs,
  onSuite,
  openCypressSuite,
  runCypressWithTiming,
} from './run-cypress.helpers';
import fs from 'fs';

describe('run-cypress', () => {
  const createDependencies = () => {
    return {
      cypressRunner: {
        open: jest.fn(),
        run: jest.fn(),
      },
      dawson: { isLocal: true, isPublic: false },
      env: {} as NodeJS.ProcessEnv,
      exit: jest.fn(),
      getCypressTestFileTimes: jest.fn(),
      writeTestFileTimes: jest.fn(),
    };
  };

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

    await runCypressWithTiming({
      configFile: 'cypress.config.ts',
      current: false,
      dependencies,
      outputFilePath: 'timings.json',
    });

    expect(dependencies.env.CYPRESS_TARGET_ENV).toBe('local');
    expect(dependencies.env.CYPRESS_AWS_ACCESS_KEY_ID).toBe('S3RVER');
    expect(dependencies.env.CYPRESS_AWS_SECRET_ACCESS_KEY).toBe('S3RVER');
    expect(dependencies.env.CYPRESS_CHECK_DEPLOY_DATE_INTERVAL).toBe('5000');
    expect(dependencies.env.CYPRESS_BASE_URL).toBe('http://localhost:1234');
    expect(dependencies.cypressRunner.run).toHaveBeenCalledWith({
      browser: 'edge',
      configFile: 'cypress.config.ts',
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

    await runCypressWithTiming({
      browserArg: 'chrome',
      configFile: 'cypress-public.config.ts',
      current: false,
      dependencies,
      outputFilePath: 'timings.json',
      specs: 'spec-a.cy.ts,spec-b.cy.ts',
    });

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

  it('runCypressWithTiming uses default dependencies if none are provided', async () => {
    const cypress = require('cypress');
    cypress.run.mockResolvedValue({
      runs: [],
      totalFailed: 0,
    });
    const exitSpy = jest.spyOn(process, 'exit').mockImplementation(() => {
      return undefined as never;
    });

    await runCypressWithTiming({
      configFile: 'cypress.config.ts',
      current: false,
      outputFilePath: 'results.json',
    });

    expect(cypress.run).toHaveBeenCalled();
    expect(exitSpy).toHaveBeenCalled();
    exitSpy.mockRestore();
  });

  it('disables command logs and forwards ENV', async () => {
    const dependencies = createDependencies();
    const cypressResults = {
      runs: [],
      totalFailed: 0,
    };

    dependencies.env.CI = 'true';
    dependencies.env.ENV = 'jest';
    dependencies.cypressRunner.run.mockResolvedValue(cypressResults);
    dependencies.getCypressTestFileTimes.mockReturnValue({});

    await runCypressWithTiming({
      configFile: 'cypress.config.ts',
      current: false,
      dependencies,
      outputFilePath: 'timings.json',
      specs: 'example.cy.ts',
    });

    expect(dependencies.env.CYPRESS_NO_COMMAND_LOG).toBe('1');
    expect(dependencies.env.CYPRESS_TARGET_ENV).toBe('jest');
  });

  it('sets correct defaults for private smoketests', async () => {
    const dependencies = createDependencies();
    dependencies.cypressRunner.run.mockResolvedValue({
      runs: [],
      totalFailed: 0,
    });

    await runCypressWithTiming({
      configFile: 'cypress-smoketests.config.ts',
      current: false,
      dependencies,
      outputFilePath: 'timings.json',
      specs: 'example.cy.ts',
    });

    expect(dependencies.env.CYPRESS_BASE_URL).toBe('http://localhost:1234');
    expect(dependencies.cypressRunner.run).toHaveBeenCalledWith({
      browser: 'edge',
      configFile: 'cypress-smoketests.config.ts',
      spec: 'example.cy.ts',
    });
  });

  it('sets correct defaults for public smoketests', async () => {
    const dependencies = createDependencies();
    dependencies.cypressRunner.run.mockResolvedValue({
      runs: [],
      totalFailed: 0,
    });

    await runCypressWithTiming({
      configFile: 'cypress-smoketests-public.config.ts',
      current: false,
      dependencies,
      outputFilePath: 'timings.json',
      specs: 'example.cy.ts',
    });

    expect(dependencies.env.CYPRESS_BASE_URL).toBe('http://localhost:5678');
    expect(dependencies.cypressRunner.run).toHaveBeenCalledWith({
      browser: 'chrome',
      configFile: 'cypress-smoketests-public.config.ts',
      spec: 'example.cy.ts',
    });
  });

  it('defaults to chrome for public integration tests', async () => {
    const dependencies = createDependencies();
    dependencies.cypressRunner.run.mockResolvedValue({
      runs: [],
      totalFailed: 0,
    });

    await runCypressWithTiming({
      configFile: 'cypress-public.config.ts',
      current: false,
      dependencies,
      outputFilePath: 'timings.json',
      specs: 'example.cy.ts',
    });

    expect(dependencies.env.CYPRESS_BASE_URL).toBe('http://localhost:5678');
    expect(dependencies.cypressRunner.run).toHaveBeenCalledWith({
      browser: 'chrome',
      configFile: 'cypress-public.config.ts',
      spec: 'example.cy.ts',
    });
  });

  it('preserves existing CYPRESS_BASE_URL', async () => {
    const dependencies = createDependencies();
    dependencies.env.CYPRESS_BASE_URL = 'http://existing:9999';
    dependencies.cypressRunner.run.mockResolvedValue({
      runs: [],
      totalFailed: 0,
    });

    await runCypressWithTiming({
      configFile: 'cypress-smoketests.config.ts',
      current: false,
      dependencies,
      outputFilePath: 'timings.json',
      specs: 'example.cy.ts',
    });

    expect(dependencies.env.CYPRESS_BASE_URL).toBe('http://existing:9999');
  });

  it('sets correct defaults for real user tests', async () => {
    const dependencies = createDependencies();
    dependencies.cypressRunner.run.mockResolvedValue({
      runs: [],
      totalFailed: 0,
    });

    await runCypressWithTiming({
      configFile: 'cypress-real-user-tests.config.ts',
      current: false,
      dependencies,
      outputFilePath: 'timings.json',
      specs: 'example.cy.ts',
    });

    expect(dependencies.env.CYPRESS_BASE_URL).toBe('http://localhost:1234');
    expect(dependencies.cypressRunner.run).toHaveBeenCalledWith({
      browser: 'edge',
      configFile: 'cypress-real-user-tests.config.ts',
      spec: 'example.cy.ts',
    });
  });

  it('throws the Cypress failure message and skips writing timings when the run fails', async () => {
    const dependencies = createDependencies();

    dependencies.cypressRunner.run.mockResolvedValue({
      failures: 1,
      message: 'Cypress failed to launch',
    });

    await expect(
      runCypressWithTiming({
        configFile: 'cypress.config.ts',
        current: false,
        dependencies,
        outputFilePath: 'timings.json',
        specs: 'example.cy.ts',
      }),
    ).rejects.toThrow('Cypress failed to launch');

    expect(dependencies.getCypressTestFileTimes).not.toHaveBeenCalled();
    expect(dependencies.writeTestFileTimes).not.toHaveBeenCalled();
    expect(dependencies.exit).not.toHaveBeenCalled();
  });

  describe('determineSuiteFromSpecs', () => {
    it('determines the public suite from public spec files', () => {
      const extantSpecs = [
        'cypress/local-only/tests/integration/public/public-a.cy.ts',
      ];
      const suite = determineSuiteFromSpecs({ extantSpecs });
      expect(suite).toBe('public');
    });

    it('determines the integration suite from private spec files', () => {
      const extantSpecs = [
        'cypress/local-only/tests/integration/private-a.cy.ts',
      ];
      const suite = determineSuiteFromSpecs({ extantSpecs });
      expect(suite).toBe('integration');
    });

    it('throws an error if no matching suite is found', () => {
      const extantSpecs = ['unknown/file.cy.ts'];
      expect(() => determineSuiteFromSpecs({ extantSpecs })).toThrow(
        'No matching suite found for specs: unknown/file.cy.ts',
      );
    });

    it('throws an error if multiple matching suites are found', () => {
      const extantSpecs = [
        'cypress/local-only/tests/integration/private-a.cy.ts',
        'cypress/local-only/tests/accessibility/private-a.cy.ts',
      ];
      expect(() => determineSuiteFromSpecs({ extantSpecs })).toThrow(
        'Multiple matching suites found for specs: cypress/local-only/tests/integration/private-a.cy.ts,cypress/local-only/tests/accessibility/private-a.cy.ts. Please specify the suite explicitly.',
      );
    });

    it('does not add the same suite multiple times when multiple public spec files are provided', () => {
      const extantSpecs = [
        'cypress/local-only/tests/integration/public/public-a.cy.ts',
        'cypress/local-only/tests/integration/public/public-b.cy.ts',
      ];
      const suite = determineSuiteFromSpecs({ extantSpecs });
      expect(suite).toBe('public');
    });

    it('does not add the same suite multiple times when multiple private spec files are provided', () => {
      const extantSpecs = [
        'cypress/local-only/tests/integration/private-a.cy.ts',
        'cypress/local-only/tests/integration/private-b.cy.ts',
      ];
      const suite = determineSuiteFromSpecs({ extantSpecs });
      expect(suite).toBe('integration');
    });
  });

  describe('onOpen', () => {
    it('throws an error if cypressSuite is missing', async () => {
      await expect(onOpen({ current: false })).rejects.toThrow(
        'Must specify --suite to open',
      );
    });

    it('throws an error if cypressSuite is invalid', async () => {
      await expect(
        onOpen({ current: false, cypressSuite: 'invalid' }),
      ).rejects.toThrow('Invalid Cypress suite: invalid');
    });

    it('calls openCypressSuite with determined browser for public suite', async () => {
      const dependencies = createDependencies();
      await onOpen({ current: false, cypressSuite: 'public', dependencies });
      expect(dependencies.cypressRunner.open).toHaveBeenCalledWith({
        browser: 'chrome',
        configFile: 'cypress-public.config.ts',
      });
    });

    it('calls openCypressSuite with determined browser for private suite', async () => {
      const dependencies = createDependencies();
      await onOpen({
        current: false,
        cypressSuite: 'integration',
        dependencies,
      });
      expect(dependencies.cypressRunner.open).toHaveBeenCalledWith({
        browser: 'edge',
        configFile: 'cypress.config.ts',
      });
    });

    it('calls openCypressSuite with provided browser', async () => {
      const dependencies = createDependencies();
      await onOpen({
        browser: 'firefox',
        current: false,
        cypressSuite: 'integration',
        dependencies,
      });
      expect(dependencies.cypressRunner.open).toHaveBeenCalledWith({
        browser: 'firefox',
        configFile: 'cypress.config.ts',
      });
    });

    it('uses provided empty browser string (edge branch)', async () => {
      const dependencies = createDependencies();
      await onOpen({
        browser: '',
        current: false,
        cypressSuite: 'integration',
        dependencies,
      });
      expect(dependencies.cypressRunner.open).toHaveBeenCalledWith({
        browser: 'edge',
        configFile: 'cypress.config.ts',
      });
    });
  });

  describe('onSpecs', () => {
    it('throws an error if no matching spec files are found', async () => {
      jest.spyOn(fs, 'existsSync').mockReturnValue(false);
      await expect(
        onSpecs({ current: false, file: 'nonexistent.cy.ts' }),
      ).rejects.toThrow('No matching spec files found: nonexistent.cy.ts');
    });

    it('calls runCypressWithTiming with determined suite and browser', async () => {
      jest.spyOn(fs, 'existsSync').mockReturnValue(true);
      const dependencies = createDependencies();
      dependencies.cypressRunner.run.mockResolvedValue({
        runs: [],
        totalFailed: 0,
      });

      await onSpecs({
        current: false,
        dependencies,
        file: 'cypress/local-only/tests/integration/private-a.cy.ts',
      });

      expect(dependencies.cypressRunner.run).toHaveBeenCalledWith({
        browser: 'edge',
        configFile: 'cypress.config.ts',
        spec: 'cypress/local-only/tests/integration/private-a.cy.ts',
      });
    });

    it('calls runCypressWithTiming with public suite and browser', async () => {
      jest.spyOn(fs, 'existsSync').mockReturnValue(true);
      const dependencies = createDependencies();
      dependencies.cypressRunner.run.mockResolvedValue({
        runs: [],
        totalFailed: 0,
      });

      await onSpecs({
        current: false,
        dependencies,
        file: 'cypress/local-only/tests/integration/public/public-a.cy.ts',
      });

      expect(dependencies.cypressRunner.run).toHaveBeenCalledWith({
        browser: 'chrome',
        configFile: 'cypress-public.config.ts',
        spec: 'cypress/local-only/tests/integration/public/public-a.cy.ts',
      });
    });

    it('honors provided outputFilePath', async () => {
      jest.spyOn(fs, 'existsSync').mockReturnValue(true);
      const dependencies = createDependencies();
      dependencies.cypressRunner.run.mockResolvedValue({
        runs: [],
        totalFailed: 0,
      });

      await onSpecs({
        current: false,
        dependencies,
        file: 'cypress/local-only/tests/integration/private-a.cy.ts',
        outputFilePath: 'custom-results.json',
      });

      expect(dependencies.writeTestFileTimes).toHaveBeenCalledWith(
        expect.objectContaining({
          filePath: 'custom-results.json',
        }),
      );
    });

    it('honors provided browser', async () => {
      jest.spyOn(fs, 'existsSync').mockReturnValue(true);
      const dependencies = createDependencies();
      dependencies.cypressRunner.run.mockResolvedValue({
        runs: [],
        totalFailed: 0,
      });

      await onSpecs({
        browser: 'firefox',
        current: false,
        dependencies,
        file: 'cypress/local-only/tests/integration/private-a.cy.ts',
      });

      expect(dependencies.cypressRunner.run).toHaveBeenCalledWith(
        expect.objectContaining({
          browser: 'firefox',
        }),
      );
    });
  });

  describe('onSuite', () => {
    it('throws an error if cypressSuite is missing', async () => {
      await expect(onSuite({ current: false })).rejects.toThrow(
        'Must specify either --suite or --file',
      );
    });

    it('throws an error if cypressSuite is invalid', async () => {
      await expect(
        onSuite({ current: false, cypressSuite: 'invalid' }),
      ).rejects.toThrow('Invalid suite: invalid');
    });

    it('calls runCypressWithTiming for the given suite', async () => {
      const dependencies = createDependencies();
      dependencies.cypressRunner.run.mockResolvedValue({
        runs: [],
        totalFailed: 0,
      });

      await onSuite({
        current: false,
        cypressSuite: 'integration',
        dependencies,
      });

      expect(dependencies.cypressRunner.run).toHaveBeenCalledWith({
        browser: 'edge',
        configFile: 'cypress.config.ts',
      });
    });

    it('calls runCypressWithTiming for the given public suite', async () => {
      const dependencies = createDependencies();
      dependencies.cypressRunner.run.mockResolvedValue({
        runs: [],
        totalFailed: 0,
      });

      await onSuite({ current: false, cypressSuite: 'public', dependencies });

      expect(dependencies.cypressRunner.run).toHaveBeenCalledWith({
        browser: 'chrome',
        configFile: 'cypress-public.config.ts',
      });
    });

    it('calls runCypressWithTiming with the provided browser', async () => {
      const dependencies = createDependencies();
      dependencies.cypressRunner.run.mockResolvedValue({
        runs: [],
        totalFailed: 0,
      });

      await onSuite({
        browser: 'firefox',
        current: false,
        cypressSuite: 'integration',
        dependencies,
      });

      expect(dependencies.cypressRunner.run).toHaveBeenCalledWith(
        expect.objectContaining({
          browser: 'firefox',
        }),
      );
    });
  });

  describe('openCypressSuite', () => {
    it('calls cypressRunner.open with correct options', async () => {
      const dependencies = createDependencies();
      await openCypressSuite({
        configFile: 'cypress.config.ts',
        current: false,
        dependencies,
      });

      expect(dependencies.cypressRunner.open).toHaveBeenCalledWith({
        browser: 'edge',
        configFile: 'cypress.config.ts',
      });
    });

    it('calls cypressRunner.open with correct options for public suite', async () => {
      const dependencies = createDependencies();
      await openCypressSuite({
        configFile: 'cypress-public.config.ts',
        current: false,
        dependencies,
      });

      expect(dependencies.cypressRunner.open).toHaveBeenCalledWith({
        browser: 'chrome',
        configFile: 'cypress-public.config.ts',
      });
    });

    it('uses provided browserArg', async () => {
      const dependencies = createDependencies();
      await openCypressSuite({
        browserArg: 'firefox',
        configFile: 'cypress.config.ts',
        current: false,
        dependencies,
      });

      expect(dependencies.cypressRunner.open).toHaveBeenCalledWith({
        browser: 'firefox',
        configFile: 'cypress.config.ts',
      });
    });

    it('uses default dependencies if none are provided', async () => {
      const cypress = require('cypress');
      await openCypressSuite({
        configFile: 'cypress.config.ts',
        current: false,
      });

      expect(cypress.open).toHaveBeenCalledWith(
        expect.objectContaining({
          configFile: 'cypress.config.ts',
        }),
      );
    });
  });

  describe('setEnvironmentVariables (deployed)', () => {
    it('sets correct environment variables for deployed environment', async () => {
      const dependencies = createDependencies();
      dependencies.env.ENV = 'stg';
      dependencies.env.CURRENT_COLOR = 'blue';
      dependencies.env.EFCMS_DOMAIN = 'example.com';
      dependencies.env.AWS_ACCESS_KEY_ID = 'aws-key';
      dependencies.env.AWS_SECRET_ACCESS_KEY = 'aws-secret';
      dependencies.env.AWS_SESSION_TOKEN = 'aws-token';
      dependencies.cypressRunner.run.mockResolvedValue({
        runs: [],
        totalFailed: 0,
      });

      await runCypressWithTiming({
        configFile: 'cypress.config.ts',
        current: false,
        dependencies,
        outputFilePath: 'results.json',
      });

      expect(dependencies.env.CYPRESS_BASE_URL).toBe(
        'https://app-green.example.com',
      );
      expect(dependencies.env.CYPRESS_AWS_ACCESS_KEY_ID).toBe('aws-key');
      expect(dependencies.env.CYPRESS_AWS_SECRET_ACCESS_KEY).toBe('aws-secret');
      expect(dependencies.env.CYPRESS_AWS_SESSION_TOKEN).toBe('aws-token');
      expect(dependencies.env.CYPRESS_DEPLOYING_COLOR).toBe('green');
    });

    it('sets correct environment variables for deployed environment (blue)', async () => {
      const dependencies = createDependencies();
      dependencies.env.ENV = 'stg';
      dependencies.env.CURRENT_COLOR = 'blue';
      dependencies.env.EFCMS_DOMAIN = 'example.com';
      dependencies.cypressRunner.run.mockResolvedValue({
        runs: [],
        totalFailed: 0,
      });

      await runCypressWithTiming({
        configFile: 'cypress.config.ts',
        current: true,
        dependencies,
        outputFilePath: 'results.json',
      });

      expect(dependencies.env.CYPRESS_BASE_URL).toBe(
        'https://app-blue.example.com',
      );
      expect(dependencies.env.CYPRESS_DEPLOYING_COLOR).toBe('blue');
    });

    it('sets correct environment variables for deployed public environment', async () => {
      const dependencies = createDependencies();
      dependencies.env.ENV = 'stg';
      dependencies.env.CURRENT_COLOR = 'blue';
      dependencies.env.EFCMS_DOMAIN = 'example.com';
      dependencies.cypressRunner.run.mockResolvedValue({
        runs: [],
        totalFailed: 0,
      });

      await runCypressWithTiming({
        configFile: 'cypress-public.config.ts',
        current: false,
        dependencies,
        outputFilePath: 'results.json',
      });

      expect(dependencies.env.CYPRESS_BASE_URL).toBe(
        'https://green.example.com',
      );
    });

    it('sets correct environment variables for deployed environment (green)', async () => {
      const dependencies = createDependencies();
      dependencies.env.ENV = 'stg';
      dependencies.env.CURRENT_COLOR = 'green';
      dependencies.env.EFCMS_DOMAIN = 'example.com';
      dependencies.cypressRunner.run.mockResolvedValue({
        runs: [],
        totalFailed: 0,
      });

      await runCypressWithTiming({
        configFile: 'cypress.config.ts',
        current: false,
        dependencies,
        outputFilePath: 'results.json',
      });

      expect(dependencies.env.CYPRESS_BASE_URL).toBe(
        'https://app-blue.example.com',
      );
      expect(dependencies.env.CYPRESS_DEPLOYING_COLOR).toBe('blue');
    });

    it('defaults ENV to local if missing', async () => {
      const dependencies = createDependencies();
      delete dependencies.env.ENV;
      dependencies.cypressRunner.run.mockResolvedValue({
        runs: [],
        totalFailed: 0,
      });

      await runCypressWithTiming({
        configFile: 'cypress.config.ts',
        current: false,
        dependencies,
        outputFilePath: 'results.json',
      });

      expect(dependencies.env.ENV).toBe('local');
      expect(dependencies.env.CYPRESS_BASE_URL).toBe('http://localhost:1234');
    });

    it('honors CI flag for command log', async () => {
      const dependencies = createDependencies();
      dependencies.env.CI = 'true';
      dependencies.cypressRunner.run.mockResolvedValue({
        runs: [],
        totalFailed: 0,
      });

      await runCypressWithTiming({
        configFile: 'cypress.config.ts',
        current: false,
        dependencies,
        outputFilePath: 'results.json',
      });

      expect(dependencies.env.CYPRESS_NO_COMMAND_LOG).toBe('1');
    });
  });
});
