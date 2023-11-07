import { InternalDocumentSearchResult } from './InternalDocumentSearchResult';

describe('InternalDocumentSearchResult', () => {
  it('should return validation errors for required fields when no data is passed in', () => {
    const searchResult = new InternalDocumentSearchResult({});

    const validationErrors = searchResult.getFormattedValidationErrors();

    expect(Object.keys(validationErrors!)).toEqual([
      'caseCaption',
      'docketEntryId',
      'docketNumber',
      'documentTitle',
    ]);
  });

  it('should needs only a case caption, docketEntryId, docketNumber, and documentTitle to be valid', () => {
    const searchResult = new InternalDocumentSearchResult({
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

    expect(validationErrors).toBeNull();
  });

  it('should be valid when the search result is a stricken docket entry', () => {
    const searchResult = new InternalDocumentSearchResult({
      caseCaption: 'This is a case caption',
      docketEntryId: 'c5bee7c0-bd98-4504-890b-b00eb398e547',
      docketNumber: '12345-67',
      documentTitle: 'This is a matching document',
      isStricken: true,
    });

    const validationErrors = searchResult.getFormattedValidationErrors();

    expect(validationErrors).toBeNull();
  });

  it('should be valid when the search result is sealed but is not of type opinion', () => {
    const searchResult = new InternalDocumentSearchResult({
      caseCaption: 'This is a case caption',
      docketEntryId: 'c5bee7c0-bd98-4504-890b-b00eb398e547',
      docketNumber: '12345-67',
      documentTitle: 'This is a matching document',
      documentType: 'Order',
      eventCode: 'O', // O
      isDocketEntrySealed: true, // the event code MUST be an opinion type
    });

    const validationErrors = searchResult.getFormattedValidationErrors();

    expect(validationErrors).toBeNull();
  });

  it('should be valid when the search result is an opinion that is sealed', () => {
    const searchResult = new InternalDocumentSearchResult({
      caseCaption: 'This is a case caption',
      docketEntryId: 'c5bee7c0-bd98-4504-890b-b00eb398e547',
      docketNumber: '12345-67',
      documentTitle: 'This is a matching document',
      documentType: 'Memorandum Opinion',
      eventCode: 'MOP',
      isDocketEntrySealed: true,
    });

    const validationErrors = searchResult.getFormattedValidationErrors();

    expect(validationErrors).toBeNull();
  });

  it('should be valid when optional fields are all null', () => {
    const searchResult = new InternalDocumentSearchResult({
      caseCaption: 'This is a case caption',
      docketEntryId: 'c5bee7c0-bd98-4504-890b-b00eb398e547',
      docketNumber: '12345-67',
      documentTitle: 'This is a matching document',
      documentType: 'Memorandum Opinion',
      eventCode: 'MOP',
      isCaseSealed: false,
      isDocketEntrySealed: true,
      isFileAttached: false,
      judge: null, // Optional
      numberOfPages: null, // Optional
      signedJudgeName: null, // Optional
    });

    const validationErrors = searchResult.getFormattedValidationErrors();

    expect(validationErrors).toBeNull();
  });
});
