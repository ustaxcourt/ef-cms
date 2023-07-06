import { Case, getPetitionDocketEntry } from './Case';
import { INITIAL_DOCUMENT_TYPES } from '../EntityConstants';
import { MOCK_CASE } from '../../../test/mockCase';
import { applicationContext } from '../../test/createTestApplicationContext';

describe('getPetitionDocketEntry', () => {
  it('should get the petition docket entry by documentType', () => {
    const myCase = new Case(MOCK_CASE, {
      applicationContext,
    });
    const result = myCase.getPetitionDocketEntry();
    expect(result.documentType).toEqual(
      INITIAL_DOCUMENT_TYPES.petition.documentType,
    );
  });

  it('should get the petition docket entry from a raw case', () => {
    const result = getPetitionDocketEntry(MOCK_CASE);
    expect(result.documentType).toEqual(
      INITIAL_DOCUMENT_TYPES.petition.documentType,
    );
  });

  it('should not throw an error when raw case does not have docketEntries', () => {
    expect(() =>
      getPetitionDocketEntry({ ...MOCK_CASE, docketEntries: undefined }),
    ).not.toThrow();
  });
});
