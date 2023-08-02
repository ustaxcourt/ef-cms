import { Case } from './Case';
import { MOCK_CASE } from '../../../test/mockCase';
import { MOCK_DOCUMENTS } from '../../../test/mockDocuments';
import { applicationContext } from '../../test/createTestApplicationContext';

describe('deleteDocketEntryById', () => {
  it('should delete the document with the given id', () => {
    const myCase = new Case(MOCK_CASE, {
      applicationContext,
    });
    const docketEntryIdToDelete = MOCK_DOCUMENTS[1].docketEntryId;
    expect(myCase.docketEntries.length).toEqual(4);
    myCase.deleteDocketEntryById({
      docketEntryId: docketEntryIdToDelete,
    });
    expect(myCase.docketEntries.length).toEqual(3);
    expect(
      myCase.docketEntries.find(d => d.docketEntryId === docketEntryIdToDelete),
    ).toBeUndefined();
  });

  it('should not delete a document if a document with the given id does not exist', () => {
    const myCase = new Case(MOCK_CASE, {
      applicationContext,
    });
    const docketEntryIdToDelete = '016fda7d-eb0a-4194-b603-ef422c898122';
    expect(myCase.docketEntries.length).toEqual(4);
    myCase.deleteDocketEntryById({
      docketEntryId: docketEntryIdToDelete,
    });
    expect(myCase.docketEntries.length).toEqual(4);
  });
});
