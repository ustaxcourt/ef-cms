import fs from 'fs';
import os from 'os';
import path from 'path';
import {
  buildJunitXmlFromTestFileTimes,
  convertTestFileTimesToJunit,
  writeJunitXmlFromTestFileTimes,
} from './test-file-times-to-junit.helpers';

describe('test-file-times-to-junit.helpers', () => {
  const tempDir = fs.mkdtempSync(
    path.join(os.tmpdir(), 'cypress-timing-to-junit-'),
  );

  afterAll(() => {
    fs.rmSync(tempDir, { force: true, recursive: true });
  });

  describe('buildJunitXmlFromTestFileTimes', () => {
    it('builds JUnit XML with one testcase per Cypress spec', () => {
      const junitXml = buildJunitXmlFromTestFileTimes({
        suiteName: 'smoketests',
        testFileTimes: {
          'cypress/z-last.cy.ts': 2500,
          'cypress/a-first.cy.ts': 1500,
        },
      });

      expect(junitXml).toContain(
        '<testsuites tests="2" failures="0" errors="0" time="4.000">',
      );
      expect(junitXml).toContain(
        '<testsuite name="smoketests" tests="2" failures="0" errors="0" time="4.000">',
      );
      expect(junitXml).toContain(
        '<testcase classname="smoketests" file="cypress/a-first.cy.ts" name="cypress/a-first.cy.ts" time="1.500" />',
      );
      expect(junitXml).toContain(
        '<testcase classname="smoketests" file="cypress/z-last.cy.ts" name="cypress/z-last.cy.ts" time="2.500" />',
      );
      expect(
        junitXml.indexOf('cypress/a-first.cy.ts') <
          junitXml.indexOf('cypress/z-last.cy.ts'),
      ).toBe(true);
    });

    it('escapes XML-sensitive characters in suite names and file paths', () => {
      const junitXml = buildJunitXmlFromTestFileTimes({
        suiteName: 'smoke & <tests> "today"',
        testFileTimes: {
          'cypress/a&b<\'".cy.ts': 1000,
        },
      });

      expect(junitXml).toContain(
        'name="smoke &amp; &lt;tests&gt; &quot;today&quot;"',
      );
      expect(junitXml).toContain(
        'file="cypress/a&amp;b&lt;&apos;&quot;.cy.ts"',
      );
    });
  });

  describe('writeJunitXmlFromTestFileTimes', () => {
    it('reads timing json and writes a JUnit XML file', () => {
      const inputFilePath = path.join(tempDir, 'timings.json');
      const outputFilePath = path.join(tempDir, 'nested', 'results.xml');

      fs.writeFileSync(
        inputFilePath,
        JSON.stringify({
          'cypress/deployed-and-local/integration/example.cy.ts': 3210,
        }),
      );

      const testFileCount = writeJunitXmlFromTestFileTimes({
        inputFilePath,
        outputFilePath,
        suiteName: 'circleci-smoketests',
      });

      expect(testFileCount).toBe(1);
      expect(fs.existsSync(outputFilePath)).toBe(true);
      expect(fs.readFileSync(outputFilePath, 'utf8')).toContain('time="3.210"');
    });
  });

  describe('convertTestFileTimesToJunit', () => {
    it('writes JUnit XML and logs a summary', () => {
      const inputFilePath = path.join(tempDir, 'cli-timings.json');
      const outputFilePath = path.join(tempDir, 'cli-results.xml');
      const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();

      fs.writeFileSync(
        inputFilePath,
        JSON.stringify({
          'cypress/deployed-and-local/integration/example.cy.ts': 999,
        }),
      );

      convertTestFileTimesToJunit({
        inputFilePath,
        outputFilePath,
        suiteName: 'smoketests-0',
      });

      expect(fs.readFileSync(outputFilePath, 'utf8')).toContain(
        'name="smoketests-0"',
      );
      expect(consoleLogSpy).toHaveBeenCalledWith(
        `Wrote CircleCI test results to ${outputFilePath} (1 test files).`,
      );
      consoleLogSpy.mockRestore();
    });

    it('defaults the suite name to cypress when one is not provided', () => {
      const inputFilePath = path.join(tempDir, 'default-suite-timings.json');
      const outputFilePath = path.join(tempDir, 'default-suite-results.xml');

      fs.writeFileSync(
        inputFilePath,
        JSON.stringify({
          'cypress/deployed-and-local/integration/example.cy.ts': 500,
        }),
      );

      convertTestFileTimesToJunit({
        inputFilePath,
        outputFilePath,
      });

      expect(fs.readFileSync(outputFilePath, 'utf8')).toContain(
        'name="cypress"',
      );
    });
  });
});
