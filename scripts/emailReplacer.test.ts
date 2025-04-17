import * as fs from 'fs';
import * as path from 'path';
import { replaceEmailAddresses } from './emailReplacer';

jest.mock('fs');
jest.mock('path');

describe('replaceEmailAddresses', () => {
  const mockConsoleLog = jest.spyOn(console, 'log').mockImplementation();
  const mockConsoleError = jest.spyOn(console, 'error').mockImplementation();
  const mockProcessExit = jest
    .spyOn(process, 'exit')
    .mockImplementation(jest.fn() as any);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should throw an error when input file does not exist', () => {
    (fs.existsSync as jest.Mock).mockReturnValue(false);

    replaceEmailAddresses('nonexistent.txt');

    expect(mockConsoleError).toHaveBeenCalledWith(
      'Error:',
      'Input file does not exist: nonexistent.txt',
    );
    expect(mockProcessExit).toHaveBeenCalledWith(1);
  });

  it('should replace email addresses in a file using default parameters', () => {
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
    (fs.readFileSync as jest.Mock).mockReturnValue(inputContent);
    (path.parse as jest.Mock).mockReturnValue(parsedPath);
    (path.join as jest.Mock).mockReturnValue(expectedOutputPath);

    replaceEmailAddresses(inputPath);

    expect(fs.readFileSync).toHaveBeenCalledWith(inputPath, 'utf8');
    expect(fs.writeFileSync).toHaveBeenCalledWith(
      expectedOutputPath,
      expect.any(String),
    );
    expect(mockConsoleLog).toHaveBeenCalledWith(
      expect.stringContaining('Email addresses anonymized'),
      expect.stringContaining(expectedOutputPath),
    );
    expect(mockConsoleLog).toHaveBeenCalledWith(
      'Found and anonymized 2 email addresses.',
    );
  });

  it('should use custom output path when provided', () => {
    const inputPath = 'test-input.txt';
    const outputPath = 'custom-output.txt';
    const inputContent = 'Contact us at test@example.com';

    (fs.existsSync as jest.Mock).mockReturnValue(true);
    (fs.readFileSync as jest.Mock).mockReturnValue(inputContent);

    replaceEmailAddresses(inputPath, outputPath);

    expect(fs.writeFileSync).toHaveBeenCalledWith(
      outputPath,
      expect.any(String),
    );
    expect(mockConsoleLog).toHaveBeenCalledWith(
      expect.stringContaining('Email addresses anonymized'),
      expect.stringContaining(outputPath),
    );
  });

  it('should handle file content with no email addresses', () => {
    const inputPath = 'test-input.txt';
    const inputContent = 'This text has no email addresses';

    (fs.existsSync as jest.Mock).mockReturnValue(true);
    (fs.readFileSync as jest.Mock).mockReturnValue(inputContent);

    replaceEmailAddresses(inputPath);

    expect(fs.writeFileSync).toHaveBeenCalled();
    expect(mockConsoleLog).toHaveBeenCalledWith(
      'Found and anonymized 0 email addresses.',
    );
  });

  it('should handle errors during file processing', () => {
    const inputPath = 'test-input.txt';
    const errorMessage = 'Failed to read file';

    (fs.existsSync as jest.Mock).mockReturnValue(true);
    (fs.readFileSync as jest.Mock).mockImplementation(() => {
      throw new Error(errorMessage);
    });

    replaceEmailAddresses(inputPath);

    expect(mockConsoleError).toHaveBeenCalledWith('Error:', errorMessage);
    expect(mockProcessExit).toHaveBeenCalledWith(1);
  });

  it('should consistently anonymize the same email address', () => {
    const inputPath = 'test-input.txt';
    const inputContent = 'Email: test@example.com and again test@example.com';

    (fs.existsSync as jest.Mock).mockReturnValue(true);
    (fs.readFileSync as jest.Mock).mockReturnValue(inputContent);

    replaceEmailAddresses(inputPath);

    const writeCall = (fs.writeFileSync as jest.Mock).mock.calls[0];
    const outputContent = writeCall[1];

    const matches = outputContent.match(
      /([a-f0-9]{32}@mig\.ef-cms\.ustaxcourt\.gov)/g,
    );
    expect(matches).toHaveLength(2);
    expect(matches![0]).toBe(matches![1]);
  });
});
