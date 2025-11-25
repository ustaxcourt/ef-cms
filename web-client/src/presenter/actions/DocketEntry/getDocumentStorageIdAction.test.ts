import { presenter } from '../../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';
import { getDocumentStorageIdAction } from './getDocumentStorageIdAction';

describe('getDocumentStorageIdAction', () => {
  const mockDocketEntryId = 'be944d7c-63ac-459b-8a72-1a3c9e71ef70';
  const mockDocumentStorageId = 'be944d7c-63ac-459b-8a72-1a3c9e71ef70';
  const mockCaseDetail = {
    docketNumber: '123-45',
    docketEntries: [
      {
        docketEntryId: mockDocketEntryId,
        documentStorageId: mockDocumentStorageId,
      },
    ],
  };

  it('should make a call to edit a paper filed docket entry and include consolidated group docket numbers when user has opted to multi-docket the paper filing', async () => {
    const result = await runAction(getDocumentStorageIdAction, {
      modules: {
        presenter,
      },
      props: {
        docketEntryId: mockDocketEntryId,
      },
      state: {
        caseDetail: mockCaseDetail,
      },
    });
    expect(result.output.documentStorageId).toEqual(mockDocumentStorageId);
  });
});
