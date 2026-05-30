import fs from 'fs';
import path from 'path';
import {
  readTestFileTimes,
  type TestFileTimes,
} from '../github-actions/test-file-times.helpers';

const escapeXml = (value: string): string => {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;');
};

const formatDurationInSeconds = (durationInMilliseconds: number): string => {
  return (durationInMilliseconds / 1000).toFixed(3);
};

export const buildJunitXmlFromTestFileTimes = ({
  suiteName,
  testFileTimes,
}: {
  suiteName: string;
  testFileTimes: TestFileTimes;
}): string => {
  const sortedEntries = Object.entries(testFileTimes).sort(([left], [right]) =>
    left.localeCompare(right),
  );
  const totalDurationInMilliseconds = sortedEntries.reduce(
    (accumulator: number, [, duration]: [string, number]) =>
      accumulator + duration,
    0,
  );

  const testCasesXml = sortedEntries
    .map(([filePath, durationInMilliseconds]: [string, number]) => {
      const escapedFilePath = escapeXml(filePath);

      return `    <testcase classname="${escapeXml(suiteName)}" file="${escapedFilePath}" name="${escapedFilePath}" time="${formatDurationInSeconds(durationInMilliseconds)}" />`;
    })
    .join('\n');

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    `<testsuites tests="${sortedEntries.length}" failures="0" errors="0" time="${formatDurationInSeconds(totalDurationInMilliseconds)}">`,
    `  <testsuite name="${escapeXml(suiteName)}" tests="${sortedEntries.length}" failures="0" errors="0" time="${formatDurationInSeconds(totalDurationInMilliseconds)}">`,
    testCasesXml,
    '  </testsuite>',
    '</testsuites>',
    '',
  ].join('\n');
};

export const writeJunitXmlFromTestFileTimes = ({
  inputFilePath,
  outputFilePath,
  suiteName,
}: {
  inputFilePath: string;
  outputFilePath: string;
  suiteName: string;
}): number => {
  const testFileTimes = readTestFileTimes(inputFilePath);
  const junitXml = buildJunitXmlFromTestFileTimes({
    suiteName,
    testFileTimes,
  });

  fs.mkdirSync(path.dirname(outputFilePath), { recursive: true });
  fs.writeFileSync(outputFilePath, junitXml);

  return Object.keys(testFileTimes).length;
};

export const convertTestFileTimesToJunit = ({
  inputFilePath,
  outputFilePath,
  suiteName = 'cypress',
}: {
  inputFilePath: string;
  outputFilePath: string;
  suiteName?: string;
}): void => {
  const testFileCount = writeJunitXmlFromTestFileTimes({
    inputFilePath,
    outputFilePath,
    suiteName,
  });

  console.log(
    `Wrote CircleCI test results to ${outputFilePath} (${testFileCount} test files).`,
  );
};
