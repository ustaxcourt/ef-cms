import * as crypto from 'crypto';
import * as fs from 'fs';
import * as path from 'path';
import { emailRegex, sanitizeDumpFile, sanitizeEmail } from './emailReplacer';
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

// Helper: run the regex against a string and return all matches (handles g-flag state)
const matchAll = (input: string): string[] => input.match(emailRegex) ?? [];

describe('emailRegex — local-part character classes', () => {
  it('matches uppercase letters in local part', () => {
    expect(matchAll('USER@example.com')).toEqual(['USER@example.com']);
  });

  it('matches lowercase letters in local part', () => {
    expect(matchAll('user@example.com')).toEqual(['user@example.com']);
  });

  it('matches digits in local part', () => {
    expect(matchAll('123@example.com')).toEqual(['123@example.com']);
  });

  it('matches period (.) in local part', () => {
    expect(matchAll('first.last@example.com')).toEqual([
      'first.last@example.com',
    ]);
  });

  it('matches exclamation mark (!) in local part', () => {
    expect(matchAll('use!r@example.com')).toEqual(['use!r@example.com']);
  });

  it('matches hash (#) in local part', () => {
    expect(matchAll('use#r@example.com')).toEqual(['use#r@example.com']);
  });

  it('matches dollar sign ($) in local part', () => {
    expect(matchAll('use$r@example.com')).toEqual(['use$r@example.com']);
  });

  it('matches percent (%) in local part', () => {
    expect(matchAll('use%r@example.com')).toEqual(['use%r@example.com']);
  });

  it('matches ampersand (&) in local part', () => {
    expect(matchAll('use&r@example.com')).toEqual(['use&r@example.com']);
  });

  it(`matches single quote (') in local part`, () => {
    expect(matchAll("use'r@example.com")).toEqual(["use'r@example.com"]);
  });

  it('matches asterisk (*) in local part', () => {
    expect(matchAll('use*r@example.com')).toEqual(['use*r@example.com']);
  });

  it('matches plus (+) in local part', () => {
    expect(matchAll('use+r@example.com')).toEqual(['use+r@example.com']);
  });

  it('matches forward slash (/) in local part', () => {
    expect(matchAll('use/r@example.com')).toEqual(['use/r@example.com']);
  });

  it('matches equals sign (=) in local part', () => {
    expect(matchAll('use=r@example.com')).toEqual(['use=r@example.com']);
  });

  it('matches question mark (?) in local part', () => {
    expect(matchAll('use?r@example.com')).toEqual(['use?r@example.com']);
  });

  it('matches caret (^) in local part', () => {
    expect(matchAll('use^r@example.com')).toEqual(['use^r@example.com']);
  });

  it('matches underscore (_) in local part', () => {
    expect(matchAll('use_r@example.com')).toEqual(['use_r@example.com']);
  });

  it('matches backtick (`) in local part', () => {
    expect(matchAll('use`r@example.com')).toEqual(['use`r@example.com']);
  });

  it('matches opening brace ({) in local part', () => {
    expect(matchAll('use{r@example.com')).toEqual(['use{r@example.com']);
  });

  it('matches pipe (|) in local part', () => {
    expect(matchAll('use|r@example.com')).toEqual(['use|r@example.com']);
  });

  it('matches closing brace (}) in local part', () => {
    expect(matchAll('use}r@example.com')).toEqual(['use}r@example.com']);
  });

  it('matches tilde (~) in local part', () => {
    expect(matchAll('use~r@example.com')).toEqual(['use~r@example.com']);
  });

  it('matches hyphen (-) in local part', () => {
    expect(matchAll('use-r@example.com')).toEqual(['use-r@example.com']);
  });

  it('matches a local part composed entirely of allowed special characters', () => {
    expect(matchAll(".!#$%&'*+/=?^_`{|}~-@example.com")).toEqual([
      ".!#$%&'*+/=?^_`{|}~-@example.com",
    ]);
  });
});

describe('emailRegex — domain structure', () => {
  it('matches a simple two-label domain', () => {
    expect(matchAll('user@example.com')).toEqual(['user@example.com']);
  });

  it('matches a subdomain (three labels)', () => {
    expect(matchAll('user@sub.example.com')).toEqual(['user@sub.example.com']);
  });

  it('matches a deeply nested subdomain (four labels)', () => {
    expect(matchAll('user@a.b.c.com')).toEqual(['user@a.b.c.com']);
  });

  it('matches a domain with a hyphen', () => {
    expect(matchAll('user@my-domain.com')).toEqual(['user@my-domain.com']);
  });

  it('matches digits in the domain label', () => {
    expect(matchAll('user@domain2.com')).toEqual(['user@domain2.com']);
  });

  it('matches a long TLD', () => {
    expect(matchAll('user@example.museum')).toEqual(['user@example.museum']);
  });
});

describe('emailRegex — negative lookbehind (backslash-escaped)', () => {
  it('does NOT match when immediately preceded by a backslash', () => {
    // Single-char local part ensures the regex has no remaining substring to re-try after the lookbehind blocks the match at position 1
    expect(matchAll('\\a@example.com')).toHaveLength(0);
  });

  it('DOES match when the backslash is two characters before (not immediately preceding)', () => {
    // The backslash precedes 'n', not the email itself
    expect(matchAll('\\n user@example.com')).toEqual(['user@example.com']);
  });
});

describe('emailRegex — non-matching inputs', () => {
  it('does not match a string with no @ symbol', () => {
    expect(matchAll('userexample.com')).toHaveLength(0);
  });

  it('does not match when there is no domain after @', () => {
    expect(matchAll('user@')).toHaveLength(0);
  });

  it('does not match when the domain has no dot (no TLD)', () => {
    expect(matchAll('user@nodot')).toHaveLength(0);
  });

  it('does not match a bare @ symbol', () => {
    expect(matchAll('@')).toHaveLength(0);
  });

  it('does not match an empty string', () => {
    expect(matchAll('')).toHaveLength(0);
  });

  it('does not match plain text with no email', () => {
    expect(matchAll('hello world, no emails here!')).toHaveLength(0);
  });
});

describe('emailRegex — multiple matches and positioning', () => {
  it('matches multiple emails on the same line', () => {
    expect(matchAll('a@foo.com and b@bar.com')).toEqual([
      'a@foo.com',
      'b@bar.com',
    ]);
  });

  it('matches an email at the very start of the string', () => {
    expect(matchAll('user@example.com rest of text')).toEqual([
      'user@example.com',
    ]);
  });

  it('matches an email at the very end of the string', () => {
    expect(matchAll('contact us at user@example.com')).toEqual([
      'user@example.com',
    ]);
  });

  it('matches three emails with duplicates and returns each occurrence', () => {
    expect(matchAll('a@b.com a@b.com c@d.com')).toEqual([
      'a@b.com',
      'a@b.com',
      'c@d.com',
    ]);
  });

  it('matches emails surrounded by punctuation', () => {
    expect(matchAll('(user@example.com)')).toEqual(['user@example.com']);
  });

  it('matches an email with multiple allowed special chars mixed in', () => {
    expect(matchAll('user.name+tag=inbox@sub.example.co.uk')).toEqual([
      'user.name+tag=inbox@sub.example.co.uk',
    ]);
  });
});
