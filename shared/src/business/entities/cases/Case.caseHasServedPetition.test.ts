import { INITIAL_DOCUMENT_TYPES } from '../EntityConstants';
import { caseHasServedPetition } from './Case';

describe('caseHasServedPetition', () => {
  it('should return true if the case petition docket entry has isLegacyServed set to true', () => {
    expect(
      caseHasServedPetition({
        docketEntries: [
          {
            documentType: INITIAL_DOCUMENT_TYPES.petition.documentType,
            isLegacyServed: true,
          },
        ],
      }),
    ).toBeTruthy();
  });

  it('should return true if the case petition docket entry has servedAt defined', () => {
    expect(
      caseHasServedPetition({
        docketEntries: [
          {
            documentType: INITIAL_DOCUMENT_TYPES.petition.documentType,
            servedAt: '2019-08-25T05:00:00.000Z',
          },
        ],
      }),
    ).toBeTruthy();
  });

  it('should return false if the case petition docket entry has no servedAt defined', () => {
    expect(
      caseHasServedPetition({
        docketEntries: [
          {
            documentType: INITIAL_DOCUMENT_TYPES.petition.documentType,
          },
        ],
      }),
    ).toBeFalsy();
  });

  it('should return false if the given case data does not have a docketEntry property', () => {
    expect(caseHasServedPetition({})).toBeFalsy();
  });
});
