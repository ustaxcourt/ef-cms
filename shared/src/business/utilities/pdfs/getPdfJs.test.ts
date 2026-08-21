jest.mock('@thednp/dommatrix', () => ({ default: class DOMMatrix {} }), {
  virtual: true,
});
import { UNSUPPORTED_BROWSER_ERROR_MESSAGE } from '@web-client/views/FileHandlingHelpers/pdfValidation';
import { clientSupportsES2022, getPdfJs } from './getPdfJs';

describe('Broweser Compatibility Checks', () => {
  const mockUserAgent = (userAgent: string) => {
    Object.defineProperty(navigator, 'userAgent', {
      configurable: true,
      value: userAgent,
    });
  };
  describe('getPdfJs - Dynamic Import Failure', () => {
    jest.mock('pdfjs-dist/legacy/build/pdf.mjs', () => {
      throw new Error('Dynamic import failed');
    });
    it('should throw an error if pdfjs-dist fails to import', async () => {
      jest.spyOn(global.console, 'error').mockImplementation(() => {});
      await expect(getPdfJs()).rejects.toThrow('Dynamic import failed');
      // Restore the original import implementation
      jest.restoreAllMocks();
    });

    it('should throw UnsupportedBrowserException for unsupported browsers', async () => {
      jest.spyOn(global.console, 'error').mockImplementation(() => {});

      mockUserAgent(
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.6 Safari/605.1.15',
      );

      await expect(getPdfJs()).rejects.toThrow(
        UNSUPPORTED_BROWSER_ERROR_MESSAGE,
      );
      // Restore the original import implementation
      jest.restoreAllMocks();
    });
  });

  it('clientSupportsES2022 should reject old Safari browser (version < 16)', () => {
    // Set Safari 15.6 user agent
    mockUserAgent(
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.6 Safari/605.1.15',
    );

    const result = clientSupportsES2022();
    expect(result).toBe(false);
  });

  it('clientSupportsES2022 should accept modern Safari browser (version >= 16)', () => {
    // Set Safari 16.1 user agent (should be accepted)
    mockUserAgent(
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.1 Safari/605.1.15',
    );
    const result = clientSupportsES2022();
    expect(result).toBe(true);
  });

  it('clientSupportsES2022 should be false for empty user agent', () => {
    mockUserAgent('');
    const result = clientSupportsES2022();
    expect(result).toBe(false);
  });
  it('clientSupportsES2022 should be false for invalid user agent', () => {
    mockUserAgent('    ');
    const result = clientSupportsES2022();
    expect(result).toBe(false);
  });

  it('clientSupportsES2022 should be false if safari user agent without version', () => {
    mockUserAgent(
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Safari',
    );
    const result = clientSupportsES2022();
    expect(result).toBe(false);
  });

  it('clientSupportsES2022 should be false for unsupported browser', () => {
    jest.spyOn(global, 'Function').mockImplementation(() => {
      throw new Error('UnsupportedBrowserException');
    });
    mockUserAgent('UnsupportedBrowser/1.0');
    const result = clientSupportsES2022();
    expect(result).toBe(false);
  });

  it('clientSupportsES2022 should be false if safari user agent with a version with no numeric major nor numeric minor versions', () => {
    mockUserAgent(
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/a.b Safari/605.1.15',
    );
    const result = clientSupportsES2022();
    expect(result).toBe(false);
  });

  it('clientSupportsES2022 should be false if safari user agent with a version with a numeric major version and no numeric minor versions', () => {
    mockUserAgent(
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/7.b Safari/605.1.15',
    );
    const result = clientSupportsES2022();
    expect(result).toBe(false);
  });

  it('clientSupportsES2022 should be false if safari user agent with a version with a non-numeric major version and a numeric minor versions', () => {
    mockUserAgent(
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/a.7 Safari/605.1.15',
    );
    const result = clientSupportsES2022();
    expect(result).toBe(false);
  });
});
