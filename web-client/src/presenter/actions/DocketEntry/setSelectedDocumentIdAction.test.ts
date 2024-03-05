import { presenter } from '../../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';
import { setSelectedDocumentIdAction } from './setSelectedDocumentIdAction';

describe('setSelectedDocumentIdAction', () => {
  const mockDocketEntryId = 'be944d7c-63ac-459b-8a72-1a3c9e71ef70';

  it('should add document id for download if it has not been set already', async () => {
    const result = await runAction(setSelectedDocumentIdAction, {
      modules: {
        presenter,
      },
      props: {
        documentId: mockDocketEntryId,
      },
      state: {
        documentsSelectedForDownload: [],
      },
    });

    expect(result.state.documentsSelectedForDownload).toEqual([
      mockDocketEntryId,
    ]);
  });

  it('should add remove the document id from download list if it has been set already', async () => {
    const result = await runAction(setSelectedDocumentIdAction, {
      modules: {
        presenter,
      },
      props: {
        documentId: mockDocketEntryId,
      },
      state: {
        documentsSelectedForDownload: [mockDocketEntryId],
      },
    });

    expect(result.state.documentsSelectedForDownload).toEqual([]);
  });
});
