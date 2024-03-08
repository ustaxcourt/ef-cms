import { presenter } from '../../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';
import { setSelectedDocumentIdAction } from './setSelectedDocumentIdAction';

describe('setSelectedDocumentIdAction', () => {
  const mockDocumentOne = {
    docketEntryId: 'be944d7c-63ac-459b-8a72-1a3c9e71ef70',
  };

  const mockDocumentTwo = {
    docketEntryId: 'ae944d7c-63zz-459b-8a72-1a3c9e71ef74',
  };

  const docketEntries = [mockDocumentOne];

  it('should add a document id state.documentsSelectedForDownload if it has not been previously set', async () => {
    const result = await runAction(setSelectedDocumentIdAction, {
      modules: {
        presenter,
      },
      props: {
        docketEntries,
      },
      state: {
        documentsSelectedForDownload: [mockDocumentTwo],
      },
    });

    expect(result.state.documentsSelectedForDownload).toEqual([
      mockDocumentTwo,
      mockDocumentOne,
    ]);
  });

  it('should remove the selected document id from state.documentsSelectedForDownload if it was previously set', async () => {
    const result = await runAction(setSelectedDocumentIdAction, {
      modules: {
        presenter,
      },
      props: {
        docketEntries,
      },
      state: {
        documentsSelectedForDownload: [mockDocumentOne, mockDocumentTwo],
      },
    });

    expect(result.state.documentsSelectedForDownload).toEqual([
      mockDocumentTwo,
    ]);
  });

  it('should add all selected document ids to state.documentsSelectedForDownload if they were not previously selected', async () => {
    const result = await runAction(setSelectedDocumentIdAction, {
      modules: {
        presenter,
      },
      props: {
        docketEntries: [mockDocumentOne, mockDocumentTwo],
      },
      state: {
        documentsSelectedForDownload: [mockDocumentOne],
      },
    });

    expect(result.state.documentsSelectedForDownload).toEqual([
      mockDocumentOne,
      mockDocumentTwo,
    ]);
  });

  it('should remove all selected document ids from state.documentsSelectedForDownload if they were previously', async () => {
    const result = await runAction(setSelectedDocumentIdAction, {
      modules: {
        presenter,
      },
      props: {
        docketEntries: [mockDocumentOne, mockDocumentTwo],
      },
      state: {
        documentsSelectedForDownload: [mockDocumentOne, mockDocumentTwo],
      },
    });

    expect(result.state.documentsSelectedForDownload).toEqual([]);
  });
});
