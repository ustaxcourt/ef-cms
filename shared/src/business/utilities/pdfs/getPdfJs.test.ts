import { clientSupportsES2022 } from './getPdfJs';

describe('Broweser Compatibility Checks', () => {
  const mockUserAgent = (userAgent: string) => {
    Object.defineProperty(navigator, 'userAgent', {
      configurable: true,
      value: userAgent,
    });
  };

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
    mockUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Safari');
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
});
