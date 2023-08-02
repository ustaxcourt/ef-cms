import { Case } from './Case';
import { DOCUMENT_PROCESSING_STATUS_OPTIONS } from '../EntityConstants';
import { MOCK_CASE } from '../../../test/mockCase';
import { MOCK_DOCUMENTS } from '../../../test/mockDocuments';
import { applicationContext } from '../../test/createTestApplicationContext';

describe('updateDocketEntry', () => {
  it('should replace the docket entry with the exact object provided', () => {
    const myCase = new Case(MOCK_CASE, {
      applicationContext,
    });

    myCase.updateDocketEntry({
      docketEntryId: MOCK_DOCUMENTS[0].docketEntryId,
      processingStatus: DOCUMENT_PROCESSING_STATUS_OPTIONS.COMPLETE,
    });

    expect(
      myCase.docketEntries.find(
        d => d.docketEntryId === MOCK_DOCUMENTS[0].docketEntryId,
      ),
    ).toEqual({
      docketEntryId: MOCK_DOCUMENTS[0].docketEntryId,
      processingStatus: DOCUMENT_PROCESSING_STATUS_OPTIONS.COMPLETE,
    });
  });

  it('should not change any docketEntries if no match is found', () => {
    const myCase = new Case(MOCK_CASE, {
      applicationContext,
    });

    myCase.updateDocketEntry({
      docketEntryId: '11001001',
      processingStatus: DOCUMENT_PROCESSING_STATUS_OPTIONS.COMPLETE,
    });

    expect(myCase.docketEntries).toMatchObject(MOCK_DOCUMENTS);
  });
});
