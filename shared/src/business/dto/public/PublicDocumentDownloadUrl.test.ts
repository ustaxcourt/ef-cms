import { PublicDocumentDownloadUrl } from './PublicDocumentDownloadUrl';

describe('PublicDocumentDownloadUrl', () => {
  it('maps url and validates with a valid uri', () => {
    const dto = new PublicDocumentDownloadUrl({
      url: 'https://example.com/document.pdf',
    });

    expect(dto.entityName).toBe('PublicDocumentDownloadUrl');
    expect(dto.url).toBe('https://example.com/document.pdf');
    expect(dto.isValid()).toBe(true);
    expect(dto.getValidationErrors()).toBeNull();
  });

  it('is invalid when url is not a uri', () => {
    const dto = new PublicDocumentDownloadUrl({
      url: 'invalid-url',
    });

    expect(dto.isValid()).toBe(false);
    expect(dto.getValidationErrors()).toEqual(
      expect.objectContaining({
        url: expect.any(String),
      }),
    );
  });

  it('is invalid when url is missing', () => {
    const dto = new PublicDocumentDownloadUrl({} as unknown as { url: string });

    expect(dto.isValid()).toBe(false);
    expect(dto.getValidationErrors()).toEqual(
      expect.objectContaining({
        url: expect.any(String),
      }),
    );
  });
});
