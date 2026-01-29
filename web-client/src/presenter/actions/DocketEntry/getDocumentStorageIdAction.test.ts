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

  it('should return documentStorageId when docketEntryId is provided in props', async () => {
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

  it('should return an empty object if docketEntryId is undefined due to uploading a new document', async () => {
    const result = await runAction(getDocumentStorageIdAction, {
      modules: {
        presenter,
      },
      props: {},
      state: {
        caseDetail: mockCaseDetail,
      },
    });

    expect(result.output).toEqual({});
  });

  it('should return an empty object if docket entry is not found in docketEntries', async () => {
    const result = await runAction(getDocumentStorageIdAction, {
      modules: {
        presenter,
      },
      props: {
        docketEntryId: 'non-existent-id',
      },
      state: {
        caseDetail: mockCaseDetail,
      },
    });

    expect(result.output).toEqual({});
  });
});
