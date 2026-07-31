import {
  PublicCaseSearchResult,
  RawPublicCaseSearchResult,
} from './PublicCaseSearchResult';

describe('PublicCaseSearchResult entity', () => {
  it('should return validation errors for required fields when no data is passed in', () => {
    const searchResult = new PublicCaseSearchResult(
      {} as RawPublicCaseSearchResult,
    );
    const validationErrors = searchResult.getFormattedValidationErrors();

    expect(Object.keys(validationErrors!)).toEqual([
      'caseCaption',
      'docketNumber',
      'docketNumberWithSuffix',
      'petitionerNames',
      'petitionerStateNames',
      'receivedAt',
    ]);
  });

  it('should require the full search payload to be valid', () => {
    const searchResult = new PublicCaseSearchResult({
      caseCaption: 'Test Caption',
      docketNumber: '123-45',
      docketNumberWithSuffix: '123-45S',
      petitionerNames: ['Test Petitioner'],
      petitionerStateNames: ['California'],
      receivedAt: '2023-01-24T22:34:48.100Z',
    });

    expect(searchResult).toMatchObject({
      caseCaption: 'Test Caption',
      docketNumber: '123-45',
      docketNumberWithSuffix: '123-45S',
      petitionerNames: ['Test Petitioner'],
      petitionerStateNames: ['California'],
      receivedAt: '2023-01-24T22:34:48.100Z',
    });

    const validationErrors = searchResult.getFormattedValidationErrors();
    expect(validationErrors).toBeNull();
  });

  it('should be valid when optional fields are passed', () => {
    const searchResult = new PublicCaseSearchResult({
      caseCaption: 'Test Caption',
      docketNumber: '123-45',
      docketNumberWithSuffix: '123-45S',
      petitionerNames: ['Test Petitioner'],
      petitionerStateNames: ['California'],
      receivedAt: '2023-01-24T22:34:48.100Z',
    });

    const validationErrors = searchResult.getFormattedValidationErrors();
    expect(validationErrors).toBeNull();
  });
});
