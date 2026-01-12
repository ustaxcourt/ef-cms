import * as fs from 'fs';
import * as path from 'path';
import { sanitizeDumpFile } from './emailReplacer';
import * as readline from 'readline';

jest.mock('fs');
jest.mock('path');
jest.mock('readline');

describe('sanitizeDumpFile', () => {
  const mockConsoleLog = jest.spyOn(console, 'log').mockImplementation();
  const mockConsoleError = jest.spyOn(console, 'error').mockImplementation();
  const mockProcessExit = jest
    .spyOn(process, 'exit')
    .mockImplementation(jest.fn() as any);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should throw an error when input file does not exist', async () => {
    (fs.existsSync as jest.Mock).mockReturnValue(false);

    await sanitizeDumpFile('nonexistent.txt', 'output.txt');

    expect(mockConsoleError).toHaveBeenCalledWith(
      'Error:',
      'Input file does not exist: nonexistent.txt',
    );
    expect(mockProcessExit).toHaveBeenCalledWith(1);
  });

  it('should replace email addresses in a file using default parameters', async () => {
    const inputPath = 'test-input.txt';
    const parsedPath = {
      dir: '/test-dir',
      name: 'test-input',
      ext: '.txt',
    };
    const expectedOutputPath = '/test-dir/test-input-sanitized.txt';
    const inputContent =
      'Contact us at test@example.com or support@example.org';

    (fs.existsSync as jest.Mock).mockReturnValue(true);
    (fs.createReadStream as jest.Mock).mockReturnValue(inputContent);
    (fs.createWriteStream as jest.Mock).mockReturnValue({
      write: jest.fn(),
      end: jest.fn(),
    });
    (path.parse as jest.Mock).mockReturnValue(parsedPath);
    (path.join as jest.Mock).mockReturnValue(expectedOutputPath);
    (readline.createInterface as jest.Mock).mockReturnValue([
      'line 1',
      'line 2',
      'some@email.com and some2@email.com at some@email.com',
    ]);

    await sanitizeDumpFile(inputPath, expectedOutputPath);

    expect(fs.createReadStream).toHaveBeenCalledWith(inputPath, {
      encoding: 'utf-8',
    });
    expect(fs.createWriteStream).toHaveBeenCalledWith(expectedOutputPath, {
      encoding: 'utf-8',
    });

    expect(mockConsoleLog).toHaveBeenCalledWith(
      'Found and anonymized 3 email addresses.',
    );
  });

  it('should handle file content with no email addresses', async () => {
    const inputPath = 'test-input.txt';
    const parsedPath = {
      dir: '/test-dir',
      name: 'test-input',
      ext: '.txt',
    };
    const expectedOutputPath = '/test-dir/test-input-sanitized.txt';
    const inputContent =
      'Contact us at test@example.com or support@example.org';

    (fs.existsSync as jest.Mock).mockReturnValue(true);
    (fs.createReadStream as jest.Mock).mockReturnValue(inputContent);
    (fs.createWriteStream as jest.Mock).mockReturnValue({
      write: jest.fn(),
      end: jest.fn(),
    });
    (path.parse as jest.Mock).mockReturnValue(parsedPath);
    (path.join as jest.Mock).mockReturnValue(expectedOutputPath);
    (readline.createInterface as jest.Mock).mockReturnValue([
      'line 1',
      'line 2',
      'line 3',
    ]);

    await sanitizeDumpFile(inputPath, expectedOutputPath);

    expect(mockConsoleLog).toHaveBeenCalledWith(
      'Found and anonymized 0 email addresses.',
    );
  });

  it('should handle errors during file processing', async () => {
    const inputPath = 'test-input.txt';
    const parsedPath = {
      dir: '/test-dir',
      name: 'test-input',
      ext: '.txt',
    };
    const expectedOutputPath = '/test-dir/test-input-sanitized.txt';
    const errorMessage = 'Failed to read file';

    (fs.existsSync as jest.Mock).mockReturnValue(true);
    (fs.createReadStream as jest.Mock).mockImplementation(() => {
      throw new Error(errorMessage);
    });
    (fs.createWriteStream as jest.Mock).mockReturnValue({
      write: jest.fn(),
      end: jest.fn(),
    });
    (path.parse as jest.Mock).mockReturnValue(parsedPath);
    (path.join as jest.Mock).mockReturnValue(expectedOutputPath);
    (readline.createInterface as jest.Mock).mockReturnValue([
      'line 1',
      'line 2',
      'line 3',
    ]);

    await sanitizeDumpFile(inputPath, expectedOutputPath);

    expect(mockConsoleError).toHaveBeenCalledWith('Error:', errorMessage);
    expect(mockProcessExit).toHaveBeenCalledWith(1);
  });
});
