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

  it('should retrieve documentStorageId from state.caseDetail for a given docketEntryId', async () => {
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

  it('should retrieve documentStorageId using props.file.docketEntryId when there is no props.docketEntryId', async () => {
    const result = await runAction(getDocumentStorageIdAction, {
      modules: {
        presenter,
      },
      props: {
        file: {
          docketEntryId: mockDocketEntryId,
        },
      },
      state: {
        caseDetail: mockCaseDetail,
      },
    });

    expect(result.output.documentStorageId).toEqual(mockDocumentStorageId);
  });
});
