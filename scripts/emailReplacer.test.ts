import * as crypto from 'crypto';
import * as fs from 'fs';
import * as path from 'path';
import { sanitizeDumpFile, sanitizeEmail } from './emailReplacer';
import * as readline from 'readline';

jest.mock('fs');
jest.mock('path');
jest.mock('readline');
jest.mock('crypto', () => {
  const actualCrypto = jest.requireActual('crypto');
  return {
    ...actualCrypto,
    createHash: jest.fn((...args) => actualCrypto.createHash(...args)),
  };
});

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

describe('sanitizeEmail', () => {
  const actualCrypto = jest.requireActual('crypto');

  beforeEach(() => {
    // Reset createHash back to the real implementation before each test
    (crypto.createHash as jest.Mock).mockImplementation((...args) =>
      actualCrypto.createHash(...args),
    );
    jest.clearAllMocks();
  });

  it('should return an empty string when given an empty string', () => {
    expect(sanitizeEmail('')).toBe('');
  });

  it('should return a hashed email with the ustc.gov domain', () => {
    const result = sanitizeEmail('john@real.com');
    expect(result).toMatch(/^[a-f0-9]+@ustc\.gov$/);
  });

  it('should return the same hash for the same email when called multiple times', () => {
    const first = sanitizeEmail('john@real.com');
    const second = sanitizeEmail('john@real.com');
    expect(first).toBe(second);
  });

  it('should return different hashes for different emails', () => {
    const first = sanitizeEmail('john@real.com');
    const second = sanitizeEmail('jane@real.com');
    expect(first).not.toBe(second);
  });

  it('should produce a hash of the correct length (8 hex chars + @ustc.gov)', () => {
    const result = sanitizeEmail('test@test.com');
    const [localPart] = result.split('@');
    expect(localPart).toHaveLength(8);
  });

  it('should handle emails with special allowed characters', () => {
    const result = sanitizeEmail('test.name+tag@sub.domain.com');
    expect(result).toMatch(/^[a-f0-9]+@ustc\.gov$/);
  });

  it('should handle hash collisions by generating a new unique hash', () => {
    const mockDigest = jest
      .fn()
      .mockReturnValueOnce('aabbccdd') // hash for email1
      .mockReturnValueOnce('aabbccdd') // collision for email2
      .mockReturnValueOnce('11223344'); // resolved hash for email2

    (crypto.createHash as jest.Mock).mockReturnValue({
      update: jest.fn().mockReturnThis(),
      digest: mockDigest,
    });

    const first = sanitizeEmail('email1@test.com');
    const second = sanitizeEmail('email2@test.com');

    expect(first).toBe('aabbccdd@ustc.gov');
    expect(second).toBe('11223344@ustc.gov');
    expect(first).not.toBe(second);
  });
});
