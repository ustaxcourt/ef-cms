import {
  PublicCaseSearchResponse,
  PublicDocketEntriesPageResponse,
  PublicDocumentSearchPageResponse,
  PublicDocumentSearchResponse,
  PublicPractitionerSearchResponse,
  PublicPractitionerSearchResults,
} from '@shared/business/dto/public/PublicResponseWrappers';

describe('PublicResponseWrappers', () => {
  it.each([
    new PublicDocketEntriesPageResponse(),
    new PublicCaseSearchResponse(),
    new PublicDocumentSearchResponse(),
    new PublicDocumentSearchPageResponse(),
    new PublicPractitionerSearchResponse(),
    new PublicPractitionerSearchResults(),
  ])('defines a validated response class for each wrapper', response => {
    expect(response.entityName).toBeDefined();
    expect(response.isValid()).toBe(true);
  });

  it('rejects unsupported practitioner cursor values', () => {
    const response = new PublicPractitionerSearchResults();
    Object.assign(response, { lastKey: [true] });

    expect(response.isValid()).toBe(false);
    expect(response.getValidationErrors()).toEqual(
      expect.objectContaining({
        'lastKey-0': expect.any(String),
      }),
    );
  });
});
