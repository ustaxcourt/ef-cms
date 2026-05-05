import fs from 'fs';
import os from 'os';
import path from 'path';
import { main } from './test-file-times';

describe('test-file-times script', () => {
  const tempDir = fs.mkdtempSync(
    path.join(os.tmpdir(), 'test-file-times-cli-'),
  );

  afterAll(() => {
    fs.rmSync(tempDir, { force: true, recursive: true });
  });

  it('writes standardized timings from jest output', () => {
    const inputFilePath = path.join(tempDir, 'jest-results.json');
    const outputFilePath = path.join(tempDir, 'timings.json');

    fs.writeFileSync(
      inputFilePath,
      JSON.stringify({
        testResults: [
          {
            endTime: 25,
            name: path.join(process.cwd(), 'scripts/example.test.ts'),
            startTime: 10,
          },
        ],
      }),
    );

    main(['from-jest', inputFilePath, outputFilePath]);

    expect(JSON.parse(fs.readFileSync(outputFilePath, 'utf8'))).toEqual({
      './scripts/example.test.ts': 15,
    });
  });

  it('merges timing files', () => {
    const leftFilePath = path.join(tempDir, 'left.json');
    const rightFilePath = path.join(tempDir, 'right.json');
    const outputFilePath = path.join(tempDir, 'merged.json');

    fs.writeFileSync(leftFilePath, JSON.stringify({ './left.test.ts': 10 }));
    fs.writeFileSync(rightFilePath, JSON.stringify({ './right.test.ts': 20 }));

    main(['merge', outputFilePath, leftFilePath, rightFilePath]);

    expect(JSON.parse(fs.readFileSync(outputFilePath, 'utf8'))).toEqual({
      './left.test.ts': 10,
      './right.test.ts': 20,
    });
  });

  it('throws for invalid commands', () => {
    expect(() => main(['oops'])).toThrow(
      'Usage: npx ts-node scripts/github-actions/test-file-times.ts <from-jest|merge> ...args',
    );
  });

  it('throws when required arguments are missing', () => {
    expect(() => main(['from-jest'])).toThrow(
      'Usage: npx ts-node scripts/github-actions/test-file-times.ts from-jest <input> <output>',
    );
    expect(() => main(['merge', path.join(tempDir, 'merged.json')])).toThrow(
      'Usage: npx ts-node scripts/github-actions/test-file-times.ts merge <output> <input...>',
    );
  });
});
