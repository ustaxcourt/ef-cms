import { getDocumentStorageIdAction } from './getDocumentStorageIdAction';
import { presenter } from '../../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('getDocumentStorageIdAction', () => {
  const mockDocketEntryId = 'abc-123-docket-entry-id';
  const mockDocumentStorageId = 'xyz-789-storage-id';

  const mockCaseDetail = {
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

  it('should return documentStorageId when docketEntryId is provided in props.file', async () => {
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

  it('should prefer props.docketEntryId over props.file.docketEntryId', async () => {
    const otherDocketEntryId = 'other-docket-entry-id';
    const otherDocumentStorageId = 'other-storage-id';

    const caseDetailWithMultipleEntries = {
      docketEntries: [
        {
          docketEntryId: mockDocketEntryId,
          documentStorageId: mockDocumentStorageId,
        },
        {
          docketEntryId: otherDocketEntryId,
          documentStorageId: otherDocumentStorageId,
        },
      ],
    };

    const result = await runAction(getDocumentStorageIdAction, {
      modules: {
        presenter,
      },
      props: {
        docketEntryId: mockDocketEntryId,
        file: {
          docketEntryId: otherDocketEntryId,
        },
      },
      state: {
        caseDetail: caseDetailWithMultipleEntries,
      },
    });

    expect(result.output.documentStorageId).toEqual(mockDocumentStorageId);
  });
});
