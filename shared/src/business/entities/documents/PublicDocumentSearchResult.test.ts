const { PublicDocumentSearchResult } = require('./PublicDocumentSearchResult');

const errorMessages = PublicDocumentSearchResult.VALIDATION_ERROR_MESSAGES;

describe('Public Document Search Result entity', () => {
  it('returns validation errors for required fields when no data is passed in', () => {
    const searchResult = new PublicDocumentSearchResult();
    const validationErrors = searchResult.getFormattedValidationErrors();

    expect(Object.keys(validationErrors)).toEqual([
      'caseCaption',
      'docketEntryId',
      'docketNumber',
      'documentTitle',
    ]);
  });

  it('needs only a case caption, docketEntryId, docketNumber, and documentTitle to be valid', () => {
    const searchResult = new PublicDocumentSearchResult({
      caseCaption: 'This is a case caption',
      docketEntryId: 'c5bee7c0-bd98-4504-890b-b00eb398e547',
      docketNumber: '12345-67',
      documentTitle: 'This is a matching document',
    });
    expect(searchResult).toMatchObject({
      caseCaption: 'This is a case caption',
      docketEntryId: 'c5bee7c0-bd98-4504-890b-b00eb398e547',
      docketNumber: '12345-67',
      documentTitle: 'This is a matching document',
    });
    const validationErrors = searchResult.getFormattedValidationErrors();
    expect(validationErrors).toEqual(null);
  });

  it('fails validation if the search result is stricken', () => {
    const searchResult = new PublicDocumentSearchResult({ isStricken: true });
    const validationErrors = searchResult.getFormattedValidationErrors();

    expect(validationErrors.isStricken).toEqual(errorMessages.isStricken);
  });

  it('fails validation if the search result is sealed but is not of type opinion', () => {
    const searchResult = new PublicDocumentSearchResult({
      caseCaption: 'This is a case caption',
      docketEntryId: 'c5bee7c0-bd98-4504-890b-b00eb398e547',
      docketNumber: '12345-67',
      documentTitle: 'This is a matching document',
      documentType: 'Order',
      eventCode: 'O', // O
      isSealed: true, // the event code MUST be an opinion type
    });
    const validationErrors = searchResult.getFormattedValidationErrors();

    expect(validationErrors.eventCode).toEqual(errorMessages.eventCode);
  });

  it('passes validation if the search result is for a sealed opinion', () => {
    const searchResult = new PublicDocumentSearchResult({
      caseCaption: 'This is a case caption',
      docketEntryId: 'c5bee7c0-bd98-4504-890b-b00eb398e547',
      docketNumber: '12345-67',
      documentTitle: 'This is a matching document',
      documentType: 'Memorandum Opinion',
      eventCode: 'MOP',
      isSealed: true,
    });
    const validationErrors = searchResult.getFormattedValidationErrors();

    expect(validationErrors).toBeNull();
  });

  it('passes validation even if numberOfPages is null', () => {
    const searchResult = new PublicDocumentSearchResult({
      caseCaption: 'This is a case caption',
      docketEntryId: 'c5bee7c0-bd98-4504-890b-b00eb398e547',
      docketNumber: '12345-67',
      documentTitle: 'This is a matching document',
      documentType: 'Memorandum Opinion',
      eventCode: 'MOP',
      isSealed: true,
      numberOfPages: null,
    });
    const validationErrors = searchResult.getFormattedValidationErrors();

    expect(validationErrors).toBeNull();
  });
});
