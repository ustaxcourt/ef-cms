import { presenter } from '../../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';
import { setSelectedDocumentIdAction } from './setSelectedDocumentIdAction';

describe('setSelectedDocumentIdAction', () => {
  const mockDocketEntryIdOne = 'be944d7c-63ac-459b-8a72-1a3c9e71ef70';
  const mockDocketEntryIdTwo = 'ae944d7c-63zz-459b-8a72-1a3c9e71ef74';

  let documentIds = [mockDocketEntryIdOne];

  it('should add a document id state.documentsSelectedForDownload if it has not been previously set', async () => {
    const result = await runAction(setSelectedDocumentIdAction, {
      modules: {
        presenter,
      },
      props: {
        documentIds,
      },
      state: {
        documentsSelectedForDownload: [],
      },
    });

    expect(result.state.documentsSelectedForDownload).toEqual([
      mockDocketEntryIdOne,
    ]);
  });

  it('should remove the selected document id from state.documentsSelectedForDownload if it was previously set', async () => {
    const result = await runAction(setSelectedDocumentIdAction, {
      modules: {
        presenter,
      },
      props: {
        documentIds,
      },
      state: {
        documentsSelectedForDownload: [mockDocketEntryIdOne],
      },
    });

    expect(result.state.documentsSelectedForDownload).toEqual([]);
  });

  it('should add all selected document ids to state.documentsSelectedForDownload if they were not previously selected', async () => {
    const result = await runAction(setSelectedDocumentIdAction, {
      modules: {
        presenter,
      },
      props: {
        documentIds: [mockDocketEntryIdOne, mockDocketEntryIdTwo],
      },
      state: {
        documentsSelectedForDownload: [mockDocketEntryIdOne],
      },
    });

    expect(result.state.documentsSelectedForDownload).toEqual([
      mockDocketEntryIdOne,
      mockDocketEntryIdTwo,
    ]);
  });

  it('should remove all selected document ids from state.documentsSelectedForDownload if they were previously', async () => {
    const result = await runAction(setSelectedDocumentIdAction, {
      modules: {
        presenter,
      },
      props: {
        documentIds: [mockDocketEntryIdOne, mockDocketEntryIdTwo],
      },
      state: {
        documentsSelectedForDownload: [
          mockDocketEntryIdOne,
          mockDocketEntryIdTwo,
        ],
      },
    });

    expect(result.state.documentsSelectedForDownload).toEqual([]);
  });
});
